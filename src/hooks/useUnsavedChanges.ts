'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Warns the user before leaving the page when there are unsaved changes.
 * Covers both browser tab close/refresh (beforeunload) and in-app navigation.
 * @param isDirty - true when the form has been modified and not yet saved
 */
export function useUnsavedChanges(isDirty: boolean) {
  const router = useRouter();

  // Browser close / refresh
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Intercept Next.js in-app navigation via the router push/replace
  const guardedPush = useCallback(
    (href: string) => {
      if (
        isDirty &&
        !window.confirm('You have unsaved changes. Leave without saving?')
      ) {
        return;
      }
      router.push(href);
    },
    [isDirty, router],
  );

  return { guardedPush };
}
