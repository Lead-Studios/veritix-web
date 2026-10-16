import { createHmac } from 'node:crypto';

const SESSION_SECRET = 'test-session-secret-that-is-long-enough-for-auth';

export function signedSessionCookie(userId: string): string {
  process.env.AUTH_SECRET = SESSION_SECRET;

  const now = Math.floor(Date.now() / 1000);
  const user = {
    id: userId,
    email: `${encodeURIComponent(userId)}@example.test`,
    name: userId,
  };
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const header = encode({ alg: 'HS256' });
  const payload = encode({
    user,
    sub: userId,
    iss: 'veritix-web',
    aud: 'veritix-web',
    iat: now,
    exp: now + 60 * 60,
  });
  const signature = createHmac('sha256', SESSION_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `veritix_session=${header}.${payload}.${signature}`;
}
