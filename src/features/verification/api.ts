const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export interface VerificationResult {
  status: 'VALID' | 'ALREADY_USED' | 'INVALID' | 'CANCELLED';
  holderName?: string;
  ticketType?: string;
  event?: string;
  date?: string;
  seat?: string;
}

/**
 * POST /api/verification/verify
 * Sends a ticket code to the backend and returns the verification result.
 * Throws a TypeError (network error) if the request cannot be made.
 * Returns the raw Response for HTTP-level error inspection by the caller.
 */
export async function verifyTicket(ticketCode: string): Promise<{
  ok: boolean;
  status: number;
  data: VerificationResult | null;
}> {
  const res = await fetch(`${API_BASE}/api/verification/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketCode: ticketCode.trim() }),
  });

  if (!res.ok) {
    return { ok: false, status: res.status, data: null };
  }

  const data: VerificationResult = await res.json();
  return { ok: true, status: res.status, data };
}
