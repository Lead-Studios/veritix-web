"use client";

import { useState } from "react";
import type { Seat } from "./SeatSelector";

interface VisualSeatMapProps {
  seats: Seat[];
  venueName?: string;
  onSelectionChange?: (selectedIds: string[]) => void;
}

const SECTION_COLORS = ["#4D21FF", "#21D4FF", "#FF6B6B", "#FFD93D", "#6BCB77", "#FF8C42"];

export function VisualSeatMap({ seats, venueName, onSelectionChange }: VisualSeatMapProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const rows = Array.from(
    seats.reduce((acc, seat) => {
      if (!acc.has(seat.row)) acc.set(seat.row, []);
      acc.get(seat.row)!.push(seat);
      return acc;
    }, new Map<string, typeof seats>())
  );

  const sectionIndex = (row: string) =>
    row.charCodeAt(0) - "A".charCodeAt(0) % SECTION_COLORS.length;

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "taken") return;

    const next = new Set(selectedIds);
    if (next.has(seat.id)) {
      next.delete(seat.id);
    } else {
      next.add(seat.id);
    }
    setSelectedIds(next);
    onSelectionChange?.(Array.from(next));
  };

  return (
    <div className="space-y-6">
      {venueName && (
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-gray-500">{venueName}</p>
        </div>
      )}

      <div className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4D21FF]/20 to-[#21D4FF]/20 border border-white/5 text-center text-xs text-gray-400 tracking-widest uppercase">
        Stage
      </div>

      <div className="space-y-1.5">
        {rows.map(([row, rowSeats]) => {
          const color = SECTION_COLORS[sectionIndex(row) % SECTION_COLORS.length];
          return (
            <div key={row} className="flex items-center gap-2">
              <span className="w-5 text-[10px] font-mono text-gray-500 text-center flex-shrink-0">
                {row}
              </span>
              <div className="flex gap-1 flex-wrap">
                {rowSeats.map((seat) => {
                  const isSelected = selectedIds.has(seat.id);
                  const isTaken = seat.status === "taken";

                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat)}
                      disabled={isTaken}
                      aria-label={`Row ${seat.row} Seat ${seat.number}${isTaken ? " (taken)" : ""}`}
                      aria-pressed={isSelected}
                      className={`w-7 h-7 rounded-t-lg text-[10px] font-medium transition-all duration-150 ${
                        isTaken
                          ? "bg-gray-800 text-gray-700 cursor-not-allowed"
                          : isSelected
                            ? "text-white shadow-lg scale-110"
                            : "text-gray-300 hover:scale-105 hover:opacity-80 cursor-pointer"
                      }`}
                      style={{
                        backgroundColor: isSelected ? color : isTaken ? undefined : `${color}30`,
                        borderColor: isSelected ? color : `${color}40`,
                        borderWidth: 1,
                      }}
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: `${SECTION_COLORS[0]}30`, border: `1px solid ${SECTION_COLORS[0]}40` }} />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: SECTION_COLORS[0] }} />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-800 border border-gray-700 inline-block" />
          Taken
        </span>
      </div>

      {selectedIds.size > 0 && (
        <p className="text-center text-sm text-white">
          {selectedIds.size} seat{selectedIds.size > 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
