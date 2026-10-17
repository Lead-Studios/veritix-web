import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAMES = ['session_user_id', 'veritix_session'] as const;

export async function POST() {
  const response = NextResponse.json({ success: true }, {
    headers: { 'Cache-Control': 'no-store' },
  });

  for (const name of SESSION_COOKIE_NAMES) {
    response.cookies.set(name, '', {
      expires: new Date(0),
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return response;
}
