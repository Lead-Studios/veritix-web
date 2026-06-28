"use client";

interface Props {
  revenueTrend: number | null;
  trendText: string;
  trendColor: string;
}

export default function RevenueTrend({ revenueTrend, trendText, trendColor }: Props) {
  if (revenueTrend === null) {
    return <p className="mt-4 text-xs text-gray-500">Insufficient data to calculate trend.</p>;
  }
  return <p className={`mt-4 text-xs ${trendColor}`}>{trendText}</p>;
}
