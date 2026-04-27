// FE-085: Verification error state classification

export type VerificationErrorType =
  | "invalid-ticket"
  | "already-used"
  | "service-failure"
  | "network-error";

export interface VerificationError {
  type: VerificationErrorType;
  message: string;
  retryable: boolean;
}

export function classifyVerificationError(
  httpStatus: number | null,
  serverCode?: string
): VerificationError {
  if (httpStatus === null) {
    return { type: "network-error", message: "Network error. Check your connection and try again.", retryable: true };
  }
  if (httpStatus >= 500) {
    return { type: "service-failure", message: "Verification service is temporarily unavailable. Please try again.", retryable: true };
  }
  if (serverCode === "ALREADY_USED") {
    return { type: "already-used", message: "This ticket has already been checked in.", retryable: false };
  }
  return { type: "invalid-ticket", message: "Ticket not found or invalid.", retryable: false };
}