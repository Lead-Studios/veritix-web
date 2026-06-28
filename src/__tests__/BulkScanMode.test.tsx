import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BulkScanMode } from "@/components/verification/BulkScanMode";

describe("BulkScanMode", () => {
  const baseProps = {
    onScan: () => {},
    isActive: true,
    onToggle: () => {},
  };

  it("renders when active", () => {
    render(<BulkScanMode {...baseProps} />);
    expect(screen.getByText("Bulk Scan Mode")).toBeInTheDocument();
  });

  it("renders nothing when inactive", () => {
    const { container } = render(<BulkScanMode {...baseProps} isActive={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows finish and cancel buttons", () => {
    render(<BulkScanMode {...baseProps} />);
    expect(screen.getByText("Finish & Submit Batch")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("shows scan count", () => {
    render(<BulkScanMode {...baseProps} />);
    expect(screen.getByText(/0 scanned/)).toBeInTheDocument();
  });

  it("calls onToggle on cancel", () => {
    let toggled = false;
    render(<BulkScanMode {...baseProps} onToggle={() => (toggled = true)} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(toggled).toBe(true);
  });
});
