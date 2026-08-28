import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self' https://veritix.io *.veritix.io;
    script-src 'self' 'nonce-${nonce}' https://veritix.io *.veritix.io;
    style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https://images.unsplash.com;
    connect-src 'self' https://veritix.io *.veritix.io ${process.env.NEXT_PUBLIC_HORIZON_URL};
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim());

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set(
    'Content-Security-Policy',
    cspHeader.replace(/\s{2,}/g, ' ').trim(),
  );
}
import { jwtVerify } from 'jose';
import { canAccessVerificationTools, UserRole } from './lib/verificationAccess';

/**
 * Protected routes that require authentication.
 * When an unauthenticated user visits one of these paths, they are redirected
 * to /login?next=<original-path> so they land back on their destination after
 * signing in.
 */
const PROTECTED_PATHS = [
  '/dashboard',
  '/settings',
  '/tickets',
  '/events/create',
  '/events/manage',
  '/verify',
  '/profile',
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function getSessionToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get('session')?.value ??
    req.cookies.get('next-auth.session-token')?.value ??
    req.cookies.get('__Secure-next-auth.session-token')?.value
  );
}

async function hasSufficientRole(token: string, secret: Uint8Array): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const role = (payload.role as UserRole) ?? null;
    return canAccessVerificationTools(role);
  } catch (err) {
    console.error('JWT verification failed:', err);
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── CSRF protection for mutating API routes ──────────────────────────────
  if (pathname.startsWith('/api/')) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    if (req.method !== 'GET' && origin !== `https://${host}`) {
      return new NextResponse('CSRF validation failed', { status: 403 });
    }
    return NextResponse.next();
  }

  // ── Auth guard for protected pages ───────────────────────────────────────
  if (isProtectedPath(pathname)) {
    const token = getSessionToken(req);
    if (!token) {
      // Preserve the originally-requested path so the login page can redirect
      // the user back after a successful sign-in.
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access for verification tools
    if (pathname.startsWith('/verify')) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      if (!(await hasSufficientRole(token, secret))) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    /*
     * Match all paths except:
     * - _next/static  (Next.js assets)
     * - _next/image   (Next.js image optimisation)
     * - favicon.ico
     * - public files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)).*)',
  ],
};
