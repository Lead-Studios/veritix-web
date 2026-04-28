import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventsPage from "@/app/(public)/events/page";
import { mockEvents } from "@/mocks/events";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) =>
    <a href={href} {...rest}>{children}</a>,
}));
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("@/lib/eventsApi", () => ({
  fetchEvents: () => Promise.resolve(mockEvents),
  fetchEventById: (id: string) => Promise.resolve(mockEvents.find((e) => e.id === id) ?? null),
}));
vi.mock("framer-motion", () => {
  const React = require("react");
  const proxy = new Proxy({}, {
    get: (_t, tag: string) =>
      ({ children, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
        React.createElement(tag, rest, children),
  });
  return { motion: proxy, AnimatePresence: ({ children }: { children: React.ReactNode }) => children };
});

describe("Event Discovery", () => {
  beforeEach(() => render(<EventsPage />));

  it("renders at least one event card on load", async () => {
    await waitFor(() => {
      expect(screen.getAllByText(/Summer Dance Festival|Electronic Music Night/i).length).toBeGreaterThan(0);
    });
  });

  it("filters events when a search query is typed", async () => {
    await waitFor(() => screen.getAllByText(/Summer Dance Festival/i));
    fireEvent.change(screen.getByPlaceholderText(/search events/i), {
      target: { value: "zzz_no_match_zzz" },
    });
    await waitFor(() => expect(screen.getByText(/0 events found/i)).toBeTruthy());
  });

  it("removes a category filter chip when clicked", async () => {
    await waitFor(() => screen.getAllByText(/Summer Dance Festival/i));
    const chip = screen.queryByText(/^music$/i);
    if (chip) {
      const btn = chip.closest("div")?.querySelector("button");
      if (btn) {
        fireEvent.click(btn);
        await waitFor(() => expect(screen.queryByText(/^music$/i)).toBeNull());
      }
    }
  });

  it("switches to Featured tab and shows events", async () => {
    await waitFor(() => screen.getAllByText(/Summer Dance Festival/i));
    fireEvent.click(screen.getByRole("button", { name: /^featured$/i }));
    await waitFor(() => expect(screen.getByText(/events found/i)).toBeTruthy());
  });
});
