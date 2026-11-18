import { useSyncExternalStore } from 'react';

/**
 * Returns `true` after the component mounts on the client.
 * Useful to avoid SSR/client hydration mismatches when accessing browser APIs.
 */
export function useMounted(): boolean {
  // false on the server and during hydration, true afterwards, with no setState in an effect.
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
