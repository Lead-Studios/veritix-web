import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as login } from '@/app/api/auth/login/route';
import { POST as logout } from '@/app/api/auth/logout/route';
import { GET as session } from '@/app/api/auth/session/route';
import { GET as getTicket } from '@/app/api/tickets/[id]/route';
import { SESSION_COOKIE_NAME } from '@/lib/session';
import { signedSessionCookie } from './session-test-helpers';

const fetchMock = vi.fn();
const USER = {
  id: 'user-1',
  email: 'user@example.test',
  name: 'Example User',
};
const TICKET = {
  id: 'ticket-1',
  eventId: 'event-1',
  tierId: 'tier-1',
  ownerId: USER.id,
  status: 'valid',
  issuedAt: '2026-10-01T00:00:00.000Z',
};

function request(url: string, cookie?: string, body?: unknown): NextRequest {
  return new NextRequest(url, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      ...(cookie ? { cookie } : {}),
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function backendResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Forbidden',
    text: async () => JSON.stringify(body),
  };
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('AUTH_SECRET', 'test-auth-secret-with-at-least-thirty-two-characters');
  vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://backend.test/api');
  vi.stubEnv('NODE_ENV', 'production');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('authentication routes', () => {
  it('creates a signed HttpOnly, SameSite=Lax, Secure cookie on login', async () => {
    fetchMock.mockResolvedValue(backendResponse({ user: USER, accessToken: 'not-for-client' }));

    const response = await login(
      request('http://localhost/api/auth/login', undefined, {
        email: USER.email,
        password: 'A test password',
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(USER);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://backend.test/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: USER.email, password: 'A test password' }),
      }),
    );
    const cookie = response.cookies.get(SESSION_COOKIE_NAME);
    expect(cookie?.value).toBeTruthy();
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(response.headers.get('set-cookie')).toContain('SameSite=Lax');
    expect(response.headers.get('set-cookie')).toContain('Secure');
    expect(response.headers.get('set-cookie')).toContain('Path=/');

    const sessionResponse = await session(
      request('http://localhost/api/auth/session', `${SESSION_COOKIE_NAME}=${cookie?.value}`),
    );
    expect(sessionResponse.status).toBe(200);
    expect(await sessionResponse.json()).toEqual(USER);
  });

  it('does not call the backend for invalid credentials', async () => {
    const response = await login(
      request('http://localhost/api/auth/login', undefined, { email: 'bad', password: '' }),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns a bodyless 401 for a missing, invalid, or unsigned session cookie', async () => {
    for (const cookie of [undefined, `${SESSION_COOKIE_NAME}=tampered`, 'session_user_id=user-1']) {
      const response = await session(request('http://localhost/api/auth/session', cookie));
      expect(response.status).toBe(401);
      expect(await response.text()).toBe('');
    }
  });

  it('clears the session cookie on logout', async () => {
    const response = await logout();

    expect(response.status).toBe(204);
    expect(response.headers.get('set-cookie')).toContain(`${SESSION_COOKIE_NAME}=`);
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(response.headers.get('set-cookie')).toContain('Secure');
  });
});

describe('GET /api/tickets/[id]', () => {
  it('requests and returns a ticket scoped to the signed-in user', async () => {
    fetchMock.mockResolvedValue(backendResponse(TICKET));

    const response = await getTicket(
      request(
        'http://localhost/api/tickets/ticket-1',
        signedSessionCookie(USER.id),
      ),
      { params: Promise.resolve({ id: 'ticket-1' }) },
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(TICKET);
    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.pathname).toBe('/api/tickets/ticket-1');
    expect(url.searchParams.getAll('ownerId')).toEqual([USER.id]);
  });

  it("returns 404 rather than exposing another user's ticket", async () => {
    fetchMock.mockResolvedValue(backendResponse({ ...TICKET, ownerId: 'another-user' }));

    const response = await getTicket(
      request('http://localhost/api/tickets/ticket-1', signedSessionCookie(USER.id)),
      { params: Promise.resolve({ id: 'ticket-1' }) },
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ message: 'Ticket not found.' });
  });

  it('conceals an upstream forbidden response as 404', async () => {
    fetchMock.mockResolvedValue(backendResponse({ message: 'Forbidden' }, 403));

    const response = await getTicket(
      request('http://localhost/api/tickets/ticket-1', signedSessionCookie(USER.id)),
      { params: Promise.resolve({ id: 'ticket-1' }) },
    );

    expect(response.status).toBe(404);
  });

  it('requires a verified signed session', async () => {
    const response = await getTicket(
      request('http://localhost/api/tickets/ticket-1', 'session_user_id=user-1'),
      { params: Promise.resolve({ id: 'ticket-1' }) },
    );

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
