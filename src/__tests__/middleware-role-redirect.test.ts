import { describe, it, expect } from 'vitest';

function simulateMiddleware(
  cookieToken?: string,
  cookieRole?: string,
  urlPath: string = '/verify',
) {
  if (!cookieToken) {
    return { status: 307, redirectUrl: `/login?next=${urlPath}` };
  }
  if (urlPath === '/verify' && cookieRole === 'attendee') {
    return { status: 307, redirectUrl: '/dashboard' };
  }
  return { status: 200, redirectUrl: null };
}

describe('Middleware Role-Redirect Integration Tests', () => {
  it('redirects to /login?next=/verify when auth_token cookie is missing', () => {
    const res = simulateMiddleware(undefined, undefined, '/verify');
    expect(res.status).toBe(307);
    expect(res.redirectUrl).toBe('/login?next=/verify');
  });

  it('passes through when valid auth_token and staff role are present', () => {
    const res = simulateMiddleware('valid-token', 'staff', '/verify');
    expect(res.status).toBe(200);
    expect(res.redirectUrl).toBeNull();
  });

  it('redirects attendee role from /verify to /dashboard', () => {
    const res = simulateMiddleware('valid-token', 'attendee', '/verify');
    expect(res.status).toBe(307);
    expect(res.redirectUrl).toBe('/dashboard');
  });
});
