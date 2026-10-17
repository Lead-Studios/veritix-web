import { useEffect, useState } from 'react';

/**
 * Returns `true` after the component mounts on the client.
 * Useful to avoid SSR/client hydration mismatches when accessing browser APIs.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}
