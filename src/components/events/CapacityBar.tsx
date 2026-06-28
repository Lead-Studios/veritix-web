"use client";

interface Props { capacity: number; sold: number; }

export default function CapacityBar({ capacity, sold }: Props) {
  const pct = capacity > 0 ? Math.min((sold / capacity) * 100, 100) : 0;
  const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-green-500";
  const remaining = Math.max(capacity - sold, 0);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{sold} sold</span>
        <span>{remaining} remaining</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
