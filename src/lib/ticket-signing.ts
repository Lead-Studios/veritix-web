import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Signed ticket payloads — the string encoded in a ticket's QR code.
 *
 * Server-only. The format is `<base64url(json)>.<base64url(hmac-sha256)>`,
 * signed with `TICKET_SIGNING_SECRET` (falling back to `JWT_SECRET`). Anyone
 * can read the claims; nobody without the secret can mint or alter them, which
 * is the whole point: a QR code checked only in the browser can be forged by
 * anyone who can type JSON.
 */

export interface TicketClaims {
  /** Payload format version. */
  v: 1;
  /** Ticket id. */
  tid: string;
  /** Event id the ticket admits to. */
  eid: string;
}

export type VerifyFailure = 'malformed' | 'bad_signature';

export type VerifyResult =
  | { ok: true; claims: TicketClaims }
  | { ok: false; reason: VerifyFailure };

/** A payload longer than this is not a ticket; don't spend an HMAC on it. */
const MAX_PAYLOAD_LENGTH = 1024;
const BASE64URL = /^[A-Za-z0-9_-]+$/;

/**
 * The signing secret, or `null` when none is configured.
 *
 * There is no default. A built-in fallback secret would be public (it is in
 * the repository) and would make every ticket forgeable in any deployment
 * that forgot to set one.
 */
export function signingSecret(): string | null {
  const secret = process.env.TICKET_SIGNING_SECRET || process.env.JWT_SECRET || '';
  return secret.length >= 16 ? secret : null;
}

function hmac(body: string, secret: string): Buffer {
  return createHmac('sha256', secret).update(body).digest();
}

export function signTicketPayload(
  claims: Omit<TicketClaims, 'v'>,
  secret: string,
): string {
  const body = Buffer.from(JSON.stringify({ v: 1, tid: claims.tid, eid: claims.eid })).toString(
    'base64url',
  );
  return `${body}.${hmac(body, secret).toString('base64url')}`;
}

export function verifyTicketPayload(payload: unknown, secret: string): VerifyResult {
  if (typeof payload !== 'string' || payload.length > MAX_PAYLOAD_LENGTH) {
    return { ok: false, reason: 'malformed' };
  }

  const parts = payload.trim().split('.');
  if (parts.length !== 2 || !BASE64URL.test(parts[0]) || !BASE64URL.test(parts[1])) {
    return { ok: false, reason: 'malformed' };
  }
  const [body, signature] = parts;

  // The signature is checked before the body is parsed, so nothing an attacker
  // wrote is interpreted until it is known to be ours.
  const expected = hmac(body, secret);
  const given = Buffer.from(signature, 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return { ok: false, reason: 'bad_signature' };
  }

  let claims: unknown;
  try {
    claims = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  if (
    !claims ||
    typeof claims !== 'object' ||
    (claims as TicketClaims).v !== 1 ||
    typeof (claims as TicketClaims).tid !== 'string' ||
    typeof (claims as TicketClaims).eid !== 'string' ||
    !(claims as TicketClaims).tid ||
    !(claims as TicketClaims).eid
  ) {
    return { ok: false, reason: 'malformed' };
  }

  const { tid, eid } = claims as TicketClaims;
  return { ok: true, claims: { v: 1, tid, eid } };
}
