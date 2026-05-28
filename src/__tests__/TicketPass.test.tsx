import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TicketPass, type AttendeeTicket } from "@/components/tickets/TicketPass";

const baseTicket: AttendeeTicket = {
  id: "ticket-001",
  eventName: "Stellar Summit 2025",
  eventDate: "2025-09-15",
  eventTime: "18:00",
  venue: "Cape Town ICC",
  ticketType: "VIP",
  ticketCode: "VTX-001-ABC",
  walletStatus: "confirmed",
  transferState: "none",
};

describe("TicketPass", () => {
  it("renders event name and ticket type", () => {
    render(<TicketPass ticket={baseTicket} />);
    expect(screen.getByText("Stellar Summit 2025")).toBeInTheDocument();
    expect(screen.getByText("VIP")).toBeInTheDocument();
  });

  it("renders event date, time, and venue", () => {
    render(<TicketPass ticket={baseTicket} />);
    expect(screen.getByText("2025-09-15")).toBeInTheDocument();
    expect(screen.getByText("18:00")).toBeInTheDocument();
    expect(screen.getByText("Cape Town ICC")).toBeInTheDocument();
  });

  it("renders the ticket code", () => {
    render(<TicketPass ticket={baseTicket} />);
    expect(screen.getByText("VTX-001-ABC")).toBeInTheDocument();
  });

  it("renders QR code with correct aria-label", () => {
    render(<TicketPass ticket={baseTicket} />);
    expect(screen.getByRole("img", { name: /QR code for ticket VTX-001-ABC/i })).toBeInTheDocument();
  });

  it("shows 'On-chain confirmed' badge for confirmed wallet status", () => {
    render(<TicketPass ticket={baseTicket} />);
    expect(screen.getByText("On-chain confirmed")).toBeInTheDocument();
  });

  it("shows 'Pending confirmation' badge for pending wallet status", () => {
    render(<TicketPass ticket={{ ...baseTicket, walletStatus: "pending" }} />);
    expect(screen.getByText("Pending confirmation")).toBeInTheDocument();
  });

  it("shows 'Chain error' badge for failed wallet status", () => {
    render(<TicketPass ticket={{ ...baseTicket, walletStatus: "failed" }} />);
    expect(screen.getByText("Chain error")).toBeInTheDocument();
  });

  it("shows Transfer Ticket button when transferable and onTransfer provided", () => {
    const onTransfer = vi.fn();
    render(<TicketPass ticket={{ ...baseTicket, transferState: "transferable" }} onTransfer={onTransfer} />);
    const btn = screen.getByRole("button", { name: /transfer ticket/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onTransfer).toHaveBeenCalledOnce();
  });

  it("does not show Transfer Ticket button when transferState is none", () => {
    render(<TicketPass ticket={baseTicket} />);
    expect(screen.queryByRole("button", { name: /transfer ticket/i })).toBeNull();
  });

  it("shows transfer-pending message", () => {
    render(<TicketPass ticket={{ ...baseTicket, transferState: "transfer-pending" }} />);
    expect(screen.getByText(/transfer in progress/i)).toBeInTheDocument();
  });

  it("shows transferred message and reduces opacity", () => {
    render(<TicketPass ticket={{ ...baseTicket, transferState: "transferred" }} />);
    expect(screen.getByText(/transferred to another wallet/i)).toBeInTheDocument();
  });

  it("shows owner wallet address when provided", () => {
    render(<TicketPass ticket={{ ...baseTicket, ownerAddress: "GABC1234XYZ" }} />);
    expect(screen.getByText("GABC1234XYZ")).toBeInTheDocument();
  });

  it("renders Download QR button", () => {
    render(<TicketPass ticket={baseTicket} />);
    expect(screen.getByRole("button", { name: /download qr/i })).toBeInTheDocument();
  });
});
