# Hooks

Custom React hooks for VeriTix.

## Caching Strategy (SWR)

API hooks use [SWR](https://swr.vercel.app/) for data fetching and caching. Global
defaults live in `src/lib/swrConfig.ts` (`SWR_CONFIG`) and are applied once via the
`<SWRConfig>` provider in `src/app/(protected)/layout.tsx`:

| Option | Value | Reason |
|---|---|---|
| `dedupingInterval` | `60_000` ms | Prevents duplicate requests within 60 s |
| `revalidateOnFocus` | `false` | Avoids refetch on every tab switch |

### Hooks

| Hook | Endpoint | Notes |
|---|---|---|
| `useOrganizerAnalytics` | `/api/organizers/:id/analytics` | Inherits `SWR_CONFIG` from the layout provider |

### Adding a new hook

If the hook is only ever used under the authenticated `(protected)` layout, call
`useSWR` without a config object — it automatically inherits `SWR_CONFIG` from the
`<SWRConfig>` provider. Only pass a per-hook options object when the hook needs to
diverge from the shared defaults (e.g. a shorter `refreshInterval` for polling), or
when the hook is also used outside the authenticated layout (e.g. on public pages),
in which case import `SWR_CONFIG` from `@/lib/swrConfig` explicitly.
