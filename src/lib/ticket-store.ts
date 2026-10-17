import type { Ticket } from '@/types';
import { demoDataEnabled } from '@/lib/demo-data';

/**
 * Ticket records the gate scanner checks against.
 *
 * This `Map` is a test/development double: it only exists inside one server
 * process, so two servers or a restart would each keep their own copy. In
 * production, redemption goes through `redeemTicketAtomic`, which is one
 * conditional write against the backend. The synchronous `redeemTicket` below
 * stays as the fallback for tests and local development, where its read and
 * write run in a single step and so two scans of the same ticket cannot both
 * see it as valid. Against a database that becomes one conditional write —
 * `UPDATE tickets SET status = 'used' ... WHERE id = $1 AND status = 'valid'`
 * and checking the affected row count — never a read followed by a separate
 * write.
 */

const tickets = new Map<string, Ticket>();

const SEED: Ticket[] = [
  {
    id: 'tkt_1001',
    eventId: 'evt_1',
    tierId: 'tier_1b',
    ownerId: 'user_1',
    status: 'valid',
    issuedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'tkt_1002',
    eventId: 'evt_1',
    tierId: 'tier_1b',
    ownerId: 'user_2',
    status: 'valid',
    issuedAt: '2026-09-02T10:00:00.000Z',
  },
  {
    id: 'tkt_2001',
    eventId: 'evt_2',
    tierId: 'tier_2b',
    ownerId: 'user_1',
    status: 'valid',
    issuedAt: '2026-09-03T10:00:00.000Z',
  },
];

// The seed is fixture data, so it is only loaded when demo data is enabled.
// Production starts with an empty map and reads every ticket from the backend.
if (demoDataEnabled()) {
  for (const ticket of SEED) tickets.set(ticket.id, { ...ticket });
}

export function findTicket(id: string): Ticket | undefined {
  const ticket = tickets.get(id);
  return ticket ? { ...ticket } : undefined;
}

/** Add a ticket to the store. Used by tests and, later, by order fulfilment. */
export function issueTicket(ticket: Ticket): Ticket {
  tickets.set(ticket.id, { ...ticket });
  return { ...ticket };
}

export type RedeemResult =
  | { ok: true; ticket: Ticket }
  | { ok: false; reason: 'not_found' | 'wrong_event' }
  | { ok: false; reason: 'already_used'; usedAt?: string }
  | { ok: false; reason: 'not_valid'; status: Ticket['status'] };

/**
 * Mark a ticket used if, and only if, it is valid and admits to `eventId`.
 *
 * Synchronous on purpose: with no `await` between the check and the write,
 * nothing else can run in between, which is what makes it atomic here.
 */
export function redeemTicket(ticketId: string, eventId: string, now = new Date()): RedeemResult {
  const ticket = tickets.get(ticketId);
  if (!ticket) return { ok: false, reason: 'not_found' };
  if (ticket.eventId !== eventId) return { ok: false, reason: 'wrong_event' };
  if (ticket.status === 'used') return { ok: false, reason: 'already_used', usedAt: ticket.usedAt };
  if (ticket.status !== 'valid') return { ok: false, reason: 'not_valid', status: ticket.status };

  ticket.status = 'used';
  ticket.usedAt = now.toISOString();
  return { ok: true, ticket: { ...ticket } };
}

/**
 * Backend API base, or an empty string when none is configured.
 *
 * Read straight from `process.env` rather than `@/lib/api/server` because this
 * module is reachable from client components, and that helper imports
 * `next/server`.
 */
function backendBase(): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';
  return base.replace(/\/$/, '');
}

/**
 * Redeem a ticket, preferring the backend's single conditional write.
 *
 * With a backend configured this is one `PATCH /tickets/:id/redeem`: the server
 * marks the ticket used only if it was still valid for this event, in a single
 * compare-and-set, and the response says which case it was. There is never a
 * read followed by a separate write, so two gates scanning at once cannot both
 * win, even across server processes.
 *
 * With no backend this delegates to the synchronous in-memory double, so tests
 * and local development keep their existing behaviour. Backend and network
 * failures are thrown for the caller to translate; this function never pretends
 * a redemption succeeded.
 */
export async function redeemTicketAtomic(
  ticketId: string,
  eventId: string,
  now = new Date(),
): Promise<RedeemResult> {
  const base = backendBase();
  if (!base) return redeemTicket(ticketId, eventId, now);

  const response = await fetch(`${base}/tickets/${encodeURIComponent(ticketId)}/redeem`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({ eventId, usedAt: now.toISOString() }),
  });

  const payload: unknown = await response.json().catch(() => undefined);

  if (response.ok) return { ok: true, ticket: payload as Ticket };
  if (response.status === 404) return { ok: false, reason: 'not_found' };
  if (response.status === 422) return { ok: false, reason: 'wrong_event' };

  if (response.status === 409) {
    const body = (payload ?? {}) as { status?: Ticket['status']; usedAt?: string };
    if (body.status === 'used') {
      return { ok: false, reason: 'already_used', usedAt: body.usedAt };
    }
    return { ok: false, reason: 'not_valid', status: body.status ?? 'valid' };
  }

  throw new Error(`Ticket redemption failed: ${response.status} ${response.statusText}`);
}
