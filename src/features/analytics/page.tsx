'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RevenueChart } from '@/components/dashboard/charts/RevenueChart';
import { PerformanceChart } from '@/components/dashboard/charts/PerformanceChart';
import { useOrganizerAnalytics } from '@/hooks/useOrganizerAnalytics';

// ─── Types ────────────────────────────────────────────────────────────────────
type Preset = '7d' | '30d' | '90d' | 'all';

const PRESETS: { label: string; value: Preset }[] = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: 'All time', value: 'all' },
];

function formatCurrency(n: number) {
  return `₦ ${n.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

// ─── Date-range picker ────────────────────────────────────────────────────────
function DateRangePicker() {
  const router = useRouter();
  const params = useSearchParams();
  const preset = (params.get('range') as Preset) ?? '30d';
  const from = params.get('from') ?? '';
  const to = params.get('to') ?? '';

  function setPreset(value: Preset) {
    const sp = new URLSearchParams(params.toString());
    sp.set('range', value);
    sp.delete('from');
    sp.delete('to');
    router.replace(`?${sp.toString()}`);
  }

  function setCustom(key: 'from' | 'to', value: string) {
    const sp = new URLSearchParams(params.toString());
    sp.set(key, value);
    sp.set('range', 'custom' as Preset);
    router.replace(`?${sp.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Preset buttons */}
      <div className="flex rounded-xl overflow-hidden border border-white/10">
        {PRESETS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setPreset(value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              preset === value
                ? 'bg-[#4D21FF] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Custom date inputs */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <input
          type="date"
          value={from}
          onChange={(e) => setCustom('from', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4D21FF] [color-scheme:dark]"
        />
        <span>–</span>
        <input
          type="date"
          value={to}
          onChange={(e) => setCustom('to', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4D21FF] [color-scheme:dark]"
        />
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
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
          <DateRangePicker />
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
