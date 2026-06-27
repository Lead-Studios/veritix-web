import React from "react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn(() => null) }),
}));
vi.mock("framer-motion", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  const proxy = new Proxy({}, {
    get: (_t, tag: string) => {
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
        return React.createElement(tag === "button" ? "button" : "div", props, children);
      };
      MotionComponent.displayName = `motion.${tag}`;
      return MotionComponent;
    },
  });
  return { motion: proxy, AnimatePresence: ({ children }: { children: React.ReactNode }) => children };
});

import VerifyPage from "@/app/(protected)/verify/page";

const VALID_ID = "TKT-2024-ALPHA-001";
const INVALID_ID = "TKT-INVALID-000";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init?: RequestInit) => {
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      if (body.ticketCode === VALID_ID) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            status: "VALID",
            holderName: "Ada Lovelace",
            ticketType: "VIP",
            event: "Launch Night",
            date: "2026-06-30",
            seat: "A1",
          }),
        } as Response;
      }
      return {
        ok: false,
        status: 404,
        json: async () => null,
      } as Response;
    }),
  );
});

async function submitTicketId(id: string) {
  const user = userEvent.setup();
  render(<VerifyPage />);
  const input = screen.getByPlaceholderText(/TKT-2024-ALPHA-001/i);
  await user.type(input, id);
  const btn = screen.getByRole("button", { name: /verify ticket/i });
  await user.click(btn);
}

describe("Ticket Verification", () => {
  it("renders the manual ticket-entry input in idle state", () => {
    render(<VerifyPage />);
    expect(screen.getByPlaceholderText(/TKT-2024-ALPHA-001/i)).toBeTruthy();
  });

  it("shows success for a valid ticket ID", async () => {
    await submitTicketId(VALID_ID);
    await waitFor(() => expect(screen.getByText(/valid|verified|success|entry granted/i)).toBeTruthy());
  });

  it("shows failure for an invalid ticket ID", async () => {
    await submitTicketId(INVALID_ID);
    await waitFor(() => expect(screen.getAllByText(/invalid|not found|failed/i).length).toBeGreaterThan(0));
  });
});
