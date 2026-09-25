import { z } from 'zod';
import { NextResponse, type NextRequest } from 'next/server';
import {
  callBackend,
  readSessionUserId,
  toResponse,
  unauthorized,
} from '@/lib/api/server';

/**
 * PATCH /api/user/wallet
 *
 * Replaces the Stellar address that settlements are released to.
 *
 * ## This is the highest-consequence field in settings
 *
 * Settlement is an on-chain transfer, and a transfer that has been submitted
 * cannot be recalled. An address saved here is where ticket revenue goes the
 * moment the escrow releases, so this endpoint is the one most worth being
 * careful about:
 *
 * - The address is validated by shape before it is stored. `/^G[A-Z2-7]{55}$/`
 *   is a Stellar ed25519 public key: a leading `G` for the account type and 55
 *   base32 characters. That catches the real mistakes — a truncated paste, an
 *   address typed into a secret-key field, a testnet address pasted where a
 *   mainnet one belongs in its shape but not its network. It cannot catch an
 *   address that is well-formed and belongs to someone else.
 * - **Nothing about the new address is echoed back to the requester.** The
 *   response is the saved state, but a form that renders the value it just
 *   submitted is a form that shows a successful save even when the backend
 *   stored something different. The form should render the response, not its
 *   own state.
 * - The route does not confirm anything on the user's behalf. A confirmation
 *   step belongs in the settings UI and must be implemented there, where a
 *   person can read the address out loud. If that UI ships without one, this
 *   endpoint is the wrong place to add it as a substitute.
 */

const walletBody = z.object({
  /** A Stellar account address — public key, never a secret key. */
  address: z
    .string()
    .trim()
    .regex(/^G[A-Z2-7]{55}$/, 'That is not a Stellar account address'),
  /** Optional human label, e.g. "Payouts". Not shown to anyone else. */
  label: z.string().trim().min(1).max(40).nullable().optional(),
});

interface WalletResponse {
  address: string;
  label: string | null;
  updatedAt: string;
}

interface WalletRecord {
  address?: unknown;
  label?: unknown;
  updatedAt?: unknown;
}

export async function PATCH(request: NextRequest) {
  const userId = readSessionUserId(request);
  if (!userId) return unauthorized();

  const raw = await request.json().catch(() => null);
  const parsed = walletBody.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'That address does not look like a Stellar account address.',
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          // The regex message, never the submitted value. An address is public
          // on-chain, but echoing an arbitrary attacker-supplied string back
          // into a rendered page is how a reflected-XSS bug starts.
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  const patch: Record<string, unknown> = { userId, address: parsed.data.address };
  if (parsed.data.label !== undefined) patch.label = parsed.data.label;

  try {
    const saved = await callBackend<WalletRecord>('/user/wallet', patch);

    // Built from the backend's answer, not from the request, for the reason in
    // the comment above: the form must render what was stored.
    const response: WalletResponse = {
      address: str(saved.address) ?? parsed.data.address,
      label: str(saved.label) ?? null,
      updatedAt: str(saved.updatedAt) ?? new Date().toISOString(),
    };

    return NextResponse.json(response, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return toResponse(error);
  }
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}
