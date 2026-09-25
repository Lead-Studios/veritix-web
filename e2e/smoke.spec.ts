import { expect, test } from '@playwright/test';

/**
 * Smoke coverage: the landing page renders, and an unauthenticated visitor is
 * sent to sign-in instead of into the app.
 *
 * Deliberately narrow. This suite exists to fail fast when the app does not boot
 * or a route stops resolving at all — not to cover behaviour. The previous
 * `e2e/` specs were removed because they asserted against pages that no longer
 * exist, so every URL below is one that is actually served today, and each
 * assertion is about something that is true regardless of whether the backend
 * is running.
 */

/** Paths `src/proxy.ts` treats as requiring a session. */
const PROTECTED_PATHS = ['/dashboard', '/my-tickets', '/checkout', '/settings'] as const;

/**
 * Public routes that render without a backend. `/events` is deliberately absent:
 * it is a client component that fetches from the API and imports
 * `ui/pagination`, so a 200 there says nothing about the app and a failure says
 * nothing useful.
 */
const PUBLIC_PATHS = ['/', '/pricing', '/terms', '/privacy'] as const;

test.describe('landing page', () => {
  test('responds 200 and sets the page title', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.status()).toBe(200);
    // The root layout applies a `%s · Veritix` title template, so the rendered
    // title is the page's own plus the site name. Asserting the whole string
    // would break the moment either half is reworded for no useful reason.
    await expect(page).toHaveTitle(/on-chain ticketing/i);
  });

  test('renders the landmarks a screen reader navigates by', async ({ page }) => {
    await page.goto('/');

    // `banner` and `contentinfo` only come from `<header>` / `<footer>` that are
    // not nested inside a sectioning element, so these assertions also check
    // that the public layout has not been restructured into a nesting that
    // silently drops the landmark roles.
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();

    // Exactly one h1. A second one means two sections both claim to be the page
    // heading, which is the most common regression in an App Router tree.
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('the skip link reaches the main landmark', async ({ page }) => {
    await page.goto('/');

    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeAttached();
    await expect(skip).toHaveAttribute('href', '#main');
    // It is visually hidden until focused, which is the whole point: a sighted
    // keyboard user must be able to reveal it. `sr-only` keeps it in the
    // accessibility tree rather than hiding it with `display: none`.
    await skip.focus();
    await expect(skip).toBeVisible();
    // Pressed rather than clicked: a skip link that only works with a mouse is
    // not a skip link, and `click()` would not notice the difference.
    await skip.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });

  test('the footer newsletter form is present and labels its field', async ({ page }) => {
    await page.goto('/');

    // The form is part of the landing page shell, so its absence means the
    // footer failed to render rather than that the form is broken.
    const email = page.getByLabel('Email address');
    await expect(email).toBeVisible();
    await expect(email).toHaveAttribute('type', 'email');

    // A submission endpoint that does not exist is the specific failure this
    // guards: the form renders fine and 404s on submit.
    const response = await page.request.post('/api/newsletter', {
      data: { email: 'smoke@example.com' },
    });
    // 201 when the backend is reachable, 502 when it is not. Either is a real
    // answer from the route; a 404 means the route is missing.
    expect([201, 502]).toContain(response.status());
  });
});

test.describe('route guard', () => {
  for (const path of PROTECTED_PATHS) {
    test(`redirects ${path} to sign-in, keeping the destination`, async ({ page }) => {
      await page.goto(path);

      // The guard is what is under test, and `next` is what makes the redirect
      // useful: without it a visitor has to find their way back to the page they
      // were trying to reach. `src/proxy.ts` sets it from the original pathname.
      //
      // Note that `/login` itself has no page in `main` — the `(auth)` group has
      // a layout and no routes — so this asserts the redirect and its payload,
      // not that a sign-in form rendered. Asserting the form would be asserting
      // a 404, and building a sign-in page is not this issue's job.
      await expect(page).toHaveURL(
        new RegExp(`/login\\?next=${encodeURIComponent(path)}$`),
      );
    });
  }

  test('a deep link keeps its search string', async ({ page }) => {
    await page.goto('/my-tickets?from=email');

    // Losing the query string sends a buyer to sign-in and then back to a page
    // that no longer means anything.
    await expect(page).toHaveURL(
      new RegExp(`/login\\?next=${encodeURIComponent('/my-tickets?from=email')}$`),
    );
  });
});

test.describe('public routes', () => {
  for (const path of PUBLIC_PATHS) {
    test(`${path} is reachable without a session`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      // Not redirected anywhere: these are the routes `src/proxy.ts` must leave
      // alone, and a guard that is too broad is as broken as one that is too
      // narrow.
      expect(new URL(page.url()).pathname).toBe(path);
    });
  }
});

test.describe('not found', () => {
  test('an unknown path renders the 404 page rather than a blank document',
    async ({ page }) => {
      const response = await page.goto('/this-route-does-not-exist');

      expect(response?.status()).toBe(404);
      await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
      // A link back, so a 404 is a dead end rather than a trap.
      await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible();
    });
});
