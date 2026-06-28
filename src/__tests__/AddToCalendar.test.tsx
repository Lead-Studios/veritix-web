import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AddToCalendar } from "@/components/tickets/AddToCalendar";

const baseEvent = {
  eventName: "Test Event",
  startDate: "2026-07-15T18:00:00.000Z",
  endDate: "2026-07-15T22:00:00.000Z",
  location: "123 Main St",
  description: "A test event",
};

describe("AddToCalendar", () => {
  it("renders Google Calendar button", () => {
    render(<AddToCalendar {...baseEvent} />);
    expect(screen.getByText("Google Calendar")).toBeInTheDocument();
  });

  it("renders .ics download button", () => {
    render(<AddToCalendar {...baseEvent} />);
    expect(screen.getByText("Download .ics")).toBeInTheDocument();
  });

  it("has correct Google Calendar href", () => {
    render(<AddToCalendar {...baseEvent} />);
    const link = screen.getByText("Google Calendar");
    expect(link).toHaveAttribute("href");
    expect(link.getAttribute("href")).toContain("calendar.google.com");
  });
});
