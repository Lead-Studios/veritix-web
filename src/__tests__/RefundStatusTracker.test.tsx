import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RefundStatusTracker } from "@/components/tickets/RefundStatusTracker";

describe("RefundStatusTracker", () => {
  it("renders nothing when status is none", () => {
    const { container } = render(<RefundStatusTracker status="none" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders refund status title", () => {
    render(<RefundStatusTracker status="requested" />);
    expect(screen.getByText("Refund Status")).toBeInTheDocument();
  });

  it("shows requested step", () => {
    render(<RefundStatusTracker status="requested" />);
    expect(screen.getByText("Refund Requested")).toBeInTheDocument();
  });

  it("shows rejected state with reason", () => {
    render(<RefundStatusTracker status="rejected" reason="Outside refund window" />);
    expect(screen.getByText("Refund Rejected")).toBeInTheDocument();
    expect(screen.getByText("Outside refund window")).toBeInTheDocument();
  });

  it("shows completed state", () => {
    render(<RefundStatusTracker status="completed" completedAt="2026-06-15T12:00:00Z" />);
    expect(screen.getByText("Refund Requested")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
