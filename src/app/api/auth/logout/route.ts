import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAMES = ['session_user_id', 'veritix_session'] as const;

export async function POST() {
  // 204: there is nothing to return once the cookies are cleared.
  const response = new NextResponse(null, {
    status: 204,
    headers: { 'Cache-Control': 'no-store' },
  });

  for (const name of SESSION_COOKIE_NAMES) {
    response.cookies.set(name, '', {
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return response;
}
