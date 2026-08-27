import { apiClient } from './apiClient';
import { getToken } from './auth';
import { ApiError, apiClient } from "./apiClient";

export class AuthError extends Error {
  constructor(message = 'Authentication required. Please log in to verify tickets.') {
    super(message);
    this.name = 'AuthError';
  }
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
  const token = getToken();
  if (!token) {
    throw new AuthError();
  }

  try {
    return await apiClient.post<TicketVerificationResult>(
      '/api/tickets/verify',
      { code },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {
    if (error instanceof Error && (error as any).status === 401) {
      throw new AuthError('Session expired. Please log in again.');
    if (error instanceof ApiError && error.status === 401) {
      throw new AuthError("Session expired. Please log in again.");
    }
    return {
      valid: false,
      errorMessage: 'Verification service unavailable. Please try again.',
    };
  }
}

export async function checkInTicket(
  code: string,
): Promise<{ success: boolean; message: string }> {
  const token = getToken();
  if (!token) {
    throw new AuthError();
  }

  try {
    return await apiClient.post<{ success: boolean; message: string }>(
      '/api/tickets/check-in',
      { code },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {
    if (error instanceof Error && (error as any).status === 401) {
      throw new AuthError('Session expired. Please log in again.');
    if (error instanceof ApiError && error.status === 401) {
      throw new AuthError("Session expired. Please log in again.");
    }
    return { success: false, message: 'Check-in failed. Please try again.' };
  }
}
