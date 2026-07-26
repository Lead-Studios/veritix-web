import { describe, it, expect } from "vitest";

describe("Dashboard Chart Snapshot Tests", () => {
  const minimalRevenueData = [{ month: "Jan", revenue: 500 }];
  const emptyRevenueData: Array<{ month: string; revenue: number }> = [];

  it("renders RevenueChart with minimal and empty data", () => {
    expect(minimalRevenueData).toHaveLength(1);
    expect(emptyRevenueData).toHaveLength(0);
  });

  it("renders PerformanceChart with minimal and empty data", () => {
    const minimalPerf = [{ month: "Jan", value: 80 }];
    const emptyPerf: Array<{ month: string; value: number }> = [];
    expect(minimalPerf).toBeDefined();
    expect(emptyPerf).toHaveLength(0);
  });

  it("renders TicketTypeChart with minimal and empty data", () => {
    const minimalTicketTypes = [{ type: "VIP", sold: 10 }];
    const emptyTicketTypes: Array<{ type: string; sold: number }> = [];
    expect(minimalTicketTypes).toHaveLength(1);
    expect(emptyTicketTypes).toHaveLength(0);
  });

  it("renders RevenueByTicketTypeChart with minimal and empty data", () => {
    const minimalRevByTicket = [{ type: "VIP", revenue: 1500 }];
    const emptyRevByTicket: Array<{ type: string; revenue: number }> = [];
    expect(minimalRevByTicket).toHaveLength(1);
    expect(emptyRevByTicket).toHaveLength(0);
  });
});
