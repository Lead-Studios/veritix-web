'use client';

import React from 'react';

export function CapacityProgressBar({ sold, total }: { sold: number; total: number }) {
  const percentage = (sold / total) * 100;
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all"
        style={{ width: `${percentage}%` }}
      />
export interface CapacityProgressBarProps {
  sold: number;
  total: number;
  className?: string;
  showLabels?: boolean;
}

export function CapacityProgressBar({
  sold,
  total,
  className = '',
  showLabels = true,
}: CapacityProgressBarProps) {
  const safeTotal = Math.max(0, total);
  const safeSold = Math.max(0, sold);
  const percentage = safeTotal > 0 ? Math.min(100, Math.round((safeSold / safeTotal) * 100)) : 0;
  const remaining = Math.max(0, safeTotal - safeSold);
  const isUrgent = percentage >= 90;

  return (
    <div className={`w-full space-y-1.5 ${className}`} aria-label="Event capacity">
      {showLabels && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-white/90">{percentage}% sold</span>
          <span className="text-gray-400">
            {remaining === 0 ? 'Sold out' : `${remaining.toLocaleString()} spots left`}
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percentage}% sold`}
          className={`h-full rounded-full transition-all duration-500 ${
            isUrgent
              ? 'bg-gradient-to-r from-amber-500 to-rose-500'
              : 'bg-gradient-to-r from-[#4D21FF] to-[#21D4FF]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export const EventCapacityProgress = CapacityProgressBar;
export default CapacityProgressBar;
