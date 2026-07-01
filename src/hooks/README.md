# Hooks

Custom React hooks for VeriTix.

## Caching Strategy (SWR)

API hooks use [SWR](https://swr.vercel.app/) for data fetching and caching. Global defaults are set in `src/app/(protected)/layout.tsx` via `SWRConfig`:

| Option | Value | Reason |
|---|---|---|
| `dedupingInterval` | `60_000` ms | Prevents duplicate requests within 60 s |
| `revalidateOnFocus` | `false` | Avoids refetch on every tab switch |

### Hooks

| Hook | Endpoint | Notes |
|---|---|---|
| `useOrganizerAnalytics` | `/api/organizers/:id/analytics` | SWR with per-hook deduping |

### Adding a new hook

Use `useSWR` and pass `{ dedupingInterval: 60_000, revalidateOnFocus: false }` unless the data needs to be fresher.
