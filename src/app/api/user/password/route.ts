import { z } from 'zod';
import { NextResponse, type NextRequest } from 'next/server';
import {
  BackendError,
  callBackend,
  readSessionUserId,
  toResponse,
  unauthorized,
} from '@/lib/api/server';

/**
 * PATCH /api/user/password
 *
 * Changes the signed-in user's password.
 *
 * ## This route never returns password material
 *
 * Not the password, not a hash, not a reset token, not a session token, and not
 * an error message containing any of them. The success response is the literal
 * `{ ok: true }` and nothing else. A field-by-field response like
 * `profile/route.ts` builds would also work, but here the whole response is a
 * constant so there is no field to add by accident later.
 *
 * Two things follow from that, and both are easy to get wrong:
 *
 * - **Validation errors do not quote the value.** A message like
 *   `"password must be 12 characters, got 'hunter2xyz'"` is a working password
 *   written into a log line. `zod` reports the field path and the reason; the
 *   submitted value is never interpolated into a message.
 * - **Nothing is logged.** Not the body, not the failure. A password that
 *   reaches a log aggregator has to be treated as compromised everywhere it
 *   was written, and there is no way to recall it.
 */

/**
 * 12 characters minimum, 200 maximum.
 *
 * The maximum is not cosmetic. An unbounded field means an unbounded hash cost
 * on every request, from an unauthenticated-looking endpoint.
 *
 * There is no strength scoring here: that means a breach list, which means a
 * dependency and a list that goes stale. The backend is authoritative and is
 * the right place for that check — a rule enforced only in the browser is a
 * rule the backend still has to duplicate.
 */
const passwordBody = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(12).max(200),
});

export async function PATCH(request: NextRequest) {
  const userId = readSessionUserId(request);
  if (!userId) return unauthorized();

  const raw = await request.json().catch(() => null);
  const parsed = passwordBody.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Check the new password and try again.',
        // `field` and `message` only. Never `received`, never the value.
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  if (parsed.data.currentPassword === parsed.data.newPassword) {
    return NextResponse.json(
      {
        message: 'Choose a password you have not used here before.',
        fields: [
          { field: 'newPassword', message: 'Must differ from the current password' },
        ],
      },
      { status: 422 },
    );
  }

  try {
    // The backend hashes, stores, and decides whether `currentPassword` was
    // right. Doing any of that here would put a hash function in the web tier
    // and split the policy across two places.
    await callBackend('/user/password', { userId, ...parsed.data });

    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    // A backend that echoes the submitted password back inside its own error
    // message would otherwise have that password forwarded to the browser and
    // written into the browser's network log. Cheap to check, and it turns a
    // plausible backend mistake into a redacted string.
    return toResponse(
      scrubSecrets(error, [parsed.data.currentPassword, parsed.data.newPassword]),
    );
  }
}

/** Replace any submitted secret that has leaked into an error message. */
function scrubSecrets(error: unknown, secrets: readonly string[]): unknown {
  if (!(error instanceof BackendError)) return error;

  let message = error.message;
  for (const secret of secrets) {
    if (secret) message = message.split(secret).join('[redacted]');
  }

  return message === error.message ? error : new BackendError(error.status, message);
}
