import { NextRequest, NextResponse } from 'next/server';

/** Creates and lists orders, scoped to the session user. */
export async function GET(request: NextRequest) {
  const sessionUserId = request.cookies.get('session_user_id')?.value;
  if (!sessionUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(`${process.env.API_BASE_URL}/orders?buyerId=${sessionUserId}`);
  return NextResponse.json(await response.json());
}

export async function POST(request: NextRequest) {
  const sessionUserId = request.cookies.get('session_user_id')?.value;
  if (!sessionUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const response = await fetch(`${process.env.API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, buyerId: sessionUserId }),
  });
  return NextResponse.json(await response.json(), { status: response.status });
}
