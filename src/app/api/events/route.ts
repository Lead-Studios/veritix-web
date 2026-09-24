import { NextResponse, type NextRequest } from 'next/server';
import {
  DEFAULT_EVENT_SORT,
  EVENT_SORTS,
  EVENT_STATUSES,
  queryEvents,
  type EventSort,
} from '@/lib/events';
import type { EventStatus } from '@/types';

/**
 * GET /api/events
 *
 * Query parameters:
 *   q           free-text search across title, venue, and city
 *   page        1-based page number (default 1)
 *   pageSize    page size, capped at 50 (alias: limit)
 *   sort        startsAt | -startsAt | title | -title (default startsAt)
 *   city        exact city name
 *   date        events starting on this UTC day, as YYYY-MM-DD
 *   status      draft | published | cancelled | completed
 *   organizerId events belonging to one organizer
 *
 * Unknown values are ignored rather than rejected, so a stale bookmark still
 * renders a sensible list instead of an error page.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const first = (key: string): string | undefined => params.get(key)?.trim() || undefined;

  const positiveInt = (key: string): number | undefined => {
    const raw = params.get(key);
    if (!raw) return undefined;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  };

  const sortParam = first('sort');
  const sort: EventSort = (EVENT_SORTS as readonly string[]).includes(sortParam ?? '')
    ? (sortParam as EventSort)
    : DEFAULT_EVENT_SORT;

  const statusParam = first('status');
  const status: EventStatus | undefined = (
    EVENT_STATUSES as string[]
  ).includes(statusParam ?? '')
    ? (statusParam as EventStatus)
    : undefined;

  const pageSize = positiveInt('pageSize') ?? positiveInt('limit');

  return NextResponse.json(
    queryEvents({
      q: first('q'),
      page: positiveInt('page'),
      pageSize,
      sort,
      city: first('city'),
      date: first('date'),
      status,
      organizerId: first('organizerId'),
    }),
  );
}
