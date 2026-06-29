"use client";

import { useCheckInCounter } from "@/hooks/useCheckInCounter";

interface Props {
  eventId: string;
  eventName: string;
  isLive: boolean;
}

export function LiveCheckInCard({ eventId, eventName, isLive }: Props) {
  const { checkInCount } = useCheckInCounter(eventId, isLive);

  if (!isLive) {
    return (
      <p className="text-sm text-[#21D4FF]">
        No active events — check-in counter paused
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {/* Pulsing green dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-sm font-semibold text-emerald-400">
          🚪 Live Check-ins: {checkInCount ?? "…"}
        </span>
      </div>
      <p className="text-xs text-[#21D4FF] pl-4">{eventName}</p>
    </div>
  );
}
