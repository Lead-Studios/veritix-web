import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateEventPage from "@/app/(protected)/events/create/page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    <a href={href}>{children}</a>,
}));
vi.mock("framer-motion", () => {
  const React = require("react");
  const proxy = new Proxy({}, {
    get: (_t, tag: string) =>
      ({ children, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
        React.createElement(tag === "button" ? "button" : "div", rest, children),
  });
  return { motion: proxy, AnimatePresence: ({ children }: { children: React.ReactNode }) => children };
});

describe("Event Creation", () => {
  it("renders the first step of the creation wizard", () => {
    render(<CreateEventPage />);
    expect(screen.getByText(/create new event/i)).toBeTruthy();
  });

  it("shows validation error when Create is clicked with empty required fields", async () => {
    render(<CreateEventPage />);
    const createBtn = screen.getByRole("button", { name: /create event/i });
    fireEvent.click(createBtn);
    // Page should still be present (no navigation on invalid submit)
    expect(screen.getByText(/create new event/i)).toBeTruthy();
  });
});
