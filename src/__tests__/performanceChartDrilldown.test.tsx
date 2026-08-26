import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PerformanceChart } from "@/components/dashboard/charts/PerformanceChart";
import type { PerformanceDataPoint } from "@/components/dashboard/charts/PerformanceChart";

const sampleData: PerformanceDataPoint[] = [
  {
    month: "Jan 14",
    value: 120,
    events: [
      { eventId: "e1", eventName: "Tech Conference", sales: 80 },
      { eventId: "e2", eventName: "Music Night", sales: 40 },
    ],
  },
  {
    month: "Jan 15",
    value: 200,
    events: [
      { eventId: "e3", eventName: "Startup Meetup", sales: 200 },
    ],
  },
  {
    month: "Jan 16",
    value: 0,
  },
];

describe("PerformanceChart drill-down (#792)", () => {
  it("renders bars for each data point", () => {
    render(<PerformanceChart data={sampleData} />);
    expect(screen.getByText("Jan 14")).toBeInTheDocument();
    expect(screen.getByText("Jan 15")).toBeInTheDocument();
    expect(screen.getByText("Jan 16")).toBeInTheDocument();
  });

  it("opens drill-down panel when bar is clicked", () => {
    render(<PerformanceChart data={sampleData} />);

    const barButton = screen.getByRole("button", {
      name: /Jan 14.*120.*Press to view breakdown/,
    });
    fireEvent.click(barButton);

    // Panel should appear
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Jan 14")).toBeInTheDocument();
    expect(screen.getByText("Total Sales")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  it("lists events in drill-down panel", () => {
    render(<PerformanceChart data={sampleData} />);

    const barButton = screen.getByRole("button", {
      name: /Jan 14/,
    });
    fireEvent.click(barButton);

    expect(screen.getByText("Tech Conference")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
    expect(screen.getByText("Music Night")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  it("closes drill-down panel on Escape", () => {
    render(<PerformanceChart data={sampleData} />);

    // Open
    const barButton = screen.getByRole("button", {
      name: /Jan 14/,
    });
    fireEvent.click(barButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes drill-down panel when clicking Back", () => {
    render(<PerformanceChart data={sampleData} />);

    // Open
    const barButton = screen.getByRole("button", {
      name: /Jan 14/,
    });
    fireEvent.click(barButton);

    // Click back
    const backButton = screen.getByRole("button", { name: /Back to aggregate chart/i });
    fireEvent.click(backButton);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows empty state when no per-event data", () => {
    render(<PerformanceChart data={sampleData} />);

    const barButton = screen.getByRole("button", {
      name: /Jan 16/,
    });
    fireEvent.click(barButton);

    expect(screen.getByText("No per-event data available.")).toBeInTheDocument();
  });

  it("is keyboard accessible", () => {
    render(<PerformanceChart data={sampleData} />);

    const barButton = screen.getByRole("button", {
      name: /Jan 14/,
    });

    // Can be focused
    barButton.focus();
    expect(document.activeElement).toBe(barButton);

    // Enter opens panel
    fireEvent.keyDown(barButton, { key: "Enter" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
