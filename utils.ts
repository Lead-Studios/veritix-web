import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A list of known safe error messages that can be shown to the user.
 * This helps prevent sensitive backend details from leaking to the frontend.
 *
 * @private
 */
const SAFE_ERROR_MESSAGES = new Set([
  "Invalid credentials",
  "User not found",
  "Email already in use",
  "Username already in use",
  "Event not found",
  "Failed to join waitlist",
  "Failed to leave waitlist",
  "Internal server error",
  "Invalid request",
  "Unauthorized",
]);

/**
 * Sanitises a raw error message from the backend to make it safe for UI display.
 *
 * - If the message is in the SAFE_ERROR_MESSAGES list, it's returned as is.
 * - It strips out emails, internal file paths, and stack traces.
 * - If the message is unknown or contains sensitive patterns, a generic
 *   "Something went wrong" message is returned.
 *
 * @param rawMessage The raw error message string from the backend.
 * @returns A sanitised, user-friendly error message.
 */
export function sanitiseErrorMessage(rawMessage: string): string {
  // Best-case scenario: the message is already known to be safe.
  if (SAFE_ERROR_MESSAGES.has(rawMessage)) {
    return rawMessage;
  }

  // Regex to detect potentially sensitive information.
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  const pathRegex = /(\/[a-zA-Z0-9_-]+)+/g; // Simplified path detection
  const stackTraceRegex = /at\s+.*/g; // Basic stack trace line detection

  if (
    emailRegex.test(rawMessage) ||
    pathRegex.test(rawMessage) ||
    stackTraceRegex.test(rawMessage)
  ) {
    return "Something went wrong. Please try again.";
  }

  // Fallback for unknown errors that don't match sensitive patterns.
  // Here, you might still want to be cautious.
  // For this example, we'll return a generic message.
  return "Something went wrong. Please try again.";
}
