"use client";

import { useCallback, useRef, useState } from "react";
import { HiOutlineCamera, HiOutlineStop } from "react-icons/hi";

interface BulkScanModeProps {
  onScan: (ticketCode: string) => void;
  onBatchComplete?: (results: string[]) => void;
  isActive: boolean;
  onToggle: () => void;
}

export function BulkScanMode({ onScan, onBatchComplete, isActive, onToggle }: BulkScanModeProps) {
  const queueRef = useRef<string[]>([]);
  const [queueCount, setQueueCount] = useState(0);

  const handleScan = useCallback(
    (ticketCode: string) => {
      onScan(ticketCode);
      queueRef.current = [...queueRef.current, ticketCode];
      setQueueCount(queueRef.current.length);
    },
    [onScan]
  );

  const handleFinishBatch = useCallback(() => {
    onBatchComplete?.(queueRef.current);
    queueRef.current = [];
    setQueueCount(0);
    onToggle();
  }, [onBatchComplete, onToggle]);

  const handleCancelBatch = useCallback(() => {
    queueRef.current = [];
    setQueueCount(0);
    onToggle();
  }, [onToggle]);

  if (!isActive) return null;

  return (
    <div className="rounded-2xl border border-yellow-700/30 bg-yellow-900/10 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500" />
          </span>
          <h3 className="text-sm font-semibold text-yellow-200">Bulk Scan Mode</h3>
        </div>
        <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2.5 py-1 rounded-full">
          {queueCount} scanned
        </span>
      </div>

      <p className="text-xs text-yellow-300/70">
        Scanning in rapid-fire mode. No confirmation dialog between scans.
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleFinishBatch}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#4D21FF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3d18cc] transition-colors"
        >
          <HiOutlineCamera className="w-4 h-4" />
          Finish &amp; Submit Batch
        </button>
        <button
          onClick={handleCancelBatch}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-700/30 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/10 transition-colors"
        >
          <HiOutlineStop className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  );
}
