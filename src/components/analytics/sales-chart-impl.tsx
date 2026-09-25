'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_HEIGHT } from '@/components/analytics/chart-skeleton';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';
import type { SalesPoint } from '@/lib/analytics';

export interface SalesChartImplProps {
  points: SalesPoint[];
  currency?: string;
  height?: number;
}

/**
 * Tickets sold per day, with gross revenue on a second axis.
 *
 * This module exists only to be loaded on demand — it is the one place
 * `recharts` is imported, so the chart library is not in the dashboard's
 * initial bundle. Import it through `SalesChart` in `./sales-chart`, never
 * directly, or the dynamic import stops splitting anything.
 */
export function SalesChartImpl({ points, currency = 'USD', height = CHART_HEIGHT }: SalesChartImplProps) {
  if (points.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center rounded-[var(--radius)] border border-dashed text-sm text-muted-foreground"
      >
        No sales in this range
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => formatDate(`${value}T00:00:00.000Z`)}
          tick={{ fontSize: 12 }}
          stroke="var(--muted-foreground)"
          minTickGap={24}
        />
        <YAxis
          yAxisId="sold"
          tick={{ fontSize: 12 }}
          stroke="var(--muted-foreground)"
          allowDecimals={false}
        />
        <YAxis
          yAxisId="gross"
          orientation="right"
          tickFormatter={(value: number) => formatCurrency(value, currency)}
          tick={{ fontSize: 12 }}
          stroke="var(--muted-foreground)"
          width={72}
        />
        <Tooltip
          labelFormatter={(value) => formatDate(`${String(value)}T00:00:00.000Z`)}
          formatter={(value, name) => [
            name === 'grossMinor' ? formatCurrency(Number(value), currency) : formatNumber(Number(value)),
            name === 'grossMinor' ? 'Gross revenue' : 'Tickets sold',
          ]}
          contentStyle={{
            background: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--popover-foreground)',
          }}
        />
        <Area
          yAxisId="sold"
          type="monotone"
          dataKey="ticketsSold"
          name="Tickets sold"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#salesFill)"
        />
        <Area
          yAxisId="gross"
          type="monotone"
          dataKey="grossMinor"
          name="Gross revenue"
          stroke="var(--muted-foreground)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          fill="none"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
