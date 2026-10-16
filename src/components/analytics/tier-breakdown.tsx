'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { CHART_HEIGHT, ChartSkeleton } from '@/components/analytics/chart-skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { TicketTier } from '@/types';

/**
 * Tickets sold and revenue per tier, so an organizer can see which tier is
 * actually selling.
 *
 * The chart legend and the table beneath it both carry each tier's name as
 * text next to its colour swatch, so the breakdown reads correctly even for
 * someone who can't distinguish the bar colours. `recharts` is loaded on
 * demand from `./tier-breakdown-impl`, the same split `SalesChart` uses in
 * `./sales-chart`, so this card's initial bundle doesn't pay for the chart
 * library before it's on screen.
 */

export interface TierBreakdownProps {
  tiers: TicketTier[];
  className?: string;
}

export interface TierRow {
  id: string;
  name: string;
  sold: number;
  total: number;
  revenueMinor: number;
  currency: string;
  sellThrough: number;
  color: string;
}

/** Fixed, distinct hues so a tier keeps the same colour across renders. */
const TIER_COLORS = [
  'hsl(252 100% 66%)',
  'hsl(142 66% 45%)',
  'hsl(38 92% 50%)',
  'hsl(199 89% 48%)',
  'hsl(330 81% 60%)',
  'hsl(0 72% 58%)',
];

function buildRows(tiers: TicketTier[]): TierRow[] {
  return tiers.map((tier, index) => ({
    id: tier.id,
    name: tier.name,
    sold: tier.quantitySold,
    total: tier.quantityTotal,
    revenueMinor: tier.priceMinor * tier.quantitySold,
    currency: tier.currency,
    sellThrough: tier.quantityTotal > 0 ? tier.quantitySold / tier.quantityTotal : 0,
    color: TIER_COLORS[index % TIER_COLORS.length],
  }));
}

const LazyTierBreakdownChart = dynamic(
  () =>
    import('@/components/analytics/tier-breakdown-impl').then(
      (mod) => mod.TierBreakdownImpl,
    ),
  { ssr: false, loading: () => <ChartSkeleton height={CHART_HEIGHT} /> },
);

export function TierBreakdown({ tiers, className }: TierBreakdownProps) {
  const rows = React.useMemo(() => buildRows(tiers), [tiers]);

  if (rows.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Tier breakdown</CardTitle>
          <CardDescription>No ticket tiers yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Tier breakdown</CardTitle>
        <CardDescription>Tickets sold and revenue per tier.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          style={{ height: CHART_HEIGHT }}
          role="img"
          aria-label="Bar chart of tickets sold per tier"
        >
          <LazyTierBreakdownChart rows={rows} height={CHART_HEIGHT} />
        </div>

        {/* Plain-text table: the full breakdown without relying on the chart at all. */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Tier</th>
                <th className="py-2 pr-4 font-medium">Sold</th>
                <th className="py-2 pr-4 font-medium">Sell-through</th>
                <th className="py-2 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={cn('inline-block size-2.5 shrink-0 rounded-full')}
                        style={{ backgroundColor: row.color }}
                      />
                      {row.name}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    {formatNumber(row.sold)} / {formatNumber(row.total)}
                  </td>
                  <td className="py-2 pr-4">{Math.round(row.sellThrough * 100)}%</td>
                  <td className="py-2">
                    {formatCurrency(row.revenueMinor, row.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
