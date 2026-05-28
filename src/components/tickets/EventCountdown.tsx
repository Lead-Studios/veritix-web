"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(eventDate: string): TimeLeft | null {
  const diff = new Date(eventDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface EventCountdownProps {
  /** ISO date string, e.g. "2025-09-15T18:00:00Z" */
  eventDate: string;
}

/**
 * FE-114: Displays a live countdown timer to the event start on the ticket detail page.
 */
export function EventCountdown({ eventDate }: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => getTimeLeft(eventDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(eventDate)), 1_000);
    return () => clearInterval(id);
  }, [eventDate]);

  if (!timeLeft) {
    return (
      <div className="text-center text-sm text-green-400 font-semibold py-2">
        🎉 Event is live!
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div
      className="flex items-center justify-center gap-3"
      aria-label={`Event starts in ${timeLeft.days} days ${timeLeft.hours} hours ${timeLeft.minutes} minutes`}
      role="timer"
    >
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white tabular-nums">{pad(value)}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
          </div>
          {i < units.length - 1 && (
            <span className="text-xl text-gray-600 font-bold mb-3" aria-hidden="true">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
