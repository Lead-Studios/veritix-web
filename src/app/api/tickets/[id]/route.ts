import { NextResponse, type NextRequest } from 'next/server';
import {
  BackendError,
  forwardToBackend,
  readSessionUserId,
  toResponse,
  unauthorized,
} from '@/lib/api/server';
import type { Ticket } from '@/types';
import { z } from 'zod';

type Params = { params: Promise<{ id: string }> };

const ticketSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  tierId: z.string(),
  ownerId: z.string(),
  status: z.enum(['valid', 'used', 'refunded', 'transferred']),
  escrowId: z.string().optional(),
  issuedAt: z.string(),
  usedAt: z.string().optional(),
});

function notFound() {
  return NextResponse.json(
    { message: 'Ticket not found.' },
    { status: 404, headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function GET(request: NextRequest, { params }: Params) {
  const userId = await readSessionUserId(request);
  if (!userId) return unauthorized();

  const { id } = await params;
  if (!id.trim()) return notFound();

  const query = new URLSearchParams({ ownerId: userId });
  try {
    const ticket = await forwardToBackend<unknown>(
      `/tickets/${encodeURIComponent(id)}?${query}`,
      { method: 'GET' },
    );
    const parsed = ticketSchema.safeParse(ticket);

    if (!parsed.success || parsed.data.ownerId !== userId) return notFound();
    return NextResponse.json(parsed.data satisfies Ticket, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    if (error instanceof BackendError && error.status === 403) return notFound();
    if (error instanceof BackendError && error.status === 404) return notFound();
    return toResponse(error);
  }
}
