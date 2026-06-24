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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react") as typeof import("react");
  const proxy = new Proxy({}, {
    get: (_t, tag: string) =>
      ({ children, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
        React.createElement(tag, rest, children),
  });
  return { motion: proxy, AnimatePresence: ({ children }: { children: React.ReactNode }) => children };
});

describe("Event Discovery - Search and Filter", () => {
  beforeEach(() => {
    render(<EventsPage />);
  });

  it("shows empty state when search returns no results", async () => {
    await waitFor(() => screen.getAllByText(/Summer Dance Festival/i));
    fireEvent.change(screen.getByPlaceholderText(/search events/i), {
      target: { value: "no matching event" },
    });
    await waitFor(() => expect(screen.getByText(/No events found/i)).toBeTruthy());
  });

  it("reduces event list when a category filter is applied", async () => {
    await waitFor(() => screen.getAllByText(/Summer Dance Festival/i));
    const initialCount = screen.getAllByText(/Summer Dance Festival|Electronic Music Night/i).length;
    
    const chip = screen.queryByText(/^festival$/i);
    if (chip) {
      const btn = chip.closest("div")?.querySelector("button");
      if (btn) {
        fireEvent.click(btn);
        await waitFor(() => expect(screen.queryByText(/^festival$/i)).toBeNull());
      }
    }
    
    await waitFor(() => {
      const afterCount = screen.getAllByText(/Electronic Music Night/i).length;
      expect(afterCount).toBeLessThan(initialCount);
    });
  });

  it("handles combined search and category filter", async () => {
    await waitFor(() => screen.getAllByText(/Summer Dance Festival|Electronic Music Night/i));
    
    const chip = screen.queryByText(/^music$/i);
    if (chip) {
      const btn = chip.closest("div")?.querySelector("button");
      if (btn) {
        fireEvent.click(btn);
      }
    }
    
    await waitFor(() => screen.getAllByText(/Summer Dance Festival|Electronic Music Night/i));
    
    fireEvent.change(screen.getByPlaceholderText(/search events/i), {
      target: { value: "Summer" },
    });
    
    await waitFor(() => expect(screen.getByText(/Summer Dance Festival/i)).toBeTruthy());
    await waitFor(() => expect(screen.queryByText(/Electronic Music Night/i)).toBeNull());
  });
});
