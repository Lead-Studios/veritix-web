# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Pricing page at `/pricing` with three plans, a full feature comparison, and an FAQ (#978)
- Terms of Service and Privacy Policy at `/terms` and `/privacy`, each with a table of contents, a capped measure, and a last-updated date (#981)
- `LegalDocument` and `LegalList` shared shells for long-form legal pages, plus a `.legal-body` component layer so neither page repeats the typography (#981)
- Newsletter signup in the site footer: inline validation, a success state that takes focus, and a plain statement of what subscribers get (#983)
- `POST /api/newsletter`, a validating proxy to the backend so the browser never learns where the list lives (#983)
- `e2e/smoke.spec.ts` covering the landing page, the route guard, the public routes, and the 404 page (#988)
- `.github/workflows/e2e.yml` running the Playwright suite, caching the browser build and uploading the report (#988)
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
- Formatted the existing `src/` tree with Prettier (#729)
- `no-restricted-imports` ESLint rule now correctly targets only imports crossing two or more directory levels, instead of also matching legitimate single-level `../` imports (#730)

### Fixed

### Removed

---

[Unreleased]: https://github.com/Lead-Studios/veritix-web/compare/HEAD...HEAD