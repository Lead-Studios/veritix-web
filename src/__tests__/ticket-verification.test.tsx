import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerifyPage from "@/app/(protected)/verify/page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("framer-motion", () => {
  const React = require("react");
  const proxy = new Proxy({}, {
    get: (_t, tag: string) =>
      ({ children, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
        React.createElement(tag === "button" ? "button" : "div", rest, children),
  });
  return { motion: proxy, AnimatePresence: ({ children }: { children: React.ReactNode }) => children };
});

const VALID_ID = "TKT-2024-ALPHA-001";
const INVALID_ID = "TKT-INVALID-000";

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
    await waitFor(() => expect(screen.getByText(/invalid|not found|failed/i)).toBeTruthy());
  });
});
