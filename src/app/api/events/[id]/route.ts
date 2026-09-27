import { NextResponse, type NextRequest } from 'next/server';
import { findEventById, findEventBySlug, findOwnedEvent, updateEvent } from '@/lib/events';
import { eventInputSchema, toFieldErrors } from '@/lib/event-schema';
import { readSessionUserId, unauthorized } from '@/lib/api/server';
import { eventNotFound } from '@/lib/api/event-routes';

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/events/[id]
 *
 * Returns a single event by its public slug or its id, or 404 when nothing
 * matches. This folder used to be `[slug]`; Next.js does not allow two
 * differently named dynamic segments side by side, so the one segment now
 * accepts either.
 */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const event = findEventBySlug(id) ?? findEventById(id);

  if (!event) {
    return NextResponse.json({ message: `No event found for "${id}"` }, { status: 404 });
  }

  return NextResponse.json(event);
}

/**
 * PATCH /api/events/[id]
 *
 * Edits an event the signed-in user organizes. The body is a partial: fields
 * it leaves out keep their current value, and the merged result is validated
 * against the same rules as creation so an edit cannot sneak past a rule
 * (an end date moved before the start date, splits that stop adding up).
 *
 * Someone else's event answers 404, not 403, so the endpoint cannot be used
 * to discover which event ids exist.
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  const userId = readSessionUserId(request);
  if (!userId) return unauthorized();

  const { id } = await params;
  const event = findOwnedEvent(id, userId);
  if (!event) return eventNotFound();

  if (event.status === 'cancelled' || event.status === 'completed') {
    return NextResponse.json(
      { message: `A ${event.status} event can no longer be edited.` },
      { status: 409, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const raw: unknown = await request.json().catch(() => null);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return NextResponse.json({ message: 'Expected a JSON object.' }, { status: 400 });
  }

  const current = {
    title: event.title,
    description: event.description,
    venue: event.venue,
    city: event.city,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    tiers: event.tiers.map(({ name, priceMinor, currency, quantityTotal }) => ({
      name,
      priceMinor,
      currency,
      quantityTotal,
    })),
    splits: event.splits ?? [],
  };

  const parsed = eventInputSchema.safeParse({ ...current, ...raw });
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Check the event details and try again.', fields: toFieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  // Tickets already sold against a tier pin it in place: dropping the tier or
  // shrinking it below what was sold would orphan tickets people paid for.
  const soldConflict = event.tiers.findIndex((tier, index) => {
    if (tier.quantitySold === 0) return false;
    const next = parsed.data.tiers[index];
    return !next || next.quantityTotal < tier.quantitySold;
  });
  if (soldConflict !== -1) {
    return NextResponse.json(
      {
        message: 'Check the event details and try again.',
        fields: [
          {
            field: `tiers.${soldConflict}`,
            message: 'A tier with tickets sold cannot be removed or reduced below what has sold.',
          },
        ],
      },
      { status: 422 },
    );
  }

  return NextResponse.json(updateEvent(event, parsed.data), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
