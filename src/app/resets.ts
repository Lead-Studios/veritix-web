'use client';

import * as React from 'react';

/**
 * Subscribe to a CSS media query. Returns false during SSR and resolves to the
 * real value on hydration.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = React.useCallback(() => window.matchMedia(query).matches, [query]);

  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** Matches the Tailwind `md` breakpoint. */
export const useIsDesktop = () => useMediaQuery('(min-width: 768px)');

/** True when the user has asked for reduced motion. */
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
