"use client";

import { useState } from "react";
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

interface ScanEntry {
  id: string;
  ticketCode: string;
  result: "valid" | "invalid";
  scannedAt: string;
}

interface ScanHistoryLogProps {
  scans: ScanEntry[];
}

export function ScanHistoryLog({ scans }: ScanHistoryLogProps) {
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? scans : scans.slice(-10);

  return (
    <div className="rounded-xl border border-white/10 bg-[#020718]/80 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          Scan History
          <span className="ml-2 text-xs font-normal text-gray-500">
            ({scans.length} scan{scans.length !== 1 ? "s" : ""})
          </span>
        </h3>
        <HiOutlineClock className="w-4 h-4 text-gray-500" />
      </div>

      {scans.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No scans in this session yet.</p>
      ) : (
        <div className="space-y-1.5 max-h-80 overflow-y-auto">
          {displayed.map((scan) => (
            <div
              key={scan.id}
              className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 border border-white/5"
            >
              <div className="flex items-center gap-2 min-w-0">
                {scan.result === "valid" ? (
                  <HiOutlineCheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <HiOutlineXCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <span className="text-xs font-mono text-gray-300 truncate">
                  {scan.ticketCode}
                </span>
              </div>
              <span className="text-[10px] text-gray-600 flex-shrink-0 ml-2">
                {new Date(scan.scannedAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {scans.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          {showAll ? "Show last 10" : `Show all ${scans.length} scans`}
        </button>
      )}
    </div>
  );
}
