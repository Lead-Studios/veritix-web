import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { EVENTS } from '@/lib/events';
import { readSessionUserId, unauthorized } from '@/lib/api/server';
import { signingSecret, verifyTicketPayload } from '@/lib/ticket-signing';
import { redeemTicket } from '@/lib/ticket-store';

/** `node:crypto` is used for the HMAC check, so this cannot run on the edge. */
export const runtime = 'nodejs';

const verifyBody = z.object({
  /** The raw string read from the ticket's QR code. */
  payload: z.string().min(1).max(1024),
  /** The event the scanner is checking people into. */
  eventId: z.string().trim().min(1).max(100),
});

type Outcome =
  | 'valid'
  | 'malformed'
  | 'invalid_signature'
  | 'wrong_event'
  | 'already_used'
  | 'not_valid'
  | 'not_found';

function reply(status: number, outcome: Outcome, message: string, extra: object = {}) {
  return NextResponse.json(
    { status: outcome, message, ...extra },
    // A scan result is a one-off answer about one ticket at one moment.
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}

/**
 * POST /api/verify
 *
 * Checks a ticket in at the gate. In order:
 *
 *  1. The scanner must be signed in as the organizer of `eventId`. Anyone
 *     else gets a 404, the same as an event that does not exist.
 *  2. The QR payload's signature is verified server-side. The browser is
 *     never trusted to decide a ticket is genuine.
 *  3. The ticket must belong to `eventId`. This is checked against both the
 *     signed claim and the stored record.
 *  4. The ticket is marked used in a single atomic step, so a second scan of
 *     the same ticket (including two scanners at once) is rejected as
 *     `already_used`.
 */
export async function POST(request: NextRequest) {
  const userId = readSessionUserId(request);
  if (!userId) return unauthorized();

  const secret = signingSecret();
  if (!secret) {
    // Failing closed: with no secret, no ticket can be told apart from a forgery.
    return NextResponse.json(
      { message: 'Ticket verification is not configured.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const parsed = verifyBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return reply(400, 'malformed', 'That is not a ticket code.');
  }
  const { payload, eventId } = parsed.data;

  const event = EVENTS.find((e) => e.id === eventId);
  if (!event || event.organizer.id !== userId) {
    return NextResponse.json(
      { message: 'Event not found.' },
      { status: 404, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const verified = verifyTicketPayload(payload, secret);
  if (!verified.ok) {
    return verified.reason === 'bad_signature'
      ? reply(400, 'invalid_signature', 'This ticket code is not genuine.')
      : reply(400, 'malformed', 'That is not a ticket code.');
  }

  // Checked before touching the store, so a ticket for another event is never
  // marked used by the wrong gate.
  if (verified.claims.eid !== eventId) {
    return reply(422, 'wrong_event', 'This ticket is for a different event.');
  }

  const result = redeemTicket(verified.claims.tid, eventId);
  if (result.ok) {
    return reply(200, 'valid', 'Ticket accepted.', {
      ticketId: result.ticket.id,
      tierId: result.ticket.tierId,
      usedAt: result.ticket.usedAt,
    });
  }

  switch (result.reason) {
    case 'already_used':
      return reply(409, 'already_used', 'This ticket has already been scanned.', {
        usedAt: result.usedAt,
      });
    case 'wrong_event':
      return reply(422, 'wrong_event', 'This ticket is for a different event.');
    case 'not_valid':
      return reply(409, 'not_valid', `This ticket has been ${result.status}.`);
    case 'not_found':
    default:
      return reply(404, 'not_found', 'This ticket does not exist.');
  }
}
