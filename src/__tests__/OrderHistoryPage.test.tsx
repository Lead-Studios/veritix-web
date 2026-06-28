import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OrderHistoryPage } from "@/components/orders/OrderHistoryPage";

describe("OrderHistoryPage", () => {
  it("renders page title", () => {
    render(<OrderHistoryPage />);
    expect(screen.getByText("Order History")).toBeInTheDocument();
  });

  it("renders refresh button", () => {
    render(<OrderHistoryPage />);
    expect(screen.getByText("Refresh")).toBeInTheDocument();
  });
});
