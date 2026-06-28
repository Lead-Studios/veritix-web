import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ResaleListing } from "@/components/tickets/ResaleListing";

const baseProps = {
  ticketId: "ticket-1",
  originalPrice: 50,
  ticketType: "VIP",
  eventName: "Concert",
};

describe("ResaleListing", () => {
  it("renders resale form initially", () => {
    render(<ResaleListing {...baseProps} />);
    expect(screen.getByText("Resell Your Ticket")).toBeInTheDocument();
  });

  it("shows event and ticket type info", () => {
    render(<ResaleListing {...baseProps} />);
    expect(screen.getByText(/Concert/)).toBeInTheDocument();
    expect(screen.getByText(/VIP/)).toBeInTheDocument();
  });
});
