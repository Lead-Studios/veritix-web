'use client';

import * as React from 'react';

const subscribe = () => () => {};

/**
 * True only after hydration. Use it to defer rendering anything that would
 * otherwise differ between server and client markup.
 *
 * Implemented with useSyncExternalStore rather than a setState-in-effect so it
 * does not trigger a cascading render.
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
