'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { TicketTypeBreakdown } from '@/hooks/useOrganizerAnalytics';
import { THEME_COLORS } from '@/lib/themeColors';

const COLORS = [
  THEME_COLORS.brandPrimary,
  THEME_COLORS.brandAccent,
  '#a78bfa',
  '#34d399',
  '#f59e0b',
  '#f87171',
];
const PRIOR_COLORS = ['#6b4fff', '#5be0ff', '#c4b5fd', '#6ee7b7', '#fcd34d', '#fca5a5'];

interface TicketTypeBreakdownWithPrior extends TicketTypeBreakdown {
  priorRevenue?: number;
}

interface Props {
  data: TicketTypeBreakdownWithPrior[];
}

interface TooltipPayload {
  name: string;
  payload: TicketTypeBreakdownWithPrior & {
    percentage: number;
    priorPercentage?: number;
  };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload?.length) return null;
  const { name, payload: item } = payload[0];
  return (
    <div className="rounded bg-[#1a2040] border border-brand-primary px-3 py-2 text-xs text-brand-accent">
      <p className="font-semibold">{name}</p>
      <p>
        Current: ₦ {item.revenue.toLocaleString('en-NG')} ({item.percentage}%)
      </p>
      {item.priorRevenue != null && (
        <p className="text-gray-400">
          Prior: ₦ {item.priorRevenue.toLocaleString('en-NG')} (
          {item.priorPercentage ?? 0}%)
        </p>
      )}
    </div>
  );
}

export function RevenueByTicketTypeChart({ data }: Props) {
  const [showPrior, setShowPrior] = useState(false);
  const hasPriorData = data.some((d) => d.priorRevenue != null);

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalPriorRevenue = data.reduce((s, d) => s + (d.priorRevenue ?? 0), 0);

  const chartData = data.map((d) => ({
    ...d,
    name: d.type,
    value: showPrior && d.priorRevenue != null ? d.priorRevenue : d.revenue,
    percentage: totalRevenue > 0 ? Math.round((d.revenue / totalRevenue) * 100) : 0,
    priorPercentage:
      totalPriorRevenue > 0
        ? Math.round(((d.priorRevenue ?? 0) / totalPriorRevenue) * 100)
        : 0,
  }));

  const activeColors = showPrior ? PRIOR_COLORS : COLORS;

  return (
    <div>
      {hasPriorData && (
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPrior(false)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              !showPrior
                ? 'bg-brand-primary text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            This period
          </button>
          <button
            type="button"
            onClick={() => setShowPrior(true)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              showPrior
                ? 'bg-brand-primary text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            vs previous
          </button>
        </div>
      )}

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
              <Cell key={i} fill={activeColors[i % activeColors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value, entry) => {
              const item = entry.payload as (typeof chartData)[0];
              return (
                <span className="text-xs text-brand-accent">
                  {value} — ₦ {item.revenue.toLocaleString('en-NG')} ({item.percentage}%)
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {showPrior && (
        <p className="mt-2 text-center text-[10px] text-gray-500">
          Showing prior period data — fetched via <code>compareTo</code> query param
        </p>
      )}
    </div>
  );
}
