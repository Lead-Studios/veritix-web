import { NextResponse, type NextRequest } from 'next/server';
import { queryAnalytics } from '@/lib/analytics';

/**
 * GET /api/analytics
 *
 * Organizer totals for a dashboard view: tickets sold, checked in, gross
 * revenue, and the daily sales series the chart plots.
 *
 * Query parameters:
 *   from       inclusive start day, as YYYY-MM-DD (default: 30 days ago)
 *   to         inclusive end day, as YYYY-MM-DD (default: today)
 *   eventId    restrict to one event the caller owns
 *
 * A missing, unparseable, or reversed range falls back to the default window
 * rather than erroring, so a stale bookmark still renders something sensible.
 *
 * Ownership is enforced here and again in the read model: the session user is
 * read from the `session_user_id` cookie and passed down as the only owner
 * scope, so no `ownerId` ever comes from the query string. An `eventId` the
 * caller does not own returns an empty snapshot, not a 404 — a 404 would confirm
 * that the event exists.
 */
export async function GET(request: NextRequest) {
  const sessionUserId = request.cookies.get('session_user_id')?.value;
  if (!sessionUserId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;

  return NextResponse.json(
    queryAnalytics({
      from: params.get('from') ?? undefined,
      to: params.get('to') ?? undefined,
      eventId: params.get('eventId') ?? undefined,
      ownerId: sessionUserId,
    }),
  );
}
