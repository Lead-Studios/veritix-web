import { NextRequest, NextResponse } from 'next/server';

/** Lists tickets belonging to the session user only. */
export async function GET(request: NextRequest) {
  const sessionUserId = request.cookies.get('session_user_id')?.value;
  if (!sessionUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(`${process.env.API_BASE_URL}/tickets?ownerId=${sessionUserId}`);
  const tickets = await response.json();
  return NextResponse.json(tickets);
}
