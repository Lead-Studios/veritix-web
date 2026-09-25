import { z } from 'zod';
import { NextResponse, type NextRequest } from 'next/server';
import {
  callBackend,
  readSessionUserId,
  toResponse,
  unauthorized,
} from '@/lib/api/server';

/**
 * PATCH /api/user/profile
 *
 * Saves the profile form. The field set is a whitelist rather than "whatever
 * the form posted": an allow-list means a client cannot add a field the form
 * did not offer, and it means the backend never receives a `role` or a
 * `password` field from a form that was only ever supposed to hold a display
 * name.
 *
 * No GET here on purpose. The settings pages do not exist yet to consume one,
 * and a read endpoint added before its only reader is a route nobody has
 * tested. The form should get its current values from the session payload
 * rendered with the page, not from a second round trip.
 */

const profileBody = z.object({
  displayName: z.string().trim().min(2).max(80),
  /** `null` clears it. An empty string is rejected rather than treated as null. */
  avatarUrl: z.string().url().max(500).nullable().optional(),
  city: z.string().trim().min(2).max(80).nullable().optional(),
});

/**
 * What the route is willing to give back.
 *
 * Built field by field instead of passing the backend's response through, for
 * one reason: a pass-through forwards anything the backend adds later,
 * including the day it adds a password hash or a reset token to the user
 * record. There is no review step for that here.
 */
interface ProfileResponse {
  displayName: string;
  avatarUrl: string | null;
  city: string | null;
  email: string;
}

interface ProfileRecord {
  displayName?: unknown;
  avatarUrl?: unknown;
  city?: unknown;
  email?: unknown;
}

export async function PATCH(request: NextRequest) {
  const userId = readSessionUserId(request);
  if (!userId) return unauthorized();

  const raw = await request.json().catch(() => null);
  const parsed = profileBody.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Check the profile details and try again.',
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  // A field the form did not send is not "clear it". `undefined` here means
  // "leave it alone"; only an explicit `null` clears a field. Conflating the
  // two is the classic way a settings form wipes a user's data by reloading.
  const patch: Record<string, unknown> = { userId, displayName: parsed.data.displayName };
  if (parsed.data.avatarUrl !== undefined) patch.avatarUrl = parsed.data.avatarUrl;
  if (parsed.data.city !== undefined) patch.city = parsed.data.city;

  try {
    const updated = await callBackend<ProfileRecord>('/user/profile', patch);

    const response: ProfileResponse = {
      displayName: str(updated.displayName) ?? parsed.data.displayName,
      avatarUrl: str(updated.avatarUrl) ?? null,
      city: str(updated.city) ?? null,
      email: str(updated.email) ?? '',
    };

    // The response changes the row the session was rendered from, so it must
    // not be cached anywhere on the way back.
    return NextResponse.json(response, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return toResponse(error);
  }
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}
