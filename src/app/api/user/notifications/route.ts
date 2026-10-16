import { z } from 'zod';
import { NextResponse, type NextRequest } from 'next/server';
import {
  callBackend,
  readSessionUserId,
  toResponse,
  unauthorized,
} from '@/lib/api/server';

/**
 * PATCH /api/user/notifications
 *
 * Saves the notification toggles.
 *
 * ## Why `undefined` and `false` are different
 *
 * A partial body is accepted, and a field that is absent means "leave it
 * alone". Only an explicit `false` turns a notification off. The alternative —
 * treating a missing key as `false` — means any client that sends one toggle
 * silently switches the other four off, and the user finds out weeks later
 * that they stopped hearing about settlements. A settings endpoint that can
 * quietly turn something off is worse than one that rejects the request, so an
 * empty body is a 422 rather than a no-op.
 *
 * The response carries all five, so the form can resynchronise from the
 * server's answer instead of assuming its own optimistic state was correct.
 */

const notificationBody = z.object({
  /** The monthly newsletter. */
  emailDigest: z.boolean().optional(),
  /** New features and announcements. */
  productUpdates: z.boolean().optional(),
  /** Someone bought a ticket for one of your events. */
  ticketSales: z.boolean().optional(),
  /** Your escrow settled or a payout failed. Transactional in practice. */
  settlementAlerts: z.boolean().optional(),
  /**
   * Marketing email. Separate from the digest because they are separate
   * decisions: someone who wants settlement alerts has not agreed to receive
   * anything else.
   */
  marketing: z.boolean().optional(),
});

type NotificationState = {
  emailDigest: boolean;
  productUpdates: boolean;
  ticketSales: boolean;
  settlementAlerts: boolean;
  marketing: boolean;
};

const ALL_OFF: NotificationState = {
  emailDigest: false,
  productUpdates: false,
  ticketSales: false,
  settlementAlerts: false,
  marketing: false,
};

export async function PATCH(request: NextRequest) {
  const userId = readSessionUserId(request);
  if (!userId) return unauthorized();

  const raw = await request.json().catch(() => null);
  const parsed = notificationBody.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'The notification settings could not be read.',
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  const changes = Object.entries(parsed.data).filter(
    (entry): entry is [keyof NotificationState, boolean] => entry[1] !== undefined,
  );

  if (changes.length === 0) {
    return NextResponse.json(
      {
        message: 'Nothing to change.',
        fields: [
          {
            field: 'form',
            message: 'Send at least one notification setting to change it',
          },
        ],
      },
      { status: 422 },
    );
  }

  try {
    const updated = await callBackend<Partial<NotificationState>>('/user/notifications', {
      userId,
      ...Object.fromEntries(changes),
    });

    // Falls back to the value that was just sent rather than to `false`, so a
    // backend that answers with only the fields it changed cannot make an
    // unchanged toggle look like it was switched off.
    const response: NotificationState = {
      emailDigest:
        bool(updated.emailDigest) ?? parsed.data.emailDigest ?? ALL_OFF.emailDigest,
      productUpdates:
        bool(updated.productUpdates) ??
        parsed.data.productUpdates ??
        ALL_OFF.productUpdates,
      ticketSales:
        bool(updated.ticketSales) ?? parsed.data.ticketSales ?? ALL_OFF.ticketSales,
      settlementAlerts:
        bool(updated.settlementAlerts) ??
        parsed.data.settlementAlerts ??
        ALL_OFF.settlementAlerts,
      marketing: bool(updated.marketing) ?? parsed.data.marketing ?? ALL_OFF.marketing,
    };

    return NextResponse.json(response, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return toResponse(error);
  }
}

function bool(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}
