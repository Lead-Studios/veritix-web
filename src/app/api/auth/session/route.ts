import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const user = await verifySession(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!user) {
    return new NextResponse(null, {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  return NextResponse.json(user, { headers: { 'Cache-Control': 'no-store' } });
}
