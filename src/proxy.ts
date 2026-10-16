import { NextResponse, type NextRequest } from 'next/server';
import { isAuthPath, isProtectedPath, routes } from '@/lib/routes';

/** Name of the session cookie set by the auth flow. */
const SESSION_COOKIE = 'veritix_session';

/**
 * Route guard. Protected routes require a session cookie; authenticated users
 * are bounced off the auth pages.
 *
 * Next.js 16 renamed the `middleware` file convention to `proxy`.
 *
 * This only checks that the cookie is present — it is a routing concern, not an
 * authorization one. Every API route and server action must still verify the
 * session itself before trusting it.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (isProtectedPath(pathname) && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = routes.login;
    // Preserve where the user was heading so login can send them back.
    url.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (isAuthPath(pathname) && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = routes.dashboard;
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, the API surface, and anything with a file extension.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
