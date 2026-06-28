import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VisualSeatMap } from "@/components/tickets/VisualSeatMap";
import type { Seat } from "@/components/tickets/SeatSelector";

const mockSeats: Seat[] = [
  { id: "a1", row: "A", number: 1, status: "available" },
  { id: "a2", row: "A", number: 2, status: "taken" },
  { id: "a3", row: "A", number: 3, status: "available" },
  { id: "b1", row: "B", number: 1, status: "available" },
];

describe("VisualSeatMap", () => {
  it("renders stage indicator", () => {
    render(<VisualSeatMap seats={mockSeats} venueName="Madison Square Garden" />);
    expect(screen.getByText("MADISON SQUARE GARDEN")).toBeInTheDocument();
    expect(screen.getByText("Stage")).toBeInTheDocument();
  });

  it("renders row labels", () => {
    render(<VisualSeatMap seats={mockSeats} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("renders seat buttons", () => {
    render(<VisualSeatMap seats={mockSeats} />);
    expect(screen.getByLabelText("Row A Seat 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Row A Seat 2 (taken)")).toBeInTheDocument();
    expect(screen.getByLabelText("Row A Seat 3")).toBeInTheDocument();
  });

  it("disables taken seats", () => {
    render(<VisualSeatMap seats={mockSeats} />);
    expect(screen.getByLabelText("Row A Seat 2 (taken)")).toBeDisabled();
  });
});
