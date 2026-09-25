/**
 * Central route map. Every internal link should reference these helpers rather
 * than a string literal, so a path change is a single edit.
 */
export const routes = {
  home: '/',
  events: '/events',
  event: (slug: string) => `/events/${slug}`,
  pricing: '/pricing',
  blog: '/blog',
  blogPost: (slug: string) => `/blog/${slug}`,
  contact: '/contact',
  terms: '/terms',
  privacy: '/privacy',

  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',

  dashboard: '/dashboard',
  myTickets: '/my-tickets',
  checkout: '/checkout',
  orders: '/orders',
  settings: '/settings',
  verify: '/verify',
} as const;

/** Route prefixes that require an authenticated session. */
export const PROTECTED_PREFIXES = [
  '/dashboard',
  '/my-tickets',
  '/checkout',
  '/orders',
  '/settings',
  '/verify',
] as const;

/** Routes that an already-authenticated user should be redirected away from. */
export const AUTH_ROUTES = ['/login', '/register', '/forgot-password'] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
