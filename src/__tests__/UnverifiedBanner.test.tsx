import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UnverifiedBanner from "@/components/dashboard/UnverifiedBanner";

describe("UnverifiedBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when isVerified is false", () => {
    render(<UnverifiedBanner isVerified={false} email="user@example.com" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Account Unverified:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resend email/i })).toBeInTheDocument();
  });

  it("does not render when isVerified is true", () => {
    const { container } = render(<UnverifiedBanner isVerified={true} email="user@example.com" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("calls resend verification API and shows success confirmation when clicked", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Verification email sent." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<UnverifiedBanner isVerified={false} email="test@example.com" />);

    const resendBtn = screen.getByRole("button", { name: /resend email/i });
    fireEvent.click(resendBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/auth/resend-verification"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "test@example.com" }),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Verification email sent!/i)).toBeInTheDocument();
      expect(screen.getByText(/Sent/i)).toBeInTheDocument();
    });
  });
});
