/**
 * Auth context and session hook tests (FE-230 related).
 * Covers token storage, JWT decode helpers, and bootstrap behaviour.
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AuthContext, AuthProvider } from "@/context/authContext";
import { isTokenExpired, getTokenExpiry, useSession } from "@/hooks/useSession";
import { getToken, logout } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  getToken: vi.fn(),
  logout: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

vi.mock("react-toastify", () => ({
  toast: { warn: vi.fn(), info: vi.fn(), success: vi.fn() },
}));

// ── JWT helpers ──────────────────────────────────────────────────────────────

function makeToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.sig`;
}

describe("isTokenExpired", () => {
  it("returns true for an invalid token", () => {
    expect(isTokenExpired("not-a-jwt")).toBe(true);
  });

  it("returns true for an expired token", () => {
    const exp = Math.floor(Date.now() / 1000) - 3600;
    const token = makeToken({ exp });
    expect(isTokenExpired(token)).toBe(true);
  });

  it("returns false for a valid non-expired token", () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const token = makeToken({ exp });
    expect(isTokenExpired(token)).toBe(false);
  });
});

describe("getTokenExpiry", () => {
  it("returns null for an invalid token", () => {
    expect(getTokenExpiry("bad")).toBeNull();
  });

  it("returns the expiry in ms for a valid token", () => {
    const expSec = Math.floor(Date.now() / 1000) + 7200;
    const token = makeToken({ exp: expSec });
    const expiry = getTokenExpiry(token);
    expect(expiry).toBe(expSec * 1000);
  });

  it("returns null when exp claim is missing", () => {
    const token = makeToken({ sub: "user1" });
    expect(getTokenExpiry(token)).toBeNull();
  });
});

// ── AuthProvider bootstrap ───────────────────────────────────────────────────

function TestConsumer() {
  const ctx = React.useContext(AuthContext);
  return (
    <div>
      <span data-testid="loading">{String(ctx?.loading)}</span>
      <span data-testid="user">{ctx?.user?.id ?? "null"}</span>
    </div>
  );
}

describe("AuthProvider bootstrap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets user state when /api/auth/me returns ok", async () => {
    (getToken as ReturnType<typeof vi.fn>).mockReturnValue("valid-token");
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "u1", email: "test@example.com" }),
    });
    global.fetch = mockFetch;

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("u1");
  });

  it("clears user when /api/auth/me returns 401", async () => {
    (getToken as ReturnType<typeof vi.fn>).mockReturnValue("expired-token");
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 401 });
    global.fetch = mockFetch;

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("null");
  });

  it("sets loading false when no token is present", async () => {
    (getToken as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("null");
  });
});

// ── useSession ───────────────────────────────────────────────────────────────

function SessionTestComponent() {
  useSession();
  return <div>session checked</div>;
}

describe("useSession", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redirects to /login when no token is present", () => {
    (getToken as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const replace = vi.fn();
    vi.mock("next/navigation", () => ({
      useRouter: () => ({ replace }),
    }));

    render(<SessionTestComponent />);
    expect(replace).toHaveBeenCalledWith("/login");
  });

  it("calls logout and redirects when token is expired", () => {
    const exp = Math.floor(Date.now() / 1000) - 100;
    (getToken as ReturnType<typeof vi.fn>).mockReturnValue(makeToken({ exp }));
    const replace = vi.fn();
    vi.mock("next/navigation", () => ({
      useRouter: () => ({ replace }),
    }));

    render(<SessionTestComponent />);
    expect(logout).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/login?expired=1");
  });
});
