import { NextRequest, NextResponse } from "next/server";
import { canAccessVerificationTools } from "@/lib/verificationAccess";
import type { UserRole } from "@/lib/verificationAccess";

function decodeUserRole(token: string): UserRole | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return (payload.role ?? null) as UserRole | null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/tickets") ||
    pathname.startsWith("/verify") ||
    pathname.startsWith("/events/create") ||
    pathname.startsWith("/events/manage") ||
    pathname.startsWith("/settings");

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/verify")) {
    const roleFromCookie = request.cookies.get("user_role")?.value as UserRole | null;
    const role = roleFromCookie ?? decodeUserRole(token);
    if (!canAccessVerificationTools(role)) {
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
    "/settings/:path*",
  ],
};
