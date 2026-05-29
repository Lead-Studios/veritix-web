import { describe, it, expect } from "vitest";

import {
  FALLBACK_VERIFICATION_ERROR_MESSAGE,
  classifyVerificationError,
  getVerificationErrorMessage,
  type VerificationErrorType,
} from "@/lib/verificationErrors";

const KNOWN_TYPES: VerificationErrorType[] = [
  "invalid-ticket",
  "already-used",
  "service-failure",
  "network-error",
];

describe("getVerificationErrorMessage", () => {
  it("returns a non-empty title, description, and actionLabel for every known code", () => {
    for (const type of KNOWN_TYPES) {
      const msg = getVerificationErrorMessage(type);
      expect(msg.title).toBeTruthy();
      expect(msg.description).toBeTruthy();
      expect(msg.actionLabel).toBeTruthy();
      expect(typeof msg.retryable).toBe("boolean");
    }
  });

  it("maps invalid-ticket to a 'not found' style message that is not retryable", () => {
    const msg = getVerificationErrorMessage("invalid-ticket");
    expect(msg.title).toMatch(/invalid/i);
    expect(msg.description).toMatch(/couldn'?t find|matching this code/i);
    expect(msg.retryable).toBe(false);
  });

  it("maps already-used to a supervisor-prompt message that is not retryable", () => {
    const msg = getVerificationErrorMessage("already-used");
    expect(msg.title).toMatch(/already used/i);
    expect(msg.description).toMatch(/already been checked in|supervisor/i);
    expect(msg.retryable).toBe(false);
  });

  it("maps service-failure to a retryable 'service unavailable' message", () => {
    const msg = getVerificationErrorMessage("service-failure");
    expect(msg.title).toMatch(/service|unavailable/i);
    expect(msg.description).toMatch(/temporarily|retry/i);
    expect(msg.retryable).toBe(true);
    expect(msg.actionLabel).toMatch(/retry/i);
  });

  it("maps network-error to a retryable 'check your connection' message", () => {
    const msg = getVerificationErrorMessage("network-error");
    expect(msg.title).toMatch(/connection|network/i);
    expect(msg.description).toMatch(/connection|reach the verification/i);
    expect(msg.retryable).toBe(true);
    expect(msg.actionLabel).toMatch(/retry/i);
  });

  it("falls back to a generic message for unknown error codes without throwing", () => {
    expect(() => getVerificationErrorMessage("definitely-not-a-real-code")).not.toThrow();
    const msg = getVerificationErrorMessage("definitely-not-a-real-code");
    expect(msg).toEqual(FALLBACK_VERIFICATION_ERROR_MESSAGE);
  });

  it("falls back to a generic message when the code is null or undefined", () => {
    expect(getVerificationErrorMessage(null)).toEqual(FALLBACK_VERIFICATION_ERROR_MESSAGE);
    expect(getVerificationErrorMessage(undefined)).toEqual(FALLBACK_VERIFICATION_ERROR_MESSAGE);
    expect(getVerificationErrorMessage("")).toEqual(FALLBACK_VERIFICATION_ERROR_MESSAGE);
  });
});

describe("classifyVerificationError", () => {
  it("returns network-error when httpStatus is null", () => {
    const result = classifyVerificationError(null);
    expect(result.type).toBe("network-error");
    expect(result.retryable).toBe(true);
    expect(result.message).toBe(
      getVerificationErrorMessage("network-error").description,
    );
  });

  it("returns service-failure for 5xx responses", () => {
    const result = classifyVerificationError(503);
    expect(result.type).toBe("service-failure");
    expect(result.retryable).toBe(true);
  });

  it("returns already-used when serverCode is ALREADY_USED", () => {
    const result = classifyVerificationError(409, "ALREADY_USED");
    expect(result.type).toBe("already-used");
    expect(result.retryable).toBe(false);
  });

  it("returns invalid-ticket as the default 4xx fallback", () => {
    const result = classifyVerificationError(404);
    expect(result.type).toBe("invalid-ticket");
    expect(result.retryable).toBe(false);
  });
});
