# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
- Formatted the existing `src/` tree with Prettier (#729)
- `no-restricted-imports` ESLint rule now correctly targets only imports crossing two or more directory levels, instead of also matching legitimate single-level `../` imports (#730)

### Fixed
- `src/components/ui/pagination.tsx` and `src/components/ui/sheet.tsx` no longer contain two conflicting implementations of the same component; both now serve the API their call sites use (#989)
- `src/app/(protected)/my-tickets/page.tsx` no longer has imports inside a function body or two default exports, and it now actually renders the upcoming and past ticket groups (#989)
- The client error boundary reports through Sentry instead of relying on an automatic capture that never happened (#992)
- `.storybook/heaer.ts` and the duplicate `.storybook/preview.tsx` removed, so Storybook loads exactly one preview configuration (#989)

### Removed

---

[Unreleased]: https://github.com/Lead-Studios/veritix-web/compare/HEAD...HEAD