/**
 * Tests for issues #626, #627, #628, #629
 * - #626: PerformanceChart drill-down side panel
 * - #627: ProjectedRevenueCard widget
 * - #628: GeoHeatmap accessible table fallback
 * - #629: CommandPalette keyboard navigation
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// Static imports — required by esbuild (no top-level await)
import { PerformanceChart } from "@/components/dashboard/charts/PerformanceChart";
import { ProjectedRevenueCard } from "@/components/dashboard/ProjectedRevenueCard";
import GeoHeatmap from "@/components/dashboard/GeoHeatmap";
import { CommandPalette } from "@/components/dashboard/CommandPalette";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("react-simple-maps", () => ({
  ComposableMap: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="composable-map">{children}</div>
  ),
  Geographies: ({
    children,
  }: {
    children: (args: { geographies: unknown[] }) => React.ReactNode;
  }) => <>{children({ geographies: [] })}</>,
  Geography: () => null,
}));

// ─── #626 PerformanceChart drill-down ─────────────────────────────────────────

describe("#626 PerformanceChart drill-down", () => {
  const data = [
    {
      month: "Jan 14",
      value: 3200,
      events: [
        { eventId: "e1", eventName: "Summer Fest", sales: 2000 },
        { eventId: "e2", eventName: "Jazz Night", sales: 1200 },
      ],
    },
    { month: "Jan 15", value: 4800 },
  ];

  it("renders bars for each data point", () => {
    render(<PerformanceChart data={data} />);
    expect(screen.getByLabelText(/Jan 14/)).toBeTruthy();
    expect(screen.getByLabelText(/Jan 15/)).toBeTruthy();
  });

  it("opens drill-down panel when a bar is clicked", async () => {
    render(<PerformanceChart data={data} />);
    const bar = screen.getByLabelText(/Jan 14.*sales/);
    await userEvent.click(bar);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("Summer Fest")).toBeTruthy();
    expect(screen.getByText("Jazz Night")).toBeTruthy();
  });

  it("closes drill-down panel when Escape is pressed", async () => {
    render(<PerformanceChart data={data} />);
    await userEvent.click(screen.getByLabelText(/Jan 14.*sales/));
    expect(screen.getByRole("dialog")).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes panel when Back button is clicked", async () => {
    render(<PerformanceChart data={data} />);
    await userEvent.click(screen.getByLabelText(/Jan 14.*sales/));
    await userEvent.click(screen.getByLabelText(/Back to aggregate chart/));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows 'No per-event data' when events array is absent", async () => {
    render(<PerformanceChart data={data} />);
    await userEvent.click(screen.getByLabelText(/Jan 15.*sales/));
    expect(screen.getByText(/No per-event data/)).toBeTruthy();
  });

  it("bar is keyboard accessible via Enter", async () => {
    render(<PerformanceChart data={data} />);
    const bar = screen.getByLabelText(/Jan 14.*sales/);
    bar.focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("dialog")).toBeTruthy();
  });
});

// ─── #627 ProjectedRevenueCard ────────────────────────────────────────────────

describe("#627 ProjectedRevenueCard", () => {
  const sufficientInput = {
    remainingTickets: 500,
    averageTicketPrice: 5000,
    sellThroughRate: 0.7,
    totalTickets: 1000,
  };

  it("renders projected range when sufficient data exists", () => {
    render(<ProjectedRevenueCard input={sufficientInput} />);
    expect(screen.getByLabelText(/projected revenue/i)).toBeTruthy();
    expect(screen.getByText(/confidence/i)).toBeTruthy();
  });

  it("returns null (hidden) when remaining tickets is 0", () => {
    const { container } = render(
      <ProjectedRevenueCard input={{ ...sufficientInput, remainingTickets: 0 }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when sell-through rate is 0", () => {
    const { container } = render(
      <ProjectedRevenueCard input={{ ...sufficientInput, sellThroughRate: 0 }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when fewer than 10% tickets sold (insufficient trend data)", () => {
    // totalTickets=1000, remainingTickets=950 → only 5% sold
    const { container } = render(
      <ProjectedRevenueCard
        input={{ ...sufficientInput, remainingTickets: 950, totalTickets: 1000 }}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows High confidence when sell-through rate ≥ 0.6", () => {
    render(
      <ProjectedRevenueCard input={{ ...sufficientInput, sellThroughRate: 0.75 }} />
    );
    expect(screen.getByText(/high confidence/i)).toBeTruthy();
  });

  it("shows Medium confidence for sell-through between 0.3 and 0.6", () => {
    render(
      <ProjectedRevenueCard input={{ ...sufficientInput, sellThroughRate: 0.45 }} />
    );
    expect(screen.getByText(/medium confidence/i)).toBeTruthy();
  });

  it("shows Low confidence for sell-through below 0.3", () => {
    // Need at least 10% sold → remainingTickets=800 means 20% sold
    render(
      <ProjectedRevenueCard
        input={{
          remainingTickets: 800,
          averageTicketPrice: 5000,
          sellThroughRate: 0.2,
          totalTickets: 1000,
        }}
      />
    );
    expect(screen.getByText(/low confidence/i)).toBeTruthy();
  });

  it("renders sell-through progress bar with correct aria-valuenow", () => {
    render(<ProjectedRevenueCard input={sufficientInput} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("70");
  });
});

// ─── #628 GeoHeatmap accessible table fallback ────────────────────────────────

describe("#628 GeoHeatmap accessible table fallback", () => {
  const regions = [
    { label: "Nigeria", count: 500, percentage: 50 },
    { label: "Ghana", count: 300, percentage: 30 },
    { label: "Kenya", count: 200, percentage: 20 },
  ];

  it("renders the map by default", () => {
    render(<GeoHeatmap regions={regions} />);
    expect(screen.getByTestId("composable-map")).toBeTruthy();
  });

  it("switches to table view when Table button is clicked", async () => {
    render(<GeoHeatmap regions={regions} />);
    await userEvent.click(screen.getByRole("button", { name: /table/i }));
    expect(
      screen.getByRole("table", { name: /geographic distribution/i })
    ).toBeTruthy();
    expect(screen.getByText("Nigeria")).toBeTruthy();
    expect(screen.getByText("500")).toBeTruthy();
  });

  it("table shows all regions with count and percentage", async () => {
    render(<GeoHeatmap regions={regions} />);
    await userEvent.click(screen.getByRole("button", { name: /table/i }));
    expect(screen.getByText("Ghana")).toBeTruthy();
    expect(screen.getByText("30%")).toBeTruthy();
  });

  it("switches back to map view from table", async () => {
    render(<GeoHeatmap regions={regions} />);
    await userEvent.click(screen.getByRole("button", { name: /table/i }));
    await userEvent.click(screen.getByRole("button", { name: /^map$/i }));
    expect(screen.getByTestId("composable-map")).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("Map button has aria-pressed=true when in map mode", () => {
    render(<GeoHeatmap regions={regions} />);
    const mapBtn = screen.getByRole("button", { name: /^map$/i });
    expect(mapBtn.getAttribute("aria-pressed")).toBe("true");
  });

  it("Table button has aria-pressed=true when in table mode", async () => {
    render(<GeoHeatmap regions={regions} />);
    await userEvent.click(screen.getByRole("button", { name: /table/i }));
    const tableBtn = screen.getByRole("button", { name: /table/i });
    expect(tableBtn.getAttribute("aria-pressed")).toBe("true");
  });
});

// ─── #629 CommandPalette keyboard navigation ──────────────────────────────────

describe("#629 CommandPalette", () => {
  function openPalette() {
    fireEvent.keyDown(document, { key: "/", metaKey: true });
  }

  it("is hidden by default", () => {
    render(<CommandPalette />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens on Cmd+/", () => {
    render(<CommandPalette />);
    openPalette();
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("opens on Ctrl+/", () => {
    render(<CommandPalette />);
    fireEvent.keyDown(document, { key: "/", ctrlKey: true });
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("closes on Escape", async () => {
    render(<CommandPalette />);
    openPalette();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes via Cmd+/ toggle", () => {
    render(<CommandPalette />);
    openPalette();
    openPalette();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows all items when query is empty", () => {
    render(<CommandPalette />);
    openPalette();
    expect(screen.getByText("Create Event")).toBeTruthy();
    expect(screen.getByText("Dashboard")).toBeTruthy();
  });

  it("fuzzy-filters results as user types", async () => {
    render(<CommandPalette />);
    openPalette();
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "dash");
    expect(screen.getByText("Dashboard")).toBeTruthy();
    expect(screen.queryByText("Create Event")).toBeNull();
  });

  it("shows no-results message for unknown query", async () => {
    render(<CommandPalette />);
    openPalette();
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "zzzznotfound");
    expect(screen.getByText(/No results for/)).toBeTruthy();
  });

  it("navigates with ArrowDown", async () => {
    render(<CommandPalette />);
    openPalette();
    const options = screen.getAllByRole("option");
    // First item starts selected
    expect(options[0].getAttribute("aria-selected")).toBe("true");
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "{ArrowDown}");
    const updatedOptions = screen.getAllByRole("option");
    expect(updatedOptions[1].getAttribute("aria-selected")).toBe("true");
  });

  it("input has ARIA combobox role", () => {
    render(<CommandPalette />);
    openPalette();
    expect(screen.getByRole("combobox")).toBeTruthy();
  });

  it("input has aria-controls pointing to listbox", () => {
    render(<CommandPalette />);
    openPalette();
    const input = screen.getByRole("combobox");
    const listboxId = input.getAttribute("aria-controls");
    expect(listboxId).toBeTruthy();
    expect(document.getElementById(listboxId!)).toBeTruthy();
  });

  it("includes provided eventNames in search results", async () => {
    render(<CommandPalette eventNames={["Lagos Music Fest 2026"]} />);
    openPalette();
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Lagos");
    expect(screen.getByText("Lagos Music Fest 2026")).toBeTruthy();
  });
});
