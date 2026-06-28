import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TicketGiftModal } from "@/components/tickets/TicketGiftModal";

describe("TicketGiftModal", () => {
  const baseProps = {
    ticketId: "ticket-1",
    eventName: "Concert",
    onClose: () => {},
  };

  it("renders gift form", () => {
    render(<TicketGiftModal {...baseProps} />);
    expect(screen.getByText("Gift Ticket")).toBeInTheDocument();
    expect(screen.getByLabelText(/recipient email/i)).toBeInTheDocument();
  });

  it("shows event name", () => {
    render(<TicketGiftModal {...baseProps} />);
    expect(screen.getByText(/Concert/)).toBeInTheDocument();
  });

  it("renders cancel and send buttons", () => {
    render(<TicketGiftModal {...baseProps} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Send Gift")).toBeInTheDocument();
  });
});
