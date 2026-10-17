import { NextResponse, type NextRequest } from 'next/server';
import { queryPayouts } from '@/lib/payouts';
import { readSessionUserId, unauthorized } from '@/lib/api/server';

/**
 * GET /api/payouts
 *
 * Escrowed and settled payouts for the signed-in organizer.
 *
 * The owner is read from the session cookie and passed down as the only scope,
 * so no `ownerId` ever comes from the query string and one organizer cannot
 * read another's settlement records. Anonymous callers get a 401.
 */
export async function GET(request: NextRequest) {
  const userId = readSessionUserId(request);
  if (!userId) return unauthorized();

  return NextResponse.json(queryPayouts(userId), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
