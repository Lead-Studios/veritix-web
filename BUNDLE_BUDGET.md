# Bundle Budget

Targets for initial JavaScript loaded on the dashboard route (`/dashboard`).
Measured gzipped.

| Route           | Max JS (gzipped) | Rationale                                  |
| --------------- | ---------------- | ------------------------------------------ |
| `/dashboard`    | 150 kB           | Must feel instant on 3G; core analytics UI |
| `/verify`       | 120 kB           | Gate staff devices are often low-end       |
| `/events/create`| 130 kB           | Multi-step form; no heavy chart libs       |
| Shared chunks   | 80 kB            | Vendor + framework baseline                |

## How to measure

```bash
npm run analyze
```

Builds with `ANALYZE=true` and `@next/bundle-analyzer`, which opens an
interactive treemap in the browser. The wrapper in `next.config.js` handles the
instrumentation; it is inert unless `ANALYZE` is set, so normal builds and CI
are unaffected.

The treemap is a human tool. The automated gate is separate:

```bash
npm run build && npm run budget
```

`scripts/check-bundle-budget.mjs` reads `.next/app-build-manifest.json`, gzips
the exact chunks each route loads, and fails when a route exceeds the table
above. The limits live in that script so they stay reviewable in one place —
keep it in sync with the table. A missing build manifest is a failure, not a
pass.

## Rules

1. New dependencies >5 kB gzipped require a PR justification.
2. Tree-shaking: import only what you need (`import { BarChart } from "recharts"`).
3. Dynamic-import heavy views with `next/dynamic` and `ssr: false`.
4. CI fails if a budgeted route exceeds its limit (`npm run budget`).
