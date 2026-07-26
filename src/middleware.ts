import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (req.method !== "GET" && origin !== `https://${host}`) {
    return new NextResponse("CSRF validation failed", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
