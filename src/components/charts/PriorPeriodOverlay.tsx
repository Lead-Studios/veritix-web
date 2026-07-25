"use client";

import React from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface PriorPeriodDataPoint {
  label: string;
  current: number;
  prior: number;
}

interface PriorPeriodOverlayProps {
  data: PriorPeriodDataPoint[];
  currentLabel?: string;
  priorLabel?: string;
  valueFormatter?: (value: number) => string;
  height?: number;
  className?: string;
}

const defaultFormatter = (v: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(v);

/**
 * Overlays the current period as an Area chart with the prior period as a
 * dashed Line for quick visual comparison.
 */
export const PriorPeriodOverlay: React.FC<PriorPeriodOverlayProps> = ({
  data,
  currentLabel = "Current Period",
  priorLabel = "Prior Period",
  valueFormatter = defaultFormatter,
  height = 320,
  className = "",
}) => {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={valueFormatter}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              valueFormatter(value),
              name,
            ]}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 13,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 13, paddingTop: 12 }}
            iconType="square"
          />
          <Area
            type="monotone"
            dataKey="current"
            name={currentLabel}
            stroke="#7c3aed"
            fill="#ede9fe"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="prior"
            name={priorLabel}
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorPeriodOverlay;