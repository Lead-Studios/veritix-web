'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/format';
import type { TierRow } from '@/components/analytics/tier-breakdown';

export interface TierBreakdownImplProps {
  rows: TierRow[];
  height: number;
}

function TierTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: TierRow }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;

  return (
    <div
      className="rounded-[var(--radius)] border p-3 text-sm shadow-md"
      style={{
        background: 'var(--popover)',
        borderColor: 'var(--border)',
        color: 'var(--popover-foreground)',
      }}
    >
      <p className="font-medium">{row.name}</p>
      <p style={{ color: 'var(--muted-foreground)' }}>
        {formatNumber(row.sold)} of {formatNumber(row.total)} sold (
        {Math.round(row.sellThrough * 100)}%)
      </p>
      <p style={{ color: 'var(--muted-foreground)' }}>
        {formatCurrency(row.revenueMinor, row.currency)} revenue
      </p>
    </div>
  );
}

/**
 * This module exists only to be loaded on demand — it is the one place
 * `recharts` is imported for the tier breakdown, so the chart library is not
 * in the dashboard's initial bundle. Import it through `TierBreakdown` in
 * `./tier-breakdown`, never directly, or the dynamic import stops splitting
 * anything.
 *
 * Each bar gets its own `Cell` fill and the legend is a fixed `payload` of
 * one entry per tier, rather than the single "Tickets sold" series entry
 * recharts would otherwise show — the tier name is always right there as
 * text next to its swatch, so the mapping never depends on distinguishing
 * bar colours alone.
 */
export function TierBreakdownImpl({ rows, height }: TierBreakdownImplProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12 }}
          stroke="var(--muted-foreground)"
        />
        <Tooltip content={<TierTooltip />} />
        <Legend
          payload={rows.map((row) => ({
            value: row.name,
            type: 'circle' as const,
            color: row.color,
          }))}
        />
        <Bar dataKey="sold" name="Tickets sold" radius={[4, 4, 0, 0]}>
          {rows.map((row) => (
            <Cell key={row.id} fill={row.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
