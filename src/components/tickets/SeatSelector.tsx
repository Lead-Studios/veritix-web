"use client";

import { useState } from "react";

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: "available" | "taken" | "selected";
}

interface SeatSelectorProps {
  seats: Seat[];
  maxSelectable?: number;
  onSelectionChange?: (selectedIds: string[]) => void;
}

const STATUS_STYLES: Record<Seat["status"], string> = {
  available: "bg-white/10 border-white/20 text-gray-300 hover:bg-[#4D21FF]/40 hover:border-[#4D21FF] cursor-pointer",
  taken: "bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed opacity-50",
  selected: "bg-[#4D21FF] border-[#4D21FF] text-white cursor-pointer",
};

/**
 * FE-111: Seat-selection UI for seated event ticket types.
 * Renders a grid of seats grouped by row. Supports multi-seat selection
 * up to `maxSelectable`.
 */
export function SeatSelector({
  seats,
  maxSelectable = 1,
  onSelectionChange,
}: SeatSelectorProps) {
  const [seatMap, setSeatMap] = useState<Map<string, Seat>>(() => new Map(seats.map((s) => [s.id, s])));

  const selectedIds = Array.from(seatMap.values())
    .filter((s) => s.status === "selected")
    .map((s) => s.id);

  const toggleSeat = (id: string) => {
    const seat = seatMap.get(id);
    if (!seat || seat.status === "taken") return;

    const isSelected = seat.status === "selected";
    if (!isSelected && selectedIds.length >= maxSelectable) return;

    const updated = new Map(seatMap);
    updated.set(id, { ...seat, status: isSelected ? "available" : "selected" });
    setSeatMap(updated);
    const newSelected = Array.from(updated.values())
      .filter((s) => s.status === "selected")
      .map((s) => s.id);
    onSelectionChange?.(newSelected);
  };

  // Group seats by row
  const rows = Array.from(
    seats.reduce((acc, seat) => {
      if (!acc.has(seat.row)) acc.set(seat.row, []);
      acc.get(seat.row)!.push(seat.id);
      return acc;
    }, new Map<string, string[]>())
  );

  return (
    <div className="space-y-4" role="group" aria-label="Seat selection">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border border-white/20 bg-white/10 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border border-[#4D21FF] bg-[#4D21FF] inline-block" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border border-gray-700 bg-gray-800 opacity-50 inline-block" />
          Taken
        </span>
      </div>

      {/* Stage indicator */}
      <div className="w-full py-1.5 rounded-lg bg-white/5 border border-white/10 text-center text-xs text-gray-500 tracking-widest uppercase">
        Stage
      </div>

      {/* Seat grid */}
      <div className="space-y-2">
        {rows.map(([row, seatIds]) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-6 text-xs text-gray-500 text-center flex-shrink-0">{row}</span>
            <div className="flex flex-wrap gap-1.5">
              {seatIds.map((id) => {
                const seat = seatMap.get(id)!;
                return (
                  <button
                    key={id}
                    onClick={() => toggleSeat(id)}
                    disabled={seat.status === "taken"}
                    aria-label={`Row ${seat.row} seat ${seat.number} — ${seat.status}`}
                    aria-pressed={seat.status === "selected"}
                    className={`w-8 h-8 rounded border text-xs font-medium transition-colors ${STATUS_STYLES[seat.status]}`}
                  >
                    {seat.number}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selection summary */}
      <p className="text-xs text-gray-400">
        {selectedIds.length} of {maxSelectable} seat{maxSelectable !== 1 ? "s" : ""} selected
        {selectedIds.length > 0 && (
          <span className="ml-2 text-white">
            ({selectedIds.map((id) => {
              const s = seatMap.get(id)!;
              return `${s.row}${s.number}`;
            }).join(", ")})
          </span>
        )}
      </p>
    </div>
  );
}
