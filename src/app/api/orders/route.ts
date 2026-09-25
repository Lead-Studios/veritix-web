import { NextResponse, type NextRequest } from 'next/server';
import type { OrderStatus } from '@/types';

/**
 * Order and escrow endpoints used by the checkout payment step.
 *
 *   POST   /api/orders          create the order and its escrow, returning the
 *                                unsigned payment envelope to hand to the wallet
 *   PATCH  /api/orders          submit the signed envelope and move the order along
 *   GET    /api/orders?id=..    read one order's current status, so checkout can
 *                                poll until the transaction confirms
 *   GET    /api/orders          list the session user's orders (no `id`)
 *
 * This route is a thin server-side proxy. Escrow creation needs the platform's
 * Stellar secret key, which must never reach the browser, and the backend owns
 * order persistence — so the frontend asks here and this handler signs nothing.
 * An order stays `pending` until the backend reports the transaction confirmed;
 * nothing marks it paid early.
 *
 * Every handler requires an authenticated session (`session_user_id` cookie) —
 * escrow orders are addressed to a Stellar wallet, but they still belong to the
 * signed-in buyer who initiated checkout.
 */

interface OrderDraft {
  eventId: string;
  buyerAddress: string;
  /** Stroops, as a string so it survives JSON without losing precision. */
  amountStroops: string;
  lines: Array<{ tierId: string; quantity: number }>;
}

interface OrderRecord {
  id: string;
  status: OrderStatus;
  /** Set once escrow creation succeeds. */
  escrowId: string;
  /** Unsigned envelope for the buyer's wallet to sign. */
  paymentXdr?: string;
  createdAt: string;
}

/** Backend API base. Falls back to the app's own public API URL. */
function backendBase(): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';
  return base.replace(/\/$/, '');
}

async function callBackend<T>(path: string, init: RequestInit): Promise<T> {
  const base = backendBase();

  if (!base) {
    throw new Error('No backend API base URL configured');
  }

  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
    cache: 'no-store',
  });

  const text = await response.text();
  const payload: unknown = text ? safeJson(text) : undefined;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : response.statusText;
    throw new Error(message);
  }

  return payload as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

function upstream(error: unknown) {
  const message = error instanceof Error ? error.message : 'Escrow service unavailable';
  return NextResponse.json({ message }, { status: 502 });
}

/** Create the order and its escrow, and return the envelope the wallet signs. */
export async function POST(request: NextRequest) {
  const sessionUserId = request.cookies.get('session_user_id')?.value;
  if (!sessionUserId) return unauthorized();

  const draft = (await request.json().catch(() => null)) as OrderDraft | null;

  if (
    !draft ||
    typeof draft.eventId !== 'string' ||
    typeof draft.buyerAddress !== 'string'
  ) {
    return badRequest('An order needs an eventId and a buyerAddress');
  }

  if (!Array.isArray(draft.lines) || draft.lines.length === 0) {
    return badRequest('An order needs at least one ticket line');
  }

  if (!/^\d+$/.test(draft.amountStroops ?? '')) {
    return badRequest('amountStroops must be a whole number of stroops');
  }

  try {
    // The backend opens the escrow account and prepares the payment envelope.
    const order = await callBackend<OrderRecord>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        eventId: draft.eventId,
        buyerId: sessionUserId,
        buyerAddress: draft.buyerAddress,
        amountStroops: draft.amountStroops,
        lines: draft.lines,
        // The order is only ever created in a pending state.
        status: 'pending' satisfies OrderStatus,
      }),
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return upstream(error);
  }
}

/** Submit the wallet-signed envelope. The order moves on, but never to `paid`. */
export async function PATCH(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    orderId?: string;
    signedXdr?: string;
  } | null;

  if (!body?.orderId || !body.signedXdr) {
    return badRequest('Submitting a payment needs an orderId and a signedXdr');
  }

  try {
    const order = await callBackend<OrderRecord>(`/orders/${body.orderId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ signedXdr: body.signedXdr }),
    });

    return NextResponse.json(order);
  } catch (error) {
    return upstream(error);
  }
}

/**
 * With `?id=`, the current status of that one order (checkout polls this
 * until the transaction confirms). Without it, the session user's orders.
 */
export async function GET(request: NextRequest) {
  const sessionUserId = request.cookies.get('session_user_id')?.value;
  if (!sessionUserId) return unauthorized();

  const orderId = request.nextUrl.searchParams.get('id')?.trim();

  try {
    if (orderId) {
      const order = await callBackend<OrderRecord>(
        `/orders/${encodeURIComponent(orderId)}`,
        { method: 'GET' },
      );
      return NextResponse.json(order);
    }

    const orders = await callBackend<OrderRecord[]>(
      `/orders?buyerId=${encodeURIComponent(sessionUserId)}`,
      { method: 'GET' },
    );
    return NextResponse.json(orders);
  } catch (error) {
    return upstream(error);
  }
}
