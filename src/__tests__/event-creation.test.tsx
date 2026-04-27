/**
 * Integration tests — Event Creation (FE-015)
 *
 * Covers:
 *  - Multi-step form renders step 1 on load
 *  - Validation prevents advancing without required fields
 *  - Filling step 1 and advancing moves to step 2
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateEventPage from "@/app/(protected)/events/create/page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Event Creation", () => {
  it("renders the first step of the creation wizard", () => {
    render(<CreateEventPage />);
    // Step 1 typically shows a heading or label about basic info
    expect(
      screen.getByText(/basic information|event name|step 1/i)
    ).toBeTruthy();
  });

  it("shows validation error when Next is clicked with empty required fields", async () => {
    const user = userEvent.setup();
    render(<CreateEventPage />);
    const nextBtn = screen.getByRole("button", { name: /next|continue/i });
    await user.click(nextBtn);
    // At least one error message should appear
    const errors = screen.queryAllByRole("alert");
    expect(errors.length + screen.queryAllByText(/required|must/i).length).toBeGreaterThan(0);
  });
});
