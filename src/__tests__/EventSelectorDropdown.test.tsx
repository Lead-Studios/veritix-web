import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EventSelectorDropdown } from "@/components/verification/EventSelectorDropdown";

const mockEvents = [
  { id: "evt-1", name: "Concert A", date: "2026-07-15" },
  { id: "evt-2", name: "Festival B", date: "2026-08-20" },
];

describe("EventSelectorDropdown", () => {
  it("shows placeholder when no event selected", () => {
    render(<EventSelectorDropdown events={mockEvents} selectedEventId={null} onSelect={() => {}} />);
    expect(screen.getByText("Select an event…")).toBeInTheDocument();
  });

  it("shows selected event name", () => {
    render(<EventSelectorDropdown events={mockEvents} selectedEventId="evt-1" onSelect={() => {}} />);
    expect(screen.getByText("Concert A")).toBeInTheDocument();
  });

  it("opens dropdown on click", () => {
    render(<EventSelectorDropdown events={mockEvents} selectedEventId={null} onSelect={() => {}} />);
    fireEvent.click(screen.getByText("Select an event…"));
    expect(screen.getByText("Festival B")).toBeInTheDocument();
  });
});
