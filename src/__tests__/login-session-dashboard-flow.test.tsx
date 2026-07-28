import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { getToken, loginUser, logout } from "@/lib/auth";
import ProtectedLayout from "@/app/(protected)/layout";
import DashboardPage from "@/app/(protected)/dashboard/page";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    warn: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@/lib/auth", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth")>("@/lib/auth");
  return {
    ...actual,
    loginUser: vi.fn(),
    getToken: vi.fn(),
    logout: vi.fn(),
  };
});

vi.mock("@/hooks/useAuthState", async () => {
  const actual = await vi.importActual<typeof import("@/hooks/useSession")>("@/hooks/useSession");
  return {
    useAuthState: () => {
      actual.useSession();
      return { isLoading: false, isAuthenticated: true };
    },
  };
});

vi.mock("@/hooks/useOrganizerAnalytics", () => ({
  useOrganizerAnalytics: () => ({
    data: {
      totalEvents: 1,
      totalTicketsSold: 100,
      totalRevenue: 1000,
      totalEarned: 1000,
      payoutsQueued: 0,
      nextSettlementDays: 2,
      checkInsLive: false,
      revenue: [],
      performance: [],
      ticketBreakdown: [],
      demographics: {
        region: [],
        deviceType: [],
        referralSource: [],
      },
      events: [],
    },
    loading: false,
    error: null,
  }),
}));

describe("login to dashboard session flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn(), replace: vi.fn() } as never);
    vi.mocked(useSearchParams).mockReturnValue({ get: vi.fn().mockReturnValue(null) } as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("stores the token on login and renders the dashboard after session validation", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push, replace: vi.fn() } as never);
    vi.mocked(getToken).mockReturnValue("valid-token");
    vi.mocked(loginUser).mockResolvedValue({
      token: "valid-token",
      user: { id: "u-1", email: "user@example.com" },
    });

    await loginUser({ email: "user@example.com", password: "password123" });
    expect(getToken()).toBe("valid-token");

    render(
      <ProtectedLayout>
        <DashboardPage />
      </ProtectedLayout>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Create, Manage and Control your events efficiently/i)).toBeInTheDocument();
    });
  });

  it("shows the expired-session toast and redirects when the token is expired", async () => {
    const replace = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn(), replace } as never);
    vi.mocked(getToken).mockReturnValue("expired-token");

    render(<ProtectedLayout><DashboardPage /></ProtectedLayout>);

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith(
        "Your session has expired. Please sign in again.",
        expect.objectContaining({ toastId: "session-expired" }),
      );
    });
    expect(replace).toHaveBeenCalledWith("/login?expired=1");
    expect(logout).toHaveBeenCalled();
  });
});
