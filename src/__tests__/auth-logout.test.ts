import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/auth/logout/route';

describe('POST /api/auth/logout', () => {
  it('expires both supported session cookies without caching the response', async () => {
    const response = await POST();

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(response.cookies.getAll().map(({ name }) => name)).toEqual([
      'session_user_id',
      'veritix_session',
    ]);
    expect(response.cookies.getAll().every(({ expires }) => expires?.getTime() === 0)).toBe(true);
  });
});
