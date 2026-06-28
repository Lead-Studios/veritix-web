import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GroupPurchaseForm } from "@/components/tickets/GroupPurchaseForm";

describe("GroupPurchaseForm", () => {
  const baseProps = {
    ticketTypeId: "type-1",
    ticketTypeName: "General Admission",
    unitPrice: 25,
    maxQuantity: 10,
  };

  it("renders form with title", () => {
    render(<GroupPurchaseForm {...baseProps} />);
    expect(screen.getByText("Group Purchase")).toBeInTheDocument();
  });

  it("shows ticket type and price", () => {
    render(<GroupPurchaseForm {...baseProps} />);
    expect(screen.getByText(/General Admission/)).toBeInTheDocument();
    expect(screen.getByText(/25 XLM/)).toBeInTheDocument();
  });

  it("shows add attendee button", () => {
    render(<GroupPurchaseForm {...baseProps} />);
    expect(screen.getByText("+ Add another attendee")).toBeInTheDocument();
  });
});
