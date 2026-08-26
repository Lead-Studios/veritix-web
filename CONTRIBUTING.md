# Contributing to VeriTix

Thanks for your interest in contributing! This guide covers local setup, workflow, and conventions.

## Quick Start

```bash
git clone https://github.com/Lead-Studios/veritix-web.git
cd veritix-web
cp .env.example .env.local   # fill in your values
npm install
npm run dev
```

## Development Workflow

1. Create a feature branch from `main`.
2. Make your changes following the conventions below.
3. Run checks before committing:

```bash
npm run lint          # ESLint
npm run type-check    # TypeScript
npm test              # Vitest
```

4. Open a PR using the provided template.

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/). A
Husky `commit-msg` hook enforces the format via `commitlint`.

```
feat: add QR scanner permission prompt
fix: correct revenue chart tooltip position
docs: update .env.example with new vars
```

Available types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Pre-commit Hooks

[Husky](https://typicode.github.io/husky/) and
[lint-staged](https://github.com/lint-staged/lint-staged) run automatically
before every commit:

- **ESLint** with `--fix` on `*.ts` and `*.tsx` files.
- **TypeScript** type-check on all staged files.

A failing lint or type error will block the commit. Fix the issues and try
again.

### Hook setup

Hooks are installed automatically by `npm install` via the `prepare` script.
If hooks are not running:

```bash
npx husky
```

## Environment Variables

Every variable consumed by the app **must** have an entry in `.env.example`
with a comment, type, and example value. A CI check (`npm run check-env`)
verifies this.

## Bundle Size

See [BUNDLE_BUDGET.md](./BUNDLE_BUDGET.md) for target sizes and how to
measure with `@next/bundle-analyzer`.

## Storybook

Component stories live alongside their components (e.g. `EventCard.stories.tsx`).

```bash
npm run storybook       # start dev server on :6006
npm run storybook:build # static build for CI
```

## Accessibility

- All interactive elements must have visible focus indicators.
- Charts include visually-hidden text summaries.
- Form errors are announced via `role="alert"` and link to affected fields.
- Keyboard navigation: `Tab` through focusable elements, `Cmd/Ctrl+K` for quick actions.

## PR Checklist

The PR template includes mandatory gates for:

- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] Storybook stories added/updated for new UI components
- [ ] Tested in at least one browser
- [ ] Accessibility considered (keyboard, screen reader, contrast)
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] Mobile screenshot (if UI change)
