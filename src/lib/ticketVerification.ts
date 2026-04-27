// FE-082: Real ticket check-in API integration for verification flow

export interface TicketVerificationResult {
  valid: boolean;
  alreadyUsed?: boolean;
  holderName?: string;
  ticketType?: string;
  event?: string;
  errorMessage?: string;
}

export async function verifyTicket(code: string): Promise<TicketVerificationResult> {
  const res = await fetch("/api/tickets/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    return { valid: false, errorMessage: "Verification service unavailable. Please try again." };
  }
  return res.json();
}

export async function checkInTicket(code: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/tickets/check-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) return { success: false, message: "Check-in failed. Please try again." };
  return res.json();
}