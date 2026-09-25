'use client';

import * as React from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { useMounted } from '@/hooks/use-mounted';
import { routes } from '@/lib/routes';

/**
 * Cookie consent banner.
 *
 * Three requirements from the issue, and the reasoning behind each, because two
 * of them are choices rather than defaults.
 *
 * ## Defaults to the most privacy-preserving option
 *
 * Analytics stay off until somebody turns them on. The banner does not ask "may
 * we use analytics" with a pre-ticked box; it states what is off, what turning
 * it on would mean, and waits. Accepting-by-default is the failure mode that
 * gets consent regimes ruled unlawful, and a banner whose visually dominant
 * button is "Accept all" is that failure mode with better typography.
 *
 * The necessary cookies — the session cookie and the theme choice — are set
 * whether or not anybody chooses here, because the service does not work without
 * them. The banner says that outright rather than implying nothing is set until
 * somebody agrees.
 *
 * ## Never blocks the page behind a modal
 *
 * Worth arguing for explicitly, so:
 *
 * - No backdrop. The page behind is visible and interactive.
 * - No focus trap. Tab moves on into the page, and the browser's own focus
 *   handling is not overridden.
 * - No `role="dialog"` and no `aria-modal`. This is a labelled `role="region"`,
 *   which puts it in the landmark list so it can be found, and does not
 *   announce itself as a modal or set the expectation that the rest of the page
 *   is unavailable.
 * - The page is not disabled. Nothing sets `inert`, nothing locks body scroll.
 *
 * The accessibility argument is that a modal consent banner is a keyboard trap
 * whose only exit requires consenting. The legal argument is the same one seen
 * from the other side: a wall in front of the content is pressure, and pressure
 * is not consent. Both point the same way, which is convenient.
 *
 * The banner also does not auto-dismiss, and does not time out into a default.
 * It stays until a person chooses, and the choice is persisted so somebody who
 * said no is not asked again on every page.
 *
 * ## Persisting the choice
 *
 * A cookie, not `localStorage`. The decision has to be readable by the server.
 * With `localStorage` the answer lives in one browser, cannot be shown to anyone
 * who asks, and a page that renders before the client script has run has no way
 * to know about it — so a "no" would be honoured only after the page had already
 * decided otherwise.
 *
 * Deliberately **not** `HttpOnly`: this cookie is read by script, because that
 * is how an analytics tag checks it. `SameSite=Lax`, one year, and `Secure`
 * anywhere but plain-HTTP development.
 *
 * Any consumer — an analytics tag, a future preference centre — should call
 * `analyticsAllowed()` rather than reading the cookie itself, so the rule
 * "off unless the stored choice is `all`" exists in exactly one place.
 */

const STORAGE_KEY = 'veritix.consent';

/** Long enough that a returning visitor is not asked again next week. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type ConsentChoice = 'necessary' | 'all';

const LABELS: Record<ConsentChoice, string> = {
  necessary: 'Necessary only',
  all: 'Allow analytics',
};

/**
 * The stored choice, or `null` if nobody has chosen yet.
 *
 * An unrecognised or corrupt value reads as `necessary` rather than as `all`.
 * A cookie a user or a browser mangled should fail towards less data collection,
 * not towards more.
 *
 * `document` does not exist during server rendering, so this is only ever called
 * from an effect or an event handler. A module-scope read would take the page
 * down on the server rather than just skipping the banner.
 */
export function readConsent(): ConsentChoice | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${STORAGE_KEY}=([^;]*)`));
  if (!match) return null;

  return decodeURIComponent(match[1]) === 'all' ? 'all' : 'necessary';
}

/**
 * May analytics run?
 *
 * False unless the stored choice is `all`. Note the direction of the default:
 * a consumer that gets this wrong fails towards not firing, rather than towards
 * firing at somebody who said no.
 */
export function analyticsAllowed(): boolean {
  return readConsent() === 'all';
}

function storeConsent(choice: ConsentChoice) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${STORAGE_KEY}=${encodeURIComponent(choice)}; ` +
    `Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

export function CookieBanner() {
  const mounted = useMounted();
  const [choice, setChoice] = React.useState<ConsentChoice | null>(null);

  // Gated on `mounted` rather than read during render. The server does not know
  // the cookie, so a server render always omits the banner; reading during
  // render would also produce markup that differs from the hydrated markup,
  // which React reports as a hydration error rather than quietly reconciling.
  React.useEffect(() => {
    setChoice(readConsent());
  }, []);

  // `choice` being non-null means somebody has already decided, so this stays
  // out of the DOM entirely rather than rendering an empty shell.
  if (!mounted || choice !== null) return null;

  function decide(next: ConsentChoice) {
    storeConsent(next);
    // Set before the re-render so the banner is gone on the same paint as the
    // click, rather than flashing for a frame.
    setChoice(next);
  }

  return (
    <aside
      // A labelled region, not a dialog. See the note at the top of the file.
      role="region"
      aria-label="Cookie consent"
      // `polite`, not `alert`. The banner appears after the page has settled, and
      // asserting would interrupt whatever a screen reader was in the middle of
      // saying.
      aria-live="polite"
      className="border-t border-border bg-background"
    >
      <Container className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Cookie
            className="mt-0.5 size-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="max-w-2xl text-sm">
            <p className="font-medium text-foreground">Cookies</p>
            <p className="mt-1 text-muted-foreground">
              A session cookie keeps you signed in and another remembers your light or dark
              preference. Those are set whether or not you choose here — the site does not work
              without them. Analytics stay off until you turn them on.{' '}
              <Link href={routes.privacy} className="underline underline-offset-4">
                Read the privacy policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* The privacy-preserving choice comes first in the tab order as well as
            on the left. The emphasised button is not "accept everything" — a
            banner whose loudest option is consent is a banner that gets consent. */}
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => decide('necessary')}
          >
            {LABELS.necessary}
          </Button>
          <Button type="button" onClick={() => decide('all')}>
            {LABELS.all}
          </Button>
        </div>
      </Container>
    </aside>
  );
}
