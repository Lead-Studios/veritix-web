import { beforeAll, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/verify/route';
import { signTicketPayload } from '@/lib/ticket-signing';
import { issueTicket } from '@/lib/ticket-store';

const SECRET = 'test-ticket-signing-secret-0123456789';
/** Organizer of evt_1 in the events fixture. */
const ORGANIZER = 'org_1';

beforeAll(() => {
  process.env.TICKET_SIGNING_SECRET = SECRET;
});

let seq = 0;
/** A fresh valid ticket, so no test depends on another having scanned first. */
function newTicket(eventId = 'evt_1') {
  const id = `tkt_test_${++seq}`;
  issueTicket({
    id,
    eventId,
    tierId: 'tier_test',
    ownerId: 'user_test',
    status: 'valid',
    issuedAt: '2026-09-01T00:00:00.000Z',
  });
  return { id, payload: signTicketPayload({ tid: id, eid: eventId }, SECRET) };
}

function scan(body: unknown, userId: string | null = ORGANIZER) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (userId) headers.cookie = `session_user_id=${userId}`;
  return POST(
    new NextRequest('http://localhost/api/verify', {
      method: 'POST',
      headers,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );
}

describe('POST /api/verify', () => {
  it('accepts a valid ticket', async () => {
    const ticket = newTicket();
    const res = await scan({ payload: ticket.payload, eventId: 'evt_1' });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('valid');
    expect(body.ticketId).toBe(ticket.id);
    expect(body.usedAt).toEqual(expect.any(String));
  });

  describe('double entry', () => {
    it('rejects a second scan of the same ticket as already used', async () => {
      const ticket = newTicket();

      const first = await scan({ payload: ticket.payload, eventId: 'evt_1' });
      expect(first.status).toBe(200);

      const second = await scan({ payload: ticket.payload, eventId: 'evt_1' });
      expect(second.status).toBe(409);
      const body = await second.json();
      expect(body.status).toBe('already_used');
      expect(body.usedAt).toBe((await first.json()).usedAt);
    });

    it('admits exactly once when two gates scan the same ticket at the same time', async () => {
      const ticket = newTicket();

      const results = await Promise.all(
        Array.from({ length: 5 }, () => scan({ payload: ticket.payload, eventId: 'evt_1' })),
      );
      const statuses = results.map((res) => res.status).sort();

      expect(statuses).toEqual([200, 409, 409, 409, 409]);
    });
  });

  describe('wrong event', () => {
    it('rejects a ticket for another event', async () => {
      const ticket = newTicket('evt_2');
      const res = await scan({ payload: ticket.payload, eventId: 'evt_1' });

      expect(res.status).toBe(422);
      expect((await res.json()).status).toBe('wrong_event');
    });

    it('does not burn a ticket scanned at the wrong gate', async () => {
      const ticket = newTicket('evt_2');
      await scan({ payload: ticket.payload, eventId: 'evt_1' });

      // Still valid at its own event, scanned by that event's organizer.
      const res = await scan({ payload: ticket.payload, eventId: 'evt_2' }, 'org_2');
      expect(res.status).toBe(200);
    });

    it('rejects a ticket whose stored event differs from the signed one', async () => {
      const ticket = newTicket('evt_2');
      const payload = signTicketPayload({ tid: ticket.id, eid: 'evt_1' }, SECRET);
      const res = await scan({ payload, eventId: 'evt_1' });

      expect(res.status).toBe(422);
      expect((await res.json()).status).toBe('wrong_event');
    });
  });

  describe('malformed or forged payloads', () => {
    it.each([
      ['an empty string', ''],
      ['plain text', 'hello'],
      ['raw JSON', JSON.stringify({ v: 1, tid: 'tkt_1001', eid: 'evt_1' })],
      ['too many segments', 'a.b.c'],
      ['non-base64url characters', 'ab$cd.ef!gh'],
      ['an oversized payload', 'a'.repeat(5_000)],
    ])('rejects %s', async (_label, payload) => {
      const res = await scan({ payload, eventId: 'evt_1' });
      expect(res.status).toBe(400);
      expect((await res.json()).status).toBe('malformed');
    });

    it.each([
      ['a missing body', undefined],
      ['invalid JSON', '{not json'],
      ['a non-string payload', { payload: 12345, eventId: 'evt_1' }],
      ['a missing eventId', { payload: 'x.y' }],
    ])('rejects %s', async (_label, body) => {
      const res = await scan(body ?? '');
      expect(res.status).toBe(400);
      expect((await res.json()).status).toBe('malformed');
    });

    it('rejects a payload signed with a different secret', async () => {
      const ticket = newTicket();
      const forged = signTicketPayload(
        { tid: ticket.id, eid: 'evt_1' },
        'attacker-secret-0123456789abcdef',
      );
      const res = await scan({ payload: forged, eventId: 'evt_1' });

      expect(res.status).toBe(400);
      expect((await res.json()).status).toBe('invalid_signature');
    });

    it('rejects a payload whose claims were edited after signing', async () => {
      const ticket = newTicket('evt_2');
      const [, signature] = ticket.payload.split('.');
      const edited = Buffer.from(
        JSON.stringify({ v: 1, tid: ticket.id, eid: 'evt_1' }),
      ).toString('base64url');
      const res = await scan({ payload: `${edited}.${signature}`, eventId: 'evt_1' });

      expect(res.status).toBe(400);
      expect((await res.json()).status).toBe('invalid_signature');
    });

    it('rejects a genuine signature over claims that are not a ticket', async () => {
      const body = Buffer.from(JSON.stringify({ hello: 'world' })).toString('base64url');
      const { createHmac } = await import('node:crypto');
      const sig = createHmac('sha256', SECRET).update(body).digest('base64url');
      const res = await scan({ payload: `${body}.${sig}`, eventId: 'evt_1' });

      expect(res.status).toBe(400);
      expect((await res.json()).status).toBe('malformed');
    });
  });

  describe('access', () => {
    it('requires a session', async () => {
      const ticket = newTicket();
      expect((await scan({ payload: ticket.payload, eventId: 'evt_1' }, null)).status).toBe(401);
    });

    it("returns 404 when scanning for someone else's event, and leaves the ticket unused", async () => {
      const ticket = newTicket();
      const res = await scan({ payload: ticket.payload, eventId: 'evt_1' }, 'org_2');
      expect(res.status).toBe(404);

      expect((await scan({ payload: ticket.payload, eventId: 'evt_1' })).status).toBe(200);
    });

    it('fails closed when no signing secret is configured', async () => {
      const ticket = newTicket();
      const saved = { t: process.env.TICKET_SIGNING_SECRET, j: process.env.JWT_SECRET };
      delete process.env.TICKET_SIGNING_SECRET;
      delete process.env.JWT_SECRET;
      try {
        expect((await scan({ payload: ticket.payload, eventId: 'evt_1' })).status).toBe(503);
      } finally {
        process.env.TICKET_SIGNING_SECRET = saved.t;
        if (saved.j !== undefined) process.env.JWT_SECRET = saved.j;
      }
    });
  });
});
