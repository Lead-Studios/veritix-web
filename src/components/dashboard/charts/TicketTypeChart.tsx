"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { TicketTypeBreakdown } from "@/hooks/useOrganizerAnalytics";

const COLORS = ["#4D21FF", "#21D4FF", "#a78bfa", "#34d399", "#f59e0b", "#f87171"];

interface Props {
  data: TicketTypeBreakdown[];
}

interface TooltipPayload {
  name: string;
  value: number;
  payload: TicketTypeBreakdown & { percentage: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: item } = payload[0];
  return (
    <div className="rounded bg-[#1a2040] border border-[#4D21FF] px-3 py-2 text-xs text-[#21D4FF]">
      <p className="font-semibold">{name}</p>
      <p>Count: {value}</p>
      <p>Revenue: ₦{item.revenue.toLocaleString("en-NG")}</p>
      <p>Share: {item.percentage}%</p>
    </div>
  );
}

export function TicketTypeChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const chartData = data.map((d) => ({
    ...d,
    name: d.type,
    value: d.count,
    percentage: total > 0 ? Math.round((d.count / total) * 100) : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span className="text-xs text-[#21D4FF]">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
