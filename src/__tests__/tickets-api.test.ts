import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/tickets/route';
import { signedSessionCookie } from './session-test-helpers';

const fetchMock = vi.fn();

function requestWithSession(value?: string): NextRequest {
  return new NextRequest('http://localhost/api/tickets', {
    headers: value === undefined ? {} : { cookie: signedSessionCookie(value) },
  });
}

/** A Response-like object; `forwardToBackend` reads `.text()`, not `.json()`. */
function backendResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status >= 400 ? 'Backend error' : 'OK',
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  } as unknown as Response;
}

/** The URL the route asked the backend for. */
function backendUrl(): URL {
  expect(fetchMock).toHaveBeenCalledTimes(1);
  return new URL(fetchMock.mock.calls[0][0] as string);
}

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(backendResponse([]));
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://backend.test');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('GET /api/tickets', () => {
  it('rejects a request with no session', async () => {
    const response = await GET(requestWithSession());

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('asks the backend for the session user only', async () => {
    await GET(requestWithSession('user-42'));

    const url = backendUrl();
    expect(url.pathname).toBe('/tickets');
    expect(url.searchParams.getAll('ownerId')).toEqual(['user-42']);
  });

  it('cannot be made to send a second ownerId through the cookie', async () => {
    await GET(requestWithSession('abc&ownerId=victim'));

    const url = backendUrl();
    expect(url.searchParams.getAll('ownerId')).toEqual(['abc&ownerId=victim']);
    expect([...url.searchParams.keys()]).toEqual(['ownerId']);
    expect(url.search).not.toContain('ownerId=victim');
  });

  it('keeps other special characters inside the value', async () => {
    await GET(requestWithSession('a b#c?d'));

    const url = backendUrl();
    expect(url.searchParams.get('ownerId')).toBe('a b#c?d');
    expect(url.hash).toBe('');
  });

  it('passes a backend client error through with its status and message', async () => {
    fetchMock.mockResolvedValue(backendResponse({ message: 'No such owner' }, 404));

    const response = await GET(requestWithSession('user-42'));

    expect(response.status).toBe(404);
    expect((await response.json()).message).toBe('No such owner');
  });

  it('maps a backend failure to 502', async () => {
    fetchMock.mockResolvedValue(backendResponse({ message: 'boom' }, 500));

    const response = await GET(requestWithSession('user-42'));

    expect(response.status).toBe(502);
  });

  it('maps an unreachable backend to 502', async () => {
    fetchMock.mockRejectedValue(new Error('connect ECONNREFUSED'));

    const response = await GET(requestWithSession('user-42'));

    expect(response.status).toBe(502);
  });
});
