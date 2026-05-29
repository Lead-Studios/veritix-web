/**
 * Unit tests for useAuthState and useSession hooks (issue #282 / FE-161).
 */
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── shared mocks ────────────────────────────────────────────────────────────
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => ({ get: vi.fn().mockReturnValue(null) }),
}));

vi.mock("react-toastify", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockGetToken = vi.fn<() => string | null>();
const mockLogout = vi.fn();

vi.mock("@/lib/auth", () => ({
  getToken: () => mockGetToken(),
  logout: () => mockLogout(),
}));

// ── helpers ─────────────────────────────────────────────────────────────────
function makeJwt(exp: number): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: "user1", exp }));
  return `${header}.${payload}.sig`;
}

const FUTURE_EXP = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
const PAST_EXP = Math.floor(Date.now() / 1000) - 3600;   // 1 hour ago

// ── useSession ───────────────────────────────────────────────────────────────
import { useSession, isTokenExpired, getTokenExpiry } from "../hooks/useSession";
import { toast } from "react-toastify";

describe("isTokenExpired", () => {
  it("returns true for a token with a past exp", () => {
    expect(isTokenExpired(makeJwt(PAST_EXP))).toBe(true);
  });

  it("returns false for a token with a future exp", () => {
    expect(isTokenExpired(makeJwt(FUTURE_EXP))).toBe(false);
  });

  it("returns true for a malformed token", () => {
    expect(isTokenExpired("not.a.jwt")).toBe(true);
  });
});

describe("getTokenExpiry", () => {
  it("returns the expiry timestamp in ms", () => {
    expect(getTokenExpiry(makeJwt(FUTURE_EXP))).toBe(FUTURE_EXP * 1000);
  });

  it("returns null for a malformed token", () => {
    expect(getTokenExpiry("bad")).toBeNull();
  });
});

describe("useSession", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReplace.mockClear();
    mockLogout.mockClear();
    (toast.error as ReturnType<typeof vi.fn>).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("redirects to /login when no token is present", () => {
    mockGetToken.mockReturnValue(null);
    renderHook(() => useSession());
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("redirects to /login?expired=1 and shows toast when token is expired", () => {
    mockGetToken.mockReturnValue(makeJwt(PAST_EXP));
    renderHook(() => useSession());
    expect(mockLogout).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      expect.stringMatching(/session has expired/i),
    );
    expect(mockReplace).toHaveBeenCalledWith("/login?expired=1");
  });

  it("does not redirect when token is valid", () => {
    mockGetToken.mockReturnValue(makeJwt(FUTURE_EXP));
    renderHook(() => useSession());
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("polls every 60 s and redirects when token expires mid-session", () => {
    mockGetToken.mockReturnValue(makeJwt(FUTURE_EXP));
    renderHook(() => useSession());
    expect(mockReplace).not.toHaveBeenCalled();

    // Simulate token expiring on next poll
    mockGetToken.mockReturnValue(makeJwt(PAST_EXP));
    act(() => { vi.advanceTimersByTime(60_000); });

    expect(mockReplace).toHaveBeenCalledWith("/login?expired=1");
  });

  it("handles unexpected errors gracefully (redirects to /login)", () => {
    mockGetToken.mockImplementation(() => { throw new Error("storage error"); });
    renderHook(() => useSession());
    expect(mockLogout).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });
});

// ── useAuthState ─────────────────────────────────────────────────────────────
import { useAuthState } from "../hooks/useAuthState";

describe("useAuthState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReplace.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with isLoading=true and isAuthenticated=false", () => {
    mockGetToken.mockReturnValue(makeJwt(FUTURE_EXP));
    const { result } = renderHook(() => useAuthState());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("sets isLoading=false and isAuthenticated=true after timer resolves", async () => {
    mockGetToken.mockReturnValue(makeJwt(FUTURE_EXP));
    const { result } = renderHook(() => useAuthState());

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("redirects to /login when no token (via useSession)", () => {
    mockGetToken.mockReturnValue(null);
    renderHook(() => useAuthState());
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });
});
