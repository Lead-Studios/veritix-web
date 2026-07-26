// FE-082: Real ticket check-in API integration for verification flow

import { getToken } from "@/lib/auth";

export class AuthError extends Error {
  constructor(message = "Authentication required. Please log in to verify tickets.") {
    super(message);
    this.name = "AuthError";
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) throw new AuthError();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

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
    headers: getAuthHeaders(),
    body: JSON.stringify({ code }),
  });
  if (res.status === 401) {
    throw new AuthError("Session expired. Please log in again.");
  }
  if (!res.ok) {
    return { valid: false, errorMessage: "Verification service unavailable. Please try again." };
  }
  return res.json();
}

export async function checkInTicket(code: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/tickets/check-in", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ code }),
  });
  if (res.status === 401) {
    throw new AuthError("Session expired. Please log in again.");
  }
  if (!res.ok) return { success: false, message: "Check-in failed. Please try again." };
  return res.json();
}
