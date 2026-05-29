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

export interface VerificationErrorMessage {
  /** Short headline shown in the result banner. */
  title: string;
  /** Actionable, user-friendly explanation shown to the operator. */
  description: string;
  /** Label for the primary CTA button. */
  actionLabel: string;
  /** Whether the operator should be encouraged to retry. */
  retryable: boolean;
}

const VERIFICATION_ERROR_MESSAGES: Record<
  VerificationErrorType,
  VerificationErrorMessage
> = {
  "invalid-ticket": {
    title: "Invalid ticket",
    description:
      "We couldn\u2019t find a ticket matching this code. Double-check the code with the attendee and try again.",
    actionLabel: "Verify another ticket",
    retryable: false,
  },
  "already-used": {
    title: "Already used",
    description:
      "This ticket has already been checked in. Please direct the attendee to a supervisor for assistance.",
    actionLabel: "Verify another ticket",
    retryable: false,
  },
  "service-failure": {
    title: "Service unavailable",
    description:
      "The verification service is temporarily unavailable. Please wait a moment and retry.",
    actionLabel: "Retry verification",
    retryable: true,
  },
  "network-error": {
    title: "Connection lost",
    description:
      "We couldn\u2019t reach the verification service. Check your internet connection and try again.",
    actionLabel: "Retry verification",
    retryable: true,
  },
};

export const FALLBACK_VERIFICATION_ERROR_MESSAGE: VerificationErrorMessage = {
  title: "Verification failed",
  description:
    "Something went wrong while verifying this ticket. Please try again or contact support if the issue persists.",
  actionLabel: "Try again",
  retryable: true,
};

/**
 * Maps a verification error code to a user-friendly message bundle.
 * Unknown / missing codes fall back to a generic message instead of throwing.
 */
export function getVerificationErrorMessage(
  type: VerificationErrorType | string | null | undefined,
): VerificationErrorMessage {
  if (!type) return FALLBACK_VERIFICATION_ERROR_MESSAGE;
  return (
    VERIFICATION_ERROR_MESSAGES[type as VerificationErrorType] ??
    FALLBACK_VERIFICATION_ERROR_MESSAGE
  );
}

export function classifyVerificationError(
  httpStatus: number | null,
  serverCode?: string,
): VerificationError {
  let type: VerificationErrorType;
  if (httpStatus === null) {
    type = "network-error";
  } else if (httpStatus >= 500) {
    type = "service-failure";
  } else if (serverCode === "ALREADY_USED") {
    type = "already-used";
  } else {
    type = "invalid-ticket";
  }
  const { description, retryable } = getVerificationErrorMessage(type);
  return { type, message: description, retryable };
}