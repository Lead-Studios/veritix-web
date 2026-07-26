import { describe, it, expect } from "vitest";
import { canAccessVerificationTools, getVerificationAccessDeniedMessage } from "../lib/verificationAccess";

describe("verificationAccess role check permutations", () => {
  it("canAccessVerificationTools returns true for staff", () => {
    expect(canAccessVerificationTools("staff")).toBe(true);
  });

  it("canAccessVerificationTools returns true for organizer", () => {
    expect(canAccessVerificationTools("organizer")).toBe(true);
  });

  it("canAccessVerificationTools returns true for admin", () => {
    expect(canAccessVerificationTools("admin")).toBe(true);
  });

  it("canAccessVerificationTools returns false for attendee", () => {
    expect(canAccessVerificationTools("attendee")).toBe(false);
  });

  it("canAccessVerificationTools returns false for null", () => {
    expect(canAccessVerificationTools(null)).toBe(false);
  });

  it("getVerificationAccessDeniedMessage handles null role", () => {
    expect(getVerificationAccessDeniedMessage(null)).toBe("Please sign in to access verification tools.");
  });

  it("getVerificationAccessDeniedMessage handles non-null denied role", () => {
    expect(getVerificationAccessDeniedMessage("attendee")).toBe("Verification tools are restricted to authorized staff only.");
  });
});
