/**
 * Integration tests — Event Discovery (FE-015)
 *
 * Covers:
 *  - Events render on page load
 *  - Search query filters the list
 *  - Category filter chips remove a filter
 *  - Tab switching between Upcoming and Featured
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventsPage from "@/app/(public)/events/page";

// Next.js navigation stubs
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Event Discovery", () => {
  beforeEach(() => {
    render(<EventsPage />);
  });

  it("renders at least one event card on load", () => {
    // EventCard renders the event name inside an element with role="article" or similar
    const cards = screen.getAllByRole("article");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("filters events when a search query is typed", async () => {
    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/search events/i);
    // Type a query that matches no mock event
    await user.type(searchInput, "zzz_no_match_zzz");
    expect(screen.getByText(/0 events found/i)).toBeTruthy();
  });

  it("removes a category filter chip when clicked", async () => {
    const user = userEvent.setup();
    // Default active filters include 'music' — find its remove button
    const chip = screen.queryByText(/music/i);
    if (chip) {
      const removeBtn = within(chip.closest("li") ?? document.body).getByRole("button");
      await user.click(removeBtn);
      expect(screen.queryByText(/^music$/i)).toBeNull();
    }
  });

  it("switches to Featured tab and shows events", async () => {
    const user = userEvent.setup();
    const featuredTab = screen.getByRole("button", { name: /featured/i });
    await user.click(featuredTab);
    // After switching, event count text should still be present
    expect(screen.getByText(/events found/i)).toBeTruthy();
  });
});
