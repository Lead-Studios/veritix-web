/* eslint-disable @next/next/no-img-element */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EventsPage from "@/app/(public)/events/page";
import { mockEvents } from "@/mocks/events";

vi.mock("next/navigation", () => {
  const searchParams = { get: vi.fn().mockReturnValue(null) };
  return {
    useRouter: () => ({ push: vi.fn() }),
    useSearchParams: () => searchParams,
    usePathname: () => "/events",
  };
});
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
  const createMotionComponent = (tag: string) => {
    const MotionComponent = ({
      children,
      ...rest
    }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => {
      const {
        initial: _initial,
        animate: _animate,
        exit: _exit,
        transition: _transition,
        whileHover: _whileHover,
        whileTap: _whileTap,
        ...props
      } = rest as React.HTMLAttributes<HTMLElement> & Record<string, unknown>;
      void _initial;
      void _animate;
      void _exit;
      void _transition;
      void _whileHover;
      void _whileTap;
      return React.createElement(tag, props, children);
    };
    MotionComponent.displayName = `motion.${tag}`;
    return MotionComponent;
  };
  const proxy = new Proxy({}, {
    get: (_t, tag: string) => createMotionComponent(tag),
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
    const initialCount = screen.getAllByRole('link', { name: /Summer Dance Festival/i }).length;
    
    const chip = screen.getByRole('button', { name: /^remove festival filter$/i });
    fireEvent.click(chip);
    await waitFor(() => expect(screen.queryByRole('button', { name: /^remove festival filter$/i })).toBeNull());
    
    await waitFor(() => {
      const afterCount = screen.getAllByText(/Electronic Music Night/i).length;
      expect(afterCount).toBeLessThan(initialCount);
    });
  });

  it("handles combined search and category filter", async () => {
    await waitFor(() => screen.getAllByRole('link', { name: /Summer Dance Festival/i }));
    
    const removeMusicButton = screen.getByRole('button', { name: /remove music filter/i });
    fireEvent.click(removeMusicButton);

    await waitFor(() => screen.getAllByText(/Summer Dance Festival|Electronic Music Night/i));
    
    fireEvent.change(screen.getByPlaceholderText(/search events/i), {
      target: { value: "Summer" },
    });
    
    await waitFor(() => expect(screen.getAllByRole('link', { name: /Summer Dance Festival/i }).length).toBeGreaterThan(0));
    await waitFor(() => expect(screen.queryAllByRole('link', { name: /Electronic Music Night/i }).length).toBe(0));
  });
});
