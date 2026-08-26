"use client";

import { useState } from "react";

export interface FunnelStage {
  label: string;
  count: number;
}

interface Props {
  stages: FunnelStage[];
  /** Threshold (0-100) at which drop-off is highlighted in red */
  dropOffThreshold?: number;
}

const DROP_OFF_THRESHOLD_DEFAULT = 30;

export function ConversionFunnelChart({
  stages,
  dropOffThreshold = DROP_OFF_THRESHOLD_DEFAULT,
}: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (stages.length === 0) return null;

  const maxCount = stages[0]?.count ?? 1;

  return (
    <div className="rounded-xl bg-white/5 p-4" role="figure" aria-label="Conversion funnel chart">
      <p className="mb-4 text-xs font-semibold uppercase text-[#21D4FF]">
        Conversion Funnel
      </p>

      <div className="space-y-1">
        {stages.map((stage, index) => {
          const widthPct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          const prevCount = index > 0 ? stages[index - 1].count : stage.count;
          const dropOff =
            prevCount > 0
              ? Math.round(((prevCount - stage.count) / prevCount) * 100)
              : 0;
          const isHighDropOff =
            index > 0 && dropOff >= dropOffThreshold;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={stage.label}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center justify-between text-xs text-[#21D4FF] mb-1">
                <span className="font-medium">{stage.label}</span>
                <span className="tabular-nums">
                  {stage.count.toLocaleString()}
                  {index > 0 && (
                    <span
                      className={`ml-1.5 ${
                        isHighDropOff ? "text-red-400 font-semibold" : "text-gray-500"
                      }`}
                    >
                      ({index > 0 ? `${(stage.count / prevCount * 100).toFixed(0)}%` : "100%"})
                    </span>
                  )}
                  {index === 0 && (
                    <span className="ml-1.5 text-gray-500">(100%)</span>
                  )}
                </span>
              </div>

              {/* Funnel bar */}
              <div className="relative h-8 rounded-lg bg-white/5 overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-lg transition-all duration-300 ${
                    isHighDropOff
                      ? "bg-gradient-to-r from-red-500/60 to-red-400/40"
                      : "bg-gradient-to-r from-[#4D21FF] to-[#21D4FF]"
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
                {/* Drop-off indicator arrow */}
                {index > 0 && isHighDropOff && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-red-400">
                    ▼ {dropOff}% drop
                  </div>
                )}
              </div>

              {/* Tooltip on hover */}
              {isHovered && (
                <div
                  role="tooltip"
                  className="absolute right-0 -top-12 z-10 rounded-lg border border-[#4D21FF]/40 bg-[#1a2040] px-3 py-2 text-[11px] text-[#21D4FF] shadow-lg whitespace-nowrap"
                >
                  {stage.count.toLocaleString()} attendees
                  {index > 0 && ` — ${dropOff}% drop from previous stage`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary row */}
      {stages.length >= 2 && (
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
          <span className="text-gray-400">
            Overall conversion
          </span>
          <span className="font-semibold text-[#4D21FF]">
            {maxCount > 0
              ? `${((stages[stages.length - 1].count / maxCount) * 100).toFixed(1)}%`
              : "0%"}
          </span>
        </div>
      )}
    </div>
  );
}
