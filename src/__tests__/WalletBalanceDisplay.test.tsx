import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { WalletBalanceDisplay } from "@/components/wallet/WalletBalanceDisplay";

describe("WalletBalanceDisplay", () => {
  it("renders wallet section title", () => {
    render(<WalletBalanceDisplay />);
    expect(screen.getByText("Stellar Wallet")).toBeInTheDocument();
  });

  it("renders refresh button", () => {
    render(<WalletBalanceDisplay />);
    expect(screen.getByText("Refresh")).toBeInTheDocument();
  });
});
