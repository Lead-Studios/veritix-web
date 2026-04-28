import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard routes under the (protected) route group.
  // Next.js strips the group segment from the URL, so we match the actual
  // path segments that live inside (protected): /dashboard, /events/*, /tickets, /verify
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/tickets") ||
    pathname.startsWith("/verify") ||
    // /events under protected — distinguish from public /events by checking
    // whether the request is for the organiser sub-paths
    pathname.startsWith("/events/create") ||
    pathname.startsWith("/events/manage");

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tickets/:path*",
    "/verify/:path*",
    "/events/create/:path*",
    "/events/manage/:path*",
  ],
};
