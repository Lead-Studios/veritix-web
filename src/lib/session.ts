import { jwtVerify, SignJWT } from 'jose';
import { z } from 'zod';
import type { User } from '@/types';

export const SESSION_COOKIE_NAME = 'veritix_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const SESSION_ISSUER = 'veritix-web';
const SESSION_AUDIENCE = 'veritix-web';

const userSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  avatarUrl: z.string().optional(),
  walletAddress: z.string().optional(),
});

function secretKey(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return null;
  // Build the key from a Node Buffer where available: under jsdom a TextEncoder result is a
  // cross-realm Uint8Array that jose rejects. Edge runtimes have no Buffer and use TextEncoder.
  return typeof Buffer !== 'undefined'
    ? new Uint8Array(Buffer.from(secret))
    : new TextEncoder().encode(secret);
}

export function sessionSigningConfigured(): boolean {
  return secretKey() !== null;
}

export async function signSession(user: User): Promise<string> {
  const key = secretKey();
  if (!key) throw new Error('AUTH_SECRET must contain at least 32 characters');

  return new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(key);
}

export async function verifySession(token: string | undefined): Promise<User | null> {
  const key = secretKey();
  if (!key || !token) return null;

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    const parsed = userSchema.safeParse(payload.user);
    if (!parsed.success || payload.sub !== parsed.data.id) return null;
    return parsed.data;
  } catch {
    return null;
  }
}
