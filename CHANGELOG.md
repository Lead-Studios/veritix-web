# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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

### Changed

### Fixed

### Removed

---

[Unreleased]: https://github.com/Lead-Studios/veritix-web/compare/HEAD...HEAD