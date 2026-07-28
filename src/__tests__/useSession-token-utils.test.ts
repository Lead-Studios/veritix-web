import { describe, it, expect, vi } from "vitest";
import { getTokenExpiry, isTokenExpired, msUntilExpiry } from "@/hooks/useSession";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock("react-toastify", () => ({
  toast: { warn: vi.fn(), info: vi.fn() },
}));

vi.mock("@/lib/auth", () => ({
  getToken: vi.fn(),
  logout: vi.fn(),
}));

function makeToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.sig`;
}

describe("useSession token helpers", () => {
  it("returns true for a valid token when the expiry is in the past", () => {
    const expired = makeToken({ exp: Math.floor(Date.now() / 1000) - 60 });
    expect(isTokenExpired(expired)).toBe(true);
  });

  it("returns false for a token that is still valid", () => {
    const active = makeToken({ exp: Math.floor(Date.now() / 1000) + 600 });
    expect(isTokenExpired(active)).toBe(false);
  });

  it("returns true for malformed or missing tokens", () => {
    expect(isTokenExpired("not-a-jwt")).toBe(true);
    expect(isTokenExpired("")).toBe(true);
  });

  it("extracts the expiry in milliseconds for a valid JWT", () => {
    const expSec = Math.floor(Date.now() / 1000) + 600;
    const token = makeToken({ exp: expSec });

    expect(getTokenExpiry(token)).toBe(expSec * 1000);
  });

  it("returns null for invalid JWT payloads", () => {
    expect(getTokenExpiry("bad-token")).toBeNull();
    expect(getTokenExpiry(makeToken({ sub: "user-1" }))).toBeNull();
  });

  it("returns positive, zero, and negative remaining time values", () => {
    const future = Math.floor(Date.now() / 1000) + 60;
    const past = Math.floor(Date.now() / 1000) - 60;

    expect(msUntilExpiry(makeToken({ exp: future }))).toBeGreaterThan(0);
    expect(msUntilExpiry(makeToken({ exp: Math.floor(Date.now() / 1000) }))).toBeLessThanOrEqual(0);
    expect(msUntilExpiry(makeToken({ exp: past }))).toBeLessThan(0);
  });
});
