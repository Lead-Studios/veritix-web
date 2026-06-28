import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OrderReceiptPage } from "@/components/orders/OrderReceiptPage";

const mockOrder = {
  id: "ord-12345",
  eventName: "Test Concert",
  eventDate: "2026-07-15T18:00:00.000Z",
  venue: "Madison Square Garden",
  ticketType: "VIP",
  quantity: 2,
  unitPrice: 50,
  totalPrice: 100,
  status: "confirmed",
  purchasedAt: "2026-06-01T12:00:00.000Z",
  ticketCode: "TICKET-ABC-123",
  payerEmail: "buyer@example.com",
};

describe("OrderReceiptPage", () => {
  it("renders receipt title", () => {
    render(<OrderReceiptPage order={mockOrder} />);
    expect(screen.getByText("Receipt")).toBeInTheDocument();
  });

  it("shows order number", () => {
    render(<OrderReceiptPage order={mockOrder} />);
    expect(screen.getByText(/ORD-12345/)).toBeInTheDocument();
  });

  it("shows event details", () => {
    render(<OrderReceiptPage order={mockOrder} />);
    expect(screen.getByText("Test Concert")).toBeInTheDocument();
    expect(screen.getByText("Madison Square Garden")).toBeInTheDocument();
  });
});
