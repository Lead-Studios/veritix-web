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
ANALYZE=true npm run build
```

Opens an interactive treemap in the browser. The `@next/bundle-analyzer`
wrapper in `next.config.js` handles the instrumentation.

## Rules

1. New dependencies >5 kB gzipped require a PR justification.
2. Tree-shaking: import only what you need (`import { BarChart } from "recharts"`).
3. Dynamic-import heavy views with `next/dynamic` and `ssr: false`.
4. CI should fail if the dashboard chunk exceeds 150 kB (see `BUNDLE_CI_CHECK`).
