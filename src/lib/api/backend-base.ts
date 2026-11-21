/**
 * Backend API base helpers.
 *
 * This module has no imports on purpose. `@/lib/events` and `@/lib/ticket-store`
 * are reachable from client components, and `@/lib/api/server` imports
 * `next/server`, so those modules cannot take the helper from there.
 */

/** Remove one trailing slash so callers can append a path that starts with "/". */
export function trimTrailingSlash(base: string): string {
  return base.replace(/\/$/, '');
}

/**
 * Backend API base, or an empty string when none is configured. Falls back to
 * the app's own public API URL.
 */
export function backendBase(): string {
  return trimTrailingSlash(
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '',
  );
}
