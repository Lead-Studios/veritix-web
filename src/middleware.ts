import { NextRequest, NextResponse } from "next/server";

/**
 * Protected routes that require authentication.
 * When an unauthenticated user visits one of these paths, they are redirected
 * to /login?next=<original-path> so they land back on their destination after
 * signing in.
 */
const PROTECTED_PATHS = [
  "/dashboard",
  "/settings",
  "/tickets",
  "/events/create",
  "/events/manage",
  "/verify",
  "/profile",
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function getSessionToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("session")?.value ??
    req.cookies.get("next-auth.session-token")?.value ??
    req.cookies.get("__Secure-next-auth.session-token")?.value
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── CSRF protection for mutating API routes ──────────────────────────────
  if (pathname.startsWith("/api/")) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (req.method !== "GET" && origin !== `https://${host}`) {
      return new NextResponse("CSRF validation failed", { status: 403 });
    }
    return NextResponse.next();
  }

  // ── Auth guard for protected pages ───────────────────────────────────────
  if (isProtectedPath(pathname)) {
    const token = getSessionToken(req);
    if (!token) {
      // Preserve the originally-requested path so the login page can redirect
      // the user back after a successful sign-in.
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (Next.js assets)
     * - _next/image   (Next.js image optimisation)
     * - favicon.ico
     * - public files (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)).*)",
  ],
};
