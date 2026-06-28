import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StellarPaymentInstructions } from "@/features/orders/components/StellarPaymentInstructions";
import { toast } from "react-toastify";

const push = vi.fn();
const writeText = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("StellarPaymentInstructions", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    writeText.mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: "PENDING" }),
    }) as unknown as typeof fetch;
  });

  it("renders Stellar payment details and copy controls", async () => {
    render(
      <StellarPaymentInstructions
        orderId="order-1"
        destinationAddress="GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        memo="MEMO-123"
        amountXLM="25.5"
      />
    );

    expect(screen.getByText("Complete your ticket payment")).toBeInTheDocument();
    expect(screen.getByText("Required — your payment will fail without the memo")).toBeInTheDocument();
    expect(screen.getByText("25.5 XLM")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy destination address/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy memo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy amount/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/orders/order-1", expect.any(Object));
    });
  });

  it("redirects to tickets when polling returns PAID", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: "PAID" }),
    }) as unknown as typeof fetch;

    render(
      <StellarPaymentInstructions
        orderId="order-paid"
        destinationAddress="GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        memo="MEMO-PAID"
        amountXLM={12}
      />
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("\uD83C\uDF89 Tickets issued! Check your email.");
      expect(push).toHaveBeenCalledWith("/tickets");
    });
  });

  it("retries an expired payment window", async () => {
    const user = userEvent.setup();
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "PENDING" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          destinationAddress: "GNEWDESTINATION",
          memo: "NEW-MEMO",
          amountXLM: "30",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "PENDING" }),
      }) as unknown as typeof fetch;

    render(
      <StellarPaymentInstructions
        orderId="order-expired"
        destinationAddress="GOLDDESTINATION"
        memo="OLD-MEMO"
        amountXLM="20"
        expiresAt={new Date(Date.now() - 1000)}
      />
    );

    await user.click(screen.getByRole("button", { name: /retry payment/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/orders/order-expired/retry-payment", {
        method: "POST",
      });
      expect(screen.getByText("NEW-MEMO")).toBeInTheDocument();
      expect(toast.success).toHaveBeenCalledWith("Payment window refreshed.");
    });
  });
});
