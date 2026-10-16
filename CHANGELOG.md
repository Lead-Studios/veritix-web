# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- PATCH-only user settings API under `/api/user/` for profile, password,
  notifications, and wallet updates, behind a shared session check (#977)
- Blog built from MDX files in `src/content/blog`, with a static index, one
  page per post, reading time, and validated frontmatter (#979)
- Contact page and form, with a server-side honeypot and minimum-submit-time
  spam protection and no third-party script (#980)
- Cookie consent banner that defaults to necessary-only, persists the
  choice, and never blocks the page behind a modal (#982)
- Pricing page at `/pricing` with three plans, a full feature comparison, and an FAQ (#978)
- Terms of Service and Privacy Policy at `/terms` and `/privacy`, each with a table of contents, a capped measure, and a last-updated date (#981)
- `LegalDocument` and `LegalList` shared shells for long-form legal pages, plus a `.legal-body` component layer so neither page repeats the typography (#981)
- Newsletter signup in the site footer: inline validation, a success state that takes focus, and a plain statement of what subscribers get (#983)
- `POST /api/newsletter`, a validating proxy to the backend so the browser never learns where the list lives (#983)
- `e2e/smoke.spec.ts` covering the landing page, the route guard, the public routes, and the 404 page (#988)
- `.github/workflows/e2e.yml` running the Playwright suite, caching the browser build and uploading the report (#988)
- Accessibility audit across every route: focus management, labels, landmarks, and heading order (#984)
- `Textarea` primitive (`src/components/ui/textarea.tsx`), mirroring `Input` including `aria-[invalid=true]` (#984)
- `titleAs` on `ErrorState` and `EmptyState`, so a page whose whole body is a state has a real heading (#984)
- `as` on `CardTitle`, so a card under a page `<h1>` no longer skips a heading level (#984)
- Visualised region and result-count announcements for the events listing, the event gallery, and the attendee table (#984)
- `.nvmrc` pinning Node `20.19.0`, the minimum required by `oxc-parser` and compatible with Next.js 16 (#986)
- `lint:all` script (`eslint .`), preserving the pre-`eslint src` scope under a new name (#985)
- `globalIgnores` for `storybook-static`, `out-vercel`, `playwright-report`, `test-results`, and `blob-report` (#987)
- Storybook stories for every primitive in `src/components/ui/`, including variant matrices and disabled/invalid states (#989)
- Bundle budget gate (`npm run budget`) reading `.next/app-build-manifest.json`; CI now fails when a documented route budget is exceeded (#990)
- `@next/bundle-analyzer` wired through `next.config.js` and `npm run analyze` (#990)
- PWA support via `next-pwa`: `npm run build:pwa` emits a service worker with `NetworkFirst` caching for `/verify` and `CacheFirst` for static assets; `public/manifest.json` is now linked from the root layout (#991)
- Sentry instrumentation: `src/instrumentation.ts`, `src/instrumentation.client.ts`, `withSentryConfig` source-map upload, and a `beforeSend` scrubber that drops request bodies, cookies, query strings, and user PII (#992)
- `SENTRY_ORG` and `SENTRY_PROJECT` documented in `.env.example`; `ENABLE_PWA` added for opt-in service-worker builds (#991, #992)
- Storybook with Next.js framework, a11y, and viewport addons (#609)
- CHANGELOG and commitlint configuration (#610)
- GitHub Actions CI workflow with lint, type-check, and build (#612)
- PR template for consistent contribution (#611)
- Husky pre-commit hook with lint-staged for ESLint and type-check (#773)
- Husky commit-msg hook for Conventional Commits enforcement (#776)
- `@next/bundle-analyzer` with `npm run analyze` script and `BUNDLE_BUDGET.md` (#772)
- Accessible loading announcements on dashboard with `aria-live` regions (#771)
- Global `focus-visible` ring styles for all interactive elements (#765)
- Offline detection banner on verification page (#764)
- `Cmd/Ctrl+K` keyboard shortcut to focus verification input (#763)
- Stellar Explorer links and truncated addresses in ticket transfer history (#760)
- Visually-hidden text summaries on all chart components for screen readers (#769)
- Storybook stories for `LoadingState`, `ErrorState`, `TicketPass`, `FunnelChart`, `StatusBadge` (#775)
- CI guard script (`npm run check-env`) verifying `.env.example` completeness (#774)
- Documented all consumed environment variables in `.env.example` with types (#774)
- `CONTRIBUTING.md` with workflow, hooks, and conventions guide (#773)
- Prettier config and `format`/`format:check` scripts; CI now fails on unformatted files (#729)
- Unit test coverage for `useOrganizerAnalytics` covering loading, success, organizerId key-building, and error states (#731)

### Changed
- The site footer's three link groups are `<h2>` sections rather than styled paragraphs, and the newsletter block sits above the legal line instead of inside a grid cell (#983)
- `playwright.config.ts` targets `127.0.0.1` rather than `localhost`, and adds a global timeout, an action timeout, a browser cache, and the GitHub HTML reporter (#988)
- The E2E web server is `next dev` by default, with `E2E_WEB_SERVER=build` to test a production build once `next build` succeeds on `main` (#988)
- CI runs the `package.json` scripts instead of hand-written `npx` commands, so the runner, a laptop, and the Husky hooks execute the same thing (#985)
- CI reads the Node version from `.nvmrc` rather than hard-coding `20` (#985, #986)
- `lint` covers `src` only; the previous whole-repo scope is available as `lint:all` (#985)
- CI declares `permissions: contents: read`, a `concurrency` group, and a 20-minute job timeout (#985)
- `lighthouse.yml` and the `Dockerfile` read the Node version from `.nvmrc` too, so the three cannot drift (#986)
- `README.md` documents the Node requirement and `nvm use` (#986)
- `sheet.tsx` renders through a portal, moves focus into the panel on open and back to the trigger on close, traps `Tab`, locks background scrolling, and closes on `Escape` (#984)
- `ThemeToggle` is a real radiogroup: one tab stop, arrow-key navigation, roving `tabIndex` (#984)
- The topbar navigation trigger is a `Button` and the drawer has a `title`, so the dialog is named (#984)
- `StatCard` emits `<dt>`/`<dd>` and states its trend direction in words rather than by colour alone (#984)
- `csv.ts` quotes per RFC 4180, emits CRLF line endings and a UTF-8 BOM, and revokes the object URL after the click (#984)
- Formatted the existing `src/` tree with Prettier (#729)
- `no-restricted-imports` ESLint rule now correctly targets only imports crossing two or more directory levels, instead of also matching legitimate single-level `../` imports (#730)

### Fixed
- `app-providers.tsx` rendered `children` twice, so every route mounted the whole provider tree twice (#984)
- `event-filters.tsx` emitted duplicate `id`s for both responsive copies, so on a phone every filter label pointed at an input inside a `display:none` subtree (#984)
- `ui/pagination.tsx` and `ui/sheet.tsx` declared their components twice and imported mid-file, and neither file compiled (#984, #985)
- `my-tickets/page.tsx` had two default exports, a missing brace, and an import in the middle of the file; it now renders a real listing (#984, #985)
- Buttons inside forms defaulted to `type="submit"`, so an unlabelled secondary button submitted the form it sat in (#984)
- `dashboard/payouts/page.tsx` rendered a second `<main>` landmark and raw `bg-green-100` status chips; it now uses `ui/table` primitives, an `sr-only` caption, and `Badge` variants (#984)
- The organiser event table advertised `Edit · Duplicate · View` as a plain string; each is now a real link with its own accessible name (#984)
- `ErrorState` and `EmptyState` titles were `<p>` elements, leaving pages such as the dashboard with no heading at all (#984)
- `dashboard`, `dashboard/events`, `dashboard/events/new`, and the attendee list had no `<h1>` (#984)
- The home page jumped from `<h1>` to `CardTitle` `<h3>`s, and its three `<section>`s were unnamed (#984)
- The site footer used styled `<p>` elements as column headings, so the three link groups were indistinguishable (#984)
- `TicketQr` rendered an SVG with no accessible name; the payload is no longer used as the name (#984)
- `TableHead` defaulted to no `scope`, leaving screen readers without column association (#984)
- Filter, promo-code, split-total, publish-hint, and attendee-count changes are announced instead of happening silently (#984)
- The disabled states that only existed in `title` attributes are rendered as real text and wired up with `aria-describedby` (#984)
- `csv.ts` and `breadcrumbs.tsx` used double-quoted strings and a missing final newline, failing `format:check` (#985)
- `dialog.tsx` overlays and the sheet backdrop respond to `onClick` without a keyboard path; `Escape` and the close button provide one (#984)
- `src/components/ui/pagination.tsx` and `src/components/ui/sheet.tsx` no longer contain two conflicting implementations of the same component; both now serve the API their call sites use (#989)
- `src/app/(protected)/my-tickets/page.tsx` no longer has imports inside a function body or two default exports, and it now actually renders the upcoming and past ticket groups (#989)
- The client error boundary reports through Sentry instead of relying on an automatic capture that never happened (#992)
- `.storybook/heaer.ts` and the duplicate `.storybook/preview.tsx` removed, so Storybook loads exactly one preview configuration (#989)

### Removed
- `.eslintignore`, which ESLint 9 flat config ignores in favour of `globalIgnores` (#987)
- Dead and broken `src/app/context.tsx`, `src/app/resets.ts` (a byte-identical copy of `src/hooks/use-media-query.ts`), and `src/components/feedback/session.tsx` (#984)

---

[Unreleased]: https://github.com/Lead-Studios/veritix-web/compare/HEAD...HEAD