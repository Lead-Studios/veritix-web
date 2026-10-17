import { NextResponse, type NextRequest } from 'next/server';
import {
  forwardToBackend,
  readSessionUserId,
  toResponse,
  unauthorized,
} from '@/lib/api/server';

/** Lists tickets belonging to the session user only. */
export async function GET(request: NextRequest) {
  const sessionUserId = readSessionUserId(request);
  if (!sessionUserId) return unauthorized();

  // Built with URLSearchParams so a cookie value containing `&` or `=` is encoded as
  // part of the one `ownerId` value and cannot add or override query parameters.
  const query = new URLSearchParams({ ownerId: sessionUserId });

  try {
    const tickets = await forwardToBackend(`/tickets?${query}`);
    return NextResponse.json(tickets);
  } catch (error) {
    return toResponse(error);
  }
}
