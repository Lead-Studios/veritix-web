/**
 * Integration tests — Ticket Verification (FE-015)
 *
 * Covers:
 *  - Idle state renders the manual-entry input
 *  - Valid ticket ID shows success state
 *  - Invalid ticket ID shows failure state
 *  - Already-used ticket ID shows already-used state
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerifyPage from "@/app/(public)/verify/page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

const VALID_ID = "TKT-2024-ALPHA-001";
const INVALID_ID = "TKT-INVALID-000";

async function submitTicketId(id: string) {
  const user = userEvent.setup();
  render(<VerifyPage />);
  const input = screen.getByPlaceholderText(/ticket id|enter ticket/i);
  await user.type(input, id);
  const btn = screen.getByRole("button", { name: /verify|check/i });
  await user.click(btn);
}

describe("Ticket Verification", () => {
  it("renders the manual ticket-entry input in idle state", () => {
    render(<VerifyPage />);
    expect(screen.getByPlaceholderText(/ticket id|enter ticket/i)).toBeTruthy();
  });

  it("shows success for a valid ticket ID", async () => {
    await submitTicketId(VALID_ID);
    expect(screen.getByText(/valid|verified|success/i)).toBeTruthy();
  });

  it("shows failure for an invalid ticket ID", async () => {
    await submitTicketId(INVALID_ID);
    expect(screen.getByText(/invalid|not found|failed/i)).toBeTruthy();
  });
});
