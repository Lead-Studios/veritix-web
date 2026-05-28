import { NextRequest, NextResponse } from "next/server";
import { canAccessVerificationTools } from "@/lib/verificationAccess";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/tickets") ||
    pathname.startsWith("/verify") ||
    pathname.startsWith("/events/create") ||
    pathname.startsWith("/events/manage");

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based guard for /verify — only staff, organizer, or admin may access
  if (pathname.startsWith("/verify")) {
    const roleCookie = request.cookies.get("user_role")?.value as
      | "attendee"
      | "organizer"
      | "staff"
      | "admin"
      | null;
    if (!canAccessVerificationTools(roleCookie ?? null)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
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
