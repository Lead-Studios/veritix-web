import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useOrganizerAnalytics, type OrganizerAnalytics } from "@/hooks/useOrganizerAnalytics";

const mockData: OrganizerAnalytics = {
  revenue: [{ day: "Mon", revenue: 5000 }],
  performance: [{ day: "Mon", value: 3000 }],
  totalEarned: 100000,
  payoutsQueued: 20000,
  nextSettlementDays: 3,
  checkInsLive: true,
  doorsOpenInMinutes: 30,
  ticketBreakdown: [{ type: "VIP", count: 10, revenue: 50000 }],
  demographics: {
    region: [{ label: "Lagos", count: 8, percentage: 80 }],
    deviceType: [{ label: "Mobile", count: 9, percentage: 90 }],
    referralSource: [{ label: "Instagram", count: 5, percentage: 50 }],
  },
};

describe("useOrganizerAnalytics", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts in loading state", () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useOrganizerAnalytics());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("returns data on successful fetch", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const { result } = renderHook(() => useOrganizerAnalytics());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("sets error when API returns non-ok response", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useOrganizerAnalytics());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Failed to fetch analytics");
  });

  it("sets error when fetch throws a network error", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useOrganizerAnalytics());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Network error");
  });
});
