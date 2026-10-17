import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names, resolving conflicts so the last class wins.
 * This is the `utils` alias declared in components.json — shadcn components
 * generated into src/components/ui import `cn` from here.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Returns a safe same-origin path to redirect to.
 *
 * Only honours a `next` parameter that is a same-origin path — reject `//host`
 * and absolute URLs, path traversal (`..`), and `api/`-prefixed paths when
 * a navigation redirect would be unsafe. For the Auth redirect use case,
 * any non-empty `next` that starts with `/` and does not contain `//` or `..`
 * is considered safe.
 */
export function isValidRedirect(url: string | null | undefined): url is string {
  if (!url || url.trim().length === 0) return false;
  const trimmed = url.trim();

  if (!trimmed.startsWith('/')) return false;

  if (trimmed.includes('//') || trimmed.includes('..')) return false;

  return true;
}
