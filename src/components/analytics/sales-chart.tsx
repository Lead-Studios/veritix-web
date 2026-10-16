'use client';

import dynamic from 'next/dynamic';
import { CHART_HEIGHT, ChartSkeleton } from '@/components/analytics/chart-skeleton';
import type { SalesPoint } from '@/lib/analytics';

/** Shared with the fallback so the skeleton and the chart are the same height. */
export const SALES_CHART_HEIGHT = CHART_HEIGHT;

/**
 * Chart entry point.
 *
 * `recharts` is the single heaviest dependency in the app and the dashboard
 * should not pay for it before a chart is on screen, so the implementation is
 * pulled in with `next/dynamic` and `ssr: false`. Two consequences worth
 * knowing:
 *
 *   - The implementation must stay in its own module. A `dynamic()` call whose
 *     target is defined in this file would still be in this chunk, and nothing
 *     would be split. `sales-chart-impl` is the only place `recharts` is
 *     imported, which is what makes the split real.
 *   - `ssr: false` means the chart renders in the browser only. That is
 *     deliberate: the chart needs a measured width, and server-rendering it just
 *     ships markup that is thrown away on hydration.
 *
 * The height is pinned on the wrapper so the fallback occupies the same box and
 * the page does not shift when the bundle lands.
 */
const LazySalesChart = dynamic(
  () => import('@/components/analytics/sales-chart-impl').then((mod) => mod.SalesChartImpl),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={SALES_CHART_HEIGHT} />,
  },
);

export interface SalesChartProps {
  points: SalesPoint[];
  currency?: string;
  height?: number;
  className?: string;
}

export function SalesChart({
  points,
  currency = 'USD',
  height = SALES_CHART_HEIGHT,
  className,
}: SalesChartProps) {
  return (
    <div className={className} style={{ height }}>
      <LazySalesChart points={points} currency={currency} height={height} />
    </div>
  );
}
