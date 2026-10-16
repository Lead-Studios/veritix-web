import { NextResponse, type NextRequest } from 'next/server';
import { findOwnedEvent, transitionEvent, type EventAction } from '@/lib/events';
import { readSessionUserId, unauthorized } from '@/lib/api/server';

/**
 * Shared pieces of the organizer-only `/api/events/[id]/*` routes.
 */

/**
 * The response for an event that is missing *or* belongs to someone else.
 * One message for both, so the two cases are indistinguishable to the caller.
 */
export function eventNotFound(): NextResponse {
  return NextResponse.json(
    { message: 'Event not found.' },
    { status: 404, headers: { 'Cache-Control': 'no-store' } },
  );
}

const PAST_TENSE: Record<EventAction, string> = {
  publish: 'published',
  cancel: 'cancelled',
};

/** Build the POST handler for a lifecycle action such as publish or cancel. */
export function lifecycleRoute(action: EventAction) {
  return async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const userId = readSessionUserId(request);
    if (!userId) return unauthorized();

    const { id } = await params;
    const event = findOwnedEvent(id, userId);
    if (!event) return eventNotFound();

    const from = event.status;
    const updated = transitionEvent(event, action);
    if (!updated) {
      return NextResponse.json(
        { message: `A ${from} event cannot be ${PAST_TENSE[action]}.` },
        { status: 409, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
  };
}
