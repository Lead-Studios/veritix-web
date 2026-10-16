import { NextRequest, NextResponse } from 'next/server';

/** Lists tickets belonging to the session user only. */
export async function GET(request: NextRequest) {
  const sessionUserId = request.cookies.get('session_user_id')?.value;
  if (!sessionUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Built with URLSearchParams so a cookie value containing `&` or `=` is encoded as
  // part of the one `ownerId` value and cannot add or override query parameters.
  const query = new URLSearchParams({ ownerId: sessionUserId });
  const response = await fetch(`${process.env.API_BASE_URL}/tickets?${query}`);
  const tickets = await response.json();
  return NextResponse.json(tickets);
}
