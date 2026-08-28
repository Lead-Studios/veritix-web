export function isValidRedirect(url: string | null | undefined): url is string {
  if (!url) return false;

  // Must be a relative path starting with '/'
  if (!url.startsWith('/')) return false;

  // Must not contain '//' or '..', which could be used for open redirects
  // or path traversal attacks.
  if (url.includes('//') || url.includes('..')) return false;

  // Optional: You might want to exclude certain paths if needed,
  // e.g., internal API routes.
  // if (url.startsWith('/api/')) return false;

  return true;
}
