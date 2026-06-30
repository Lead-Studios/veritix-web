"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface SalesVelocityPoint {
  date: string;
  ticketsSold: number;
}

interface SalesVelocityChartProps {
  data: SalesVelocityPoint[];
}

type Window = 7 | 30 | 90;
const WINDOWS: { label: string; value: Window }[] = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
];

export function SalesVelocityChart({ data }: SalesVelocityChartProps) {
  const [window, setWindow] = useState<Window>(30);

  const sliced = useMemo(() => data.slice(-window), [data, window]);

  const total = useMemo(
    () => sliced.reduce((sum, d) => sum + d.ticketsSold, 0),
    [sliced],
  );

  const peak = useMemo(
    () => sliced.reduce((max, d) => (d.ticketsSold > max.ticketsSold ? d : max), sliced[0] ?? { date: "", ticketsSold: 0 }),
    [sliced],
  );

  return (
    <div className="rounded-2xl border border-[#4D21FF]/30 bg-[#0a0f24] p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Sales Velocity</h3>
          <p className="text-xs text-[#21D4FF]/70">
            {total} tickets sold in {window} days
          </p>
        </div>
        <div className="flex overflow-hidden rounded-xl border border-white/10">
          {WINDOWS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setWindow(value)}
              className={`px-4 py-1.5 text-xs font-medium transition-colors ${
                window === value
                  ? "bg-[#4D21FF] text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={sliced} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4D21FF" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4D21FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#21D4FF", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fill: "#21D4FF", fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0a0f24",
              border: "1px solid rgba(77,33,255,0.4)",
              borderRadius: 8,
              color: "#fff",
              fontSize: 12,
            }}
            formatter={(value: number, _: string, entry) => {
              const isPeak = entry.payload.date === peak.date;
              return [
                `${value} tickets${isPeak ? " 🔥 Peak" : ""}`,
                "Sold",
              ];
            }}
            labelStyle={{ color: "#21D4FF" }}
          />
          <Area
            type="monotone"
            dataKey="ticketsSold"
            stroke="#4D21FF"
            strokeWidth={2}
            fill="url(#salesGradient)"
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (payload.date !== peak.date) return <g key={`dot-${payload.date}`} />;
              return (
                <circle
                  key={`peak-${payload.date}`}
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill="#21D4FF"
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
