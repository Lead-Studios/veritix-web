'use client';

import { useMemo } from 'react';
import { DateRange } from '@/components/analytics/date-range';
import { RevenueChart } from '@/components/dashboard/charts/RevenueChart';
import { PerformanceChart } from '@/components/dashboard/charts/PerformanceChart';
import { useOrganizerAnalytics } from '@/hooks/useOrganizerAnalytics';

function formatCurrency(n: number) {
  return `₦ ${n.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />;
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-1">
      <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
      No data for selected range
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, loading, error } = useOrganizerAnalytics();

  const revenueData = useMemo(
    () => data?.revenue.map((d) => ({ month: d.day, revenue: d.revenue })) ?? [],
    [data]
  );

  const performanceData = useMemo(
    () => data?.performance.map((d) => ({ month: d.day, value: d.value })) ?? [],
    [data]
  );

  return (
    <div className="min-h-screen bg-[#101428] text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-gray-400 text-sm mt-1">Organizer metrics and revenue overview</p>
          </div>
          <DateRange />
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-900/20 px-6 py-5 text-red-300 text-sm">
            Failed to load analytics: {error}
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? (
            <>
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </>
          ) : (
            <>
              <StatCard
                label="Total Earned"
                value={formatCurrency(data?.totalEarned ?? 0)}
                sub="All-time revenue"
              />
              <StatCard
                label="Payouts Queued"
                value={formatCurrency(data?.payoutsQueued ?? 0)}
                sub={`Next settlement: ${data?.nextSettlementDays ?? '—'} days`}
              />
              <StatCard
                label="Check-ins"
                value={data?.checkInsLive ? 'Live' : 'Inactive'}
                sub={
                  data?.checkInsLive
                    ? `Doors open in ${data.doorsOpenInMinutes}m`
                    : 'No active event'
                }
                highlight={data?.checkInsLive}
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue chart */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#21D4FF]">
              Revenue
            </h2>
            {loading ? (
              <Skeleton className="h-48" />
            ) : revenueData.length > 0 ? (
              <RevenueChart data={revenueData} />
            ) : (
              <EmptyChart />
            )}
          </div>

          {/* Performance chart */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#21D4FF]">
              Ticket Sales / Attendance
            </h2>
            {loading ? (
              <Skeleton className="h-48" />
            ) : performanceData.length > 0 ? (
              <PerformanceChart data={performanceData} />
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
