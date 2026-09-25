import { NextResponse, type NextRequest } from 'next/server';
import { queryCheckInRates } from '@/lib/analytics';

/**
 * GET /api/analytics/check-in-rate
 *
 * Sold against checked in, per event, plus the same rates ordered by event date
 * so the dashboard can draw the trend across an organizer's past events.
 *
 * Query parameters:
 *   from       inclusive start day, as YYYY-MM-DD (default: 30 days ago)
 *   to         inclusive end day, as YYYY-MM-DD (default: today)
 *   eventId    restrict to one event the caller owns
 *
 * Shares its session guard and ownership scoping with `/api/analytics` — see
 * that route for why the owner comes from the cookie and never the query.
 */
export async function GET(request: NextRequest) {
  const sessionUserId = request.cookies.get('session_user_id')?.value;
  if (!sessionUserId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;

  return NextResponse.json(
    queryCheckInRates({
      from: params.get('from') ?? undefined,
      to: params.get('to') ?? undefined,
      eventId: params.get('eventId') ?? undefined,
      ownerId: sessionUserId,
    }),
  );
}
