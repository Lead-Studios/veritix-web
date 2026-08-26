"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ArrowLeft, TrendingUp } from "lucide-react";

export interface EventBreakdown {
  eventId: string;
  eventName: string;
  sales: number;
}

export interface PerformanceDataPoint {
  /** Label shown on x-axis (e.g. "Jan 14") */
  month: string;
  value: number;
  /** Optional per-event breakdown for that day */
  events?: EventBreakdown[];
}

interface DrillDownPanelProps {
  day: PerformanceDataPoint;
  onClose: () => void;
}

function DrillDownPanel({ day, onClose }: DrillDownPanelProps) {
  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const events = day.events ?? [];

  return (
    // Overlay backdrop
    <div
      className="fixed inset-0 z-40 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={`Event breakdown for ${day.month}`}
    >
      {/* Dim background */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side panel */}
      <aside
        className="relative z-50 flex h-full w-full max-w-sm flex-col bg-[#101428] border-l border-[#4D21FF]/40 shadow-2xl"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#4D21FF]/30 px-5 py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs text-[#21D4FF] hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF] rounded"
            aria-label="Back to aggregate chart"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back
          </button>
          <p className="text-sm font-semibold text-white">{day.month}</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF] rounded"
            aria-label="Close panel"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Summary */}
        <div className="border-b border-white/5 px-5 py-4">
          <p className="text-xs uppercase tracking-widest text-[#21D4FF]">Total Sales</p>
          <p className="text-2xl font-bold text-[#4D21FF]">
            {day.value.toLocaleString()}
          </p>
        </div>

        {/* Event list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-3 text-xs font-semibold uppercase text-[#21D4FF]">
            Events active on this day
          </p>

          {events.length === 0 ? (
            <p className="text-sm text-gray-500">No per-event data available.</p>
          ) : (
            <ul className="space-y-3" role="list">
              {events.map((ev) => {
                const pct = day.value > 0 ? (ev.sales / day.value) * 100 : 0;
                return (
                  <li
                    key={ev.eventId}
                    className="rounded-lg bg-white/5 p-3"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-sm font-medium text-white leading-snug">
                        {ev.eventName}
                      </span>
                      <span className="shrink-0 text-sm font-bold text-[#4D21FF]">
                        {ev.sales.toLocaleString()}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div
                      className="h-1.5 w-full rounded-full bg-white/10"
                      role="progressbar"
                      aria-valuenow={Math.round(pct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${ev.eventName}: ${Math.round(pct)}% of day's sales`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#4D21FF] to-[#21D4FF]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-[10px] text-gray-500">
                      {pct.toFixed(1)}%
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const [selectedDay, setSelectedDay] = useState<PerformanceDataPoint | null>(null);
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  const handleClose = useCallback(() => setSelectedDay(null), []);

  function handleBarClick(item: PerformanceDataPoint) {
    setSelectedDay(item);
  }

  function handleBarKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    item: PerformanceDataPoint
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedDay(item);
    }
  }

  const summary = `Performance chart showing ${data.length} periods with total sales of ${data.reduce((s, d) => s + d.value, 0).toLocaleString()}`;

  return (
    <>
      <div className="sr-only" role="img" aria-label={summary}>
        {summary}
      </div>
      <div
        className="flex h-48 items-end gap-4"
        role="group"
        aria-label="Performance chart — click a bar to see per-event breakdown"
      >
        {data.map((item) => (
          <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
            <button
              onClick={() => handleBarClick(item)}
              onKeyDown={(e) => handleBarKeyDown(e, item)}
              aria-label={`${item.month}: ${item.value.toLocaleString()} sales. Press to view breakdown.`}
              title={`Click to drill down into ${item.month}`}
              className="group relative flex w-full flex-col items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D21FF] rounded-t-md"
              style={{ height: "100%" }}
            >
              <span className="sr-only">
                {item.value.toLocaleString()} sales on {item.month}
              </span>
              <div
                className="w-full rounded-t-md bg-[#4D21FF] transition-colors group-hover:bg-[#21D4FF] cursor-pointer"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
                aria-hidden="true"
              >
                {/* Tooltip on hover */}
                <div
                  className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#1a2040] border border-[#4D21FF] px-2 py-1 text-[10px] text-[#21D4FF] opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                >
                  {item.value.toLocaleString()}
                </div>
              </div>
            </button>
            <span className="text-[10px] text-[#21D4FF]">{item.month}</span>
          </div>
        ))}
      </div>

      {selectedDay && (
        <DrillDownPanel day={selectedDay} onClose={handleClose} />
      )}
    </>
  );
};
