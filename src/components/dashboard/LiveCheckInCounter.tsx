"use client";

import { useCheckInCounter } from "@/hooks/useCheckInCounter";
import { cn } from "@/lib/cn";
import { RefreshCw, Users, Wifi, WifiOff } from "lucide-react";

interface LiveCheckInCounterProps {
  eventId: string;
  isLive: boolean;
  className?: string;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function AttendanceBar({
  checkInCount,
  totalCapacity,
}: {
  checkInCount: number;
  totalCapacity: number;
}) {
  const pct = Math.min(100, Math.round((checkInCount / totalCapacity) * 100));
  const colour =
    pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="mt-4 space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{checkInCount.toLocaleString()} checked in</span>
        <span>{pct}% capacity</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", colour)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-right text-xs text-gray-400">
        of {totalCapacity.toLocaleString()} total capacity
      </p>
    </div>
  );
}

export function LiveCheckInCounter({
  eventId,
  isLive,
  className,
}: LiveCheckInCounterProps) {
  const { checkInCount, totalCapacity, lastUpdated, loading, error, refresh } =
    useCheckInCounter(eventId, isLive);

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm",
        className
      )}
      role="region"
      aria-label="Live check-in counter"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#013237]" />
          <h2 className="text-sm font-semibold text-[#013237] uppercase tracking-wide">
            Live Check-ins
          </h2>
        </div>

        {/* Live / offline badge */}
        {isLive ? (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            {/* Pulsing dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            LIVE
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
            <WifiOff className="h-3 w-3" />
            Event ended
          </span>
        )}
      </div>

      {/* Main counter */}
      <div className="mt-5 flex items-end gap-3">
        {checkInCount !== null ? (
          <span
            className={cn(
              "text-5xl font-bold tabular-nums text-[#013237] transition-opacity duration-300",
              loading && "opacity-60"
            )}
          >
            {checkInCount.toLocaleString()}
          </span>
        ) : (
          <span className="text-5xl font-bold text-gray-300">—</span>
        )}

        {/* Spinning indicator while fetching */}
        {loading && (
          <Wifi className="mb-1.5 h-5 w-5 animate-pulse text-emerald-500" />
        )}
      </div>

      {/* Capacity bar */}
      {checkInCount !== null && totalCapacity !== null && totalCapacity > 0 && (
        <AttendanceBar
          checkInCount={checkInCount}
          totalCapacity={totalCapacity}
        />
      )}

      {/* Error message */}
      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
        >
          ⚠ {error} — data may be stale.
        </p>
      )}

      {/* Footer: last updated + manual refresh */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-400">
          {lastUpdated
            ? `Updated ${formatTime(lastUpdated)}`
            : isLive
              ? "Fetching…"
              : "Polling paused"}
        </p>

        <button
          onClick={refresh}
          disabled={loading || !isLive}
          aria-label="Manually refresh check-in count"
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            isLive
              ? "bg-[#013237] text-white hover:bg-[#024a50] active:scale-95"
              : "cursor-not-allowed bg-gray-100 text-gray-400"
          )}
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5", loading && "animate-spin")}
          />
          Refresh
        </button>
      </div>
    </div>
  );
}

export default LiveCheckInCounter;