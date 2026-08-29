/* eslint-disable @next/next/no-img-element */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EventsPage from "@/app/(public)/events/page";
import { mockEvents } from "@/mocks/events";

const replaceMock = vi.fn();
let searchParamsGetMock: (param: string) => string | null = () => null;

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: replaceMock,
  }),
  useSearchParams: () => ({
    get: (param: string) => searchParamsGetMock(param),
    toString: () => "",
  }),
  usePathname: () => "/events",
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => {
    const { prefetch: _prefetch, ...props } = rest as Record<string, unknown>;
    void _prefetch;
    return <a href={href} {...props}>{children}</a>;
  },
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
    get: (_t, tag: string) => createMotionComponent(tag),
  });
  return { motion: proxy, AnimatePresence: ({ children }: { children: React.ReactNode }) => children };
});

describe("Category URL Query Params Sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchParamsGetMock = () => null;
  });

  it("filters to category when present in URL query param (?category=music)", async () => {
    searchParamsGetMock = (param: string) => (param === "category" ? "music" : null);

    render(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /remove music filter/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /remove festival filter/i })).toBeNull();
    });

    // Summer Dance Festival is "festival", so it shouldn't show when filtered only to "music"
    await waitFor(() => {
      expect(screen.getByText("Electronic Music Night")).toBeInTheDocument();
      expect(screen.queryByText("Summer Dance Festival")).toBeNull();
    });
  });

  it("updates URL query params when removing a category filter", async () => {
    searchParamsGetMock = (param: string) => (param === "category" ? "music" : null);

    render(<EventsPage />);

    await waitFor(() => screen.getByRole("button", { name: /remove music filter/i }));

    const removeBtn = screen.getByRole("button", { name: /remove music filter/i });
    fireEvent.click(removeBtn);

    expect(replaceMock).toHaveBeenCalledWith("/events", { scroll: false });
  });

  it("clears all category filters and updates URL", async () => {
    searchParamsGetMock = (param: string) => (param === "category" ? "music,festival" : null);

    render(<EventsPage />);

    await waitFor(() => screen.getByRole("button", { name: /clear all/i }));

    const clearAllBtn = screen.getByRole("button", { name: /clear all/i });
    fireEvent.click(clearAllBtn);

    expect(replaceMock).toHaveBeenCalledWith("/events", { scroll: false });
  });
});
