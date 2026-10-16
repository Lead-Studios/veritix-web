import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as createRoute } from '@/app/api/events/route';
import { PATCH as updateRoute } from '@/app/api/events/[id]/route';
import { POST as publishRoute } from '@/app/api/events/[id]/publish/route';
import { POST as cancelRoute } from '@/app/api/events/[id]/cancel/route';

const OWNER = 'org_owner_test';
const STRANGER = 'org_stranger_test';

function request(method: string, userId: string | null, body?: unknown): NextRequest {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (userId) headers.cookie = `session_user_id=${userId}`;
  return new NextRequest('http://localhost/api/events', {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

const body = {
  title: 'Ownership Test Night',
  description: 'Testing.',
  venue: 'Hall',
  city: 'Lagos',
  startsAt: '2026-12-01T18:00:00.000Z',
  endsAt: '2026-12-01T22:00:00.000Z',
  tiers: [{ name: 'GA', priceMinor: 1_000, currency: 'USD', quantityTotal: 50 }],
};

async function createDraft(): Promise<string> {
  const res = await createRoute(request('POST', OWNER, body));
  expect(res.status).toBe(201);
  return ((await res.json()) as { id: string }).id;
}

describe('events API', () => {
  it('creates a draft owned by the session user', async () => {
    const res = await createRoute(
      request('POST', OWNER, { ...body, organizer: { id: 'someone_else' } }),
    );
    const event = await res.json();
    expect(res.status).toBe(201);
    expect(event.status).toBe('draft');
    expect(event.organizer.id).toBe(OWNER);
  });

  it('requires a session to create', async () => {
    expect((await createRoute(request('POST', null, body))).status).toBe(401);
  });

  it('rejects an invalid create with 422', async () => {
    const res = await createRoute(request('POST', OWNER, { ...body, tiers: [] }));
    expect(res.status).toBe(422);
  });

  it('lets the owner update, publish, and cancel', async () => {
    const id = await createDraft();

    const updated = await updateRoute(request('PATCH', OWNER, { title: 'Renamed' }), ctx(id));
    expect(updated.status).toBe(200);
    expect((await updated.json()).title).toBe('Renamed');

    const published = await publishRoute(request('POST', OWNER), ctx(id));
    expect((await published.json()).status).toBe('published');

    const cancelled = await cancelRoute(request('POST', OWNER), ctx(id));
    expect((await cancelled.json()).status).toBe('cancelled');
  });

  it("returns 404, not 403, for someone else's event", async () => {
    const id = await createDraft();

    for (const res of [
      await updateRoute(request('PATCH', STRANGER, { title: 'Hijacked' }), ctx(id)),
      await publishRoute(request('POST', STRANGER), ctx(id)),
      await cancelRoute(request('POST', STRANGER), ctx(id)),
    ]) {
      expect(res.status).toBe(404);
    }

    // Indistinguishable from an id that does not exist.
    const missing = await publishRoute(request('POST', STRANGER), ctx('evt_nope'));
    expect(missing.status).toBe(404);
    expect(await missing.json()).toEqual({ message: 'Event not found.' });
  });

  it('rejects an invalid lifecycle transition with 409', async () => {
    const id = await createDraft();
    await cancelRoute(request('POST', OWNER), ctx(id));
    expect((await publishRoute(request('POST', OWNER), ctx(id))).status).toBe(409);
    expect((await updateRoute(request('PATCH', OWNER, { title: 'x' }), ctx(id))).status).toBe(409);
  });

  it('validates the merged event on update', async () => {
    const id = await createDraft();
    const res = await updateRoute(
      request('PATCH', OWNER, { endsAt: '2026-11-30T00:00:00.000Z' }),
      ctx(id),
    );
    expect(res.status).toBe(422);
  });
});
