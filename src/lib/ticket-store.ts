import type { Ticket } from '@/types';

/**
 * Ticket records the gate scanner checks against.
 *
 * Like the events catalogue in `src/lib/events.ts`, this is an in-memory
 * stand-in until a real database is wired up. `redeemTicket` is the one
 * function that must keep its guarantee when that happens: its read and write
 * run in a single synchronous step, so two scans of the same ticket cannot
 * both see it as valid. Against a database that becomes one conditional
 * write — `UPDATE tickets SET status = 'used' ... WHERE id = $1 AND status =
 * 'valid'` and checking the affected row count — never a read followed by a
 * separate write.
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

for (const ticket of SEED) tickets.set(ticket.id, { ...ticket });

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
