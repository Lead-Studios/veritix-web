import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { InventoryStatusBadge } from "@/components/events/manage/InventoryStatusBadge";
import { TicketTypeRow } from "@/components/events/manage/TicketTypeRow";

describe("InventoryStatusBadge", () => {
  it("shows Available when sold count is well under capacity", () => {
    render(<InventoryStatusBadge sold={10} total={100} />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("Available");
    expect(badge).toHaveAttribute("data-status", "available");
  });

  it("shows Almost Gone when 90%+ are sold", () => {
    render(<InventoryStatusBadge sold={90} total={100} />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("Almost Gone");
    expect(badge).toHaveAttribute("data-status", "low-stock");
  });

  it("shows Sold Out when sold meets capacity", () => {
    render(<InventoryStatusBadge sold={100} total={100} />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("Sold Out");
    expect(badge).toHaveAttribute("data-status", "sold-out");
  });
});

describe("TicketTypeRow", () => {
  it("renders the ticket name, sold/total counts, and a status badge", () => {
    render(
      <TicketTypeRow
        ticket={{ id: "t1", name: "VIP Pass", sold: 20, total: 100 }}
      />,
    );
    expect(screen.getByText("VIP Pass")).toBeInTheDocument();
    expect(screen.getByText("20 / 100 sold")).toBeInTheDocument();
    expect(screen.getByText("80 remaining")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Available");
  });

  it("visually mutes the row and disables interactions when sold out", () => {
    render(
      <TicketTypeRow
        ticket={{ id: "t1", name: "Early Bird", sold: 50, total: 50 }}
      />,
    );
    const row = screen.getByTestId("ticket-type-row");
    expect(row).toHaveAttribute("data-status", "sold-out");
    expect(row.className).toMatch(/opacity-50/);
    expect(screen.getByText("No tickets remaining")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Sold Out");
  });

  it("does not mute the row when ticket type is only low stock", () => {
    render(
      <TicketTypeRow
        ticket={{ id: "t1", name: "GA", sold: 95, total: 100 }}
      />,
    );
    const row = screen.getByTestId("ticket-type-row");
    expect(row).toHaveAttribute("data-status", "low-stock");
    expect(row).not.toHaveAttribute("aria-disabled");
    expect(row.className).not.toMatch(/opacity-50/);
  });
});
