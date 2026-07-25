"use client";

import { TrendingUp, Info } from "lucide-react";
import { useState } from "react";

export interface ProjectedRevenueInput {
  /** Tickets still available for sale */
  remainingTickets: number;
  /** Average price per ticket (in base currency units) */
  averageTicketPrice: number;
  /** Sell-through trend as a ratio 0–1 (e.g. 0.72 = 72 % sold so far) */
  sellThroughRate: number;
  /** Total ticket capacity for the event */
  totalTickets: number;
}

interface ProjectedRevenueCardProps {
  input: ProjectedRevenueInput;
  /** Currency label shown in the card, defaults to "₦" */
  currencySymbol?: string;
}

/**
 * Computes projected revenue and a confidence range from sell-through data.
 *
 * Base projection = remainingTickets × averageTicketPrice × sellThroughRate
 * Lower bound    = base × 0.80   (20 % pessimistic)
 * Upper bound    = base × 1.20   (20 % optimistic)
 */
function computeProjection(input: ProjectedRevenueInput): {
  base: number;
  low: number;
  high: number;
  confidence: "low" | "medium" | "high";
} | null {
  const {
    remainingTickets,
    averageTicketPrice,
    sellThroughRate,
    totalTickets,
  } = input;

  // Require sufficient data
  if (
    remainingTickets <= 0 ||
    averageTicketPrice <= 0 ||
    totalTickets <= 0 ||
    sellThroughRate <= 0
  ) {
    return null;
  }

  // Need at least 10 % of tickets sold to form a meaningful trend
  const soldSoFar = totalTickets - remainingTickets;
  if (soldSoFar / totalTickets < 0.1) return null;

  const base = remainingTickets * averageTicketPrice * sellThroughRate;
  const low = Math.round(base * 0.8);
  const high = Math.round(base * 1.2);

  const confidence: "low" | "medium" | "high" =
    sellThroughRate >= 0.6 ? "high" : sellThroughRate >= 0.3 ? "medium" : "low";

  return { base: Math.round(base), low, high, confidence };
}

function fmt(n: number, symbol: string) {
  return `${symbol} ${n.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

const CONFIDENCE_COLORS = {
  high: "text-emerald-400",
  medium: "text-yellow-400",
  low: "text-red-400",
} as const;

const CONFIDENCE_LABELS = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
} as const;

export function ProjectedRevenueCard({
  input,
  currencySymbol = "₦",
}: ProjectedRevenueCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const projection = computeProjection(input);

  // Hidden if insufficient data
  if (!projection) return null;

  const { low, high, confidence } = projection;

  return (
    <div
      className="rounded-xl border border-[#4D21FF]/40 bg-[#000625]/60 p-5"
      aria-label="Projected revenue card"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-[#21D4FF]" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-widest text-[#21D4FF]">
            Projected Revenue
          </p>
        </div>

        {/* Info tooltip */}
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label="How is this calculated?"
            className="text-gray-500 hover:text-[#21D4FF] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF] rounded"
          >
            <Info size={13} aria-hidden="true" />
          </button>
          {showTooltip && (
            <div
              role="tooltip"
              className="absolute right-0 top-6 z-10 w-56 rounded-lg border border-[#4D21FF]/40 bg-[#1a2040] px-3 py-2 text-[11px] text-gray-300 shadow-lg"
            >
              Estimated from remaining tickets × average ticket price, weighted
              by current sell-through trend. Range shows ±20 % variance.
            </div>
          )}
        </div>
      </div>

      {/* Range display */}
      <p className="text-xl font-bold text-white leading-tight">
        {fmt(low, currencySymbol)}
        <span className="mx-1 text-gray-500">–</span>
        {fmt(high, currencySymbol)}
      </p>
      <p className="mt-0.5 text-xs text-gray-400">projected from remaining inventory</p>

      {/* Confidence badge */}
      <div className="mt-3 flex items-center gap-1.5">
        <span
          className={`h-2 w-2 rounded-full ${
            confidence === "high"
              ? "bg-emerald-400"
              : confidence === "medium"
              ? "bg-yellow-400"
              : "bg-red-400"
          }`}
          aria-hidden="true"
        />
        <span className={`text-xs font-medium ${CONFIDENCE_COLORS[confidence]}`}>
          {CONFIDENCE_LABELS[confidence]}
        </span>
      </div>

      {/* Progress bar — sell-through rate */}
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-[10px] text-gray-500">
          <span>Sell-through rate</span>
          <span>{Math.round(input.sellThroughRate * 100)}%</span>
        </div>
        <div
          className="h-1.5 w-full rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={Math.round(input.sellThroughRate * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Sell-through rate: ${Math.round(input.sellThroughRate * 100)}%`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] transition-[width] duration-500"
            style={{ width: `${Math.min(input.sellThroughRate * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
