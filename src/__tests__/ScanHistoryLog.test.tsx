import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScanHistoryLog } from "@/components/verification/ScanHistoryLog";

const mockScans = [
  { id: "1", ticketCode: "TICKET-001", result: "valid" as const, scannedAt: "2026-07-15T18:00:00Z" },
  { id: "2", ticketCode: "TICKET-002", result: "invalid" as const, scannedAt: "2026-07-15T18:01:00Z" },
];

describe("ScanHistoryLog", () => {
  it("shows empty state when no scans", () => {
    render(<ScanHistoryLog scans={[]} />);
    expect(screen.getByText(/No scans in this session yet/)).toBeInTheDocument();
  });

  it("shows scan count", () => {
    render(<ScanHistoryLog scans={mockScans} />);
    expect(screen.getByText(/2 scans?/)).toBeInTheDocument();
  });

  it("renders ticket codes", () => {
    render(<ScanHistoryLog scans={mockScans} />);
    expect(screen.getByText("TICKET-001")).toBeInTheDocument();
    expect(screen.getByText("TICKET-002")).toBeInTheDocument();
  });
});
