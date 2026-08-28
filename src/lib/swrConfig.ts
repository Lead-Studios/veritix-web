import type { SWRConfiguration } from "swr";

/**
 * Shared SWR configuration for the authenticated app.
 *
 * Hooks that fetch data under the authenticated layout should rely on this
 * (provided via the `<SWRConfig>` provider in `src/app/(protected)/layout.tsx`)
 * instead of repeating `revalidateOnFocus`/`dedupingInterval` themselves.
 * Only pass hook-level overrides when they genuinely differ from these
 * defaults (e.g. polling with `refreshInterval`).
 */
export const SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
  dedupingInterval: 60_000,
};
