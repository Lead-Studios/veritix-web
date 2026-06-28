import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StellarPaymentInstructions } from "@/components/payment/StellarPaymentInstructions";

describe("StellarPaymentInstructions", () => {
  const baseProps = {
    amount: 100,
    destinationAddress: "GB1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF",
    memo: "MEMO123",
  };

  it("renders payment title", () => {
    render(<StellarPaymentInstructions {...baseProps} />);
    expect(screen.getByText("Payment Instructions")).toBeInTheDocument();
  });

  it("shows amount and asset code", () => {
    render(<StellarPaymentInstructions {...baseProps} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText("XLM")).toBeInTheDocument();
  });

  it("shows destination address", () => {
    render(<StellarPaymentInstructions {...baseProps} />);
    expect(screen.getByText(baseProps.destinationAddress)).toBeInTheDocument();
  });

  it("shows memo", () => {
    render(<StellarPaymentInstructions {...baseProps} />);
    expect(screen.getByText("MEMO123")).toBeInTheDocument();
  });

  it("shows important notice", () => {
    render(<StellarPaymentInstructions {...baseProps} />);
    expect(screen.getByText("Important")).toBeInTheDocument();
  });
});
