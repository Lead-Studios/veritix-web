'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { HeroContent } from '@/components/dashboard/HeroContent';
import { CTAButton } from '@/components/dashboard/CTAButton';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ScrollColumn } from '@/components/dashboard/ScrollColumn';
import { Card, CardHeader, StatDisplay } from '@/components/dashboard/Card';
import { EventImage } from '@/components/dashboard/EventImage';
import { RevenueChart } from '@/components/dashboard/charts/RevenueChart';
import { PerformanceChart } from '@/components/dashboard/charts/PerformanceChart';
import { EmptyState } from '@/components/EmptyState';
import dynamic from 'next/dynamic';
import { DemographicsSection } from '@/components/dashboard/DemographicsSection';
import { DateRangePicker } from '@/components/dashboard/DateRangePicker';
import { PayoutHistory } from '@/components/dashboard/PayoutHistory';
import { LiveCheckInCard } from '@/components/dashboard/LiveCheckInCard';
import { ProjectedRevenueCard } from '@/components/dashboard/ProjectedRevenueCard';
import {
  useOrganizerAnalytics,
  selectRevenue,
  selectTicketBreakdown,
  selectLiveCheckIns,
} from '@/hooks/useOrganizerAnalytics';
import { ChartErrorBoundary } from '@/components/dashboard/ChartErrorBoundary';
import { exportAnalyticsCsv } from '@/lib/exportAnalyticsCsv';
import { Skeleton } from '@/components/ui/Skeleton';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const TicketTypeChart = dynamic(
  () =>
    import('@/components/dashboard/charts/TicketTypeChart').then(
      (m) => m.TicketTypeChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-[220px] animate-pulse rounded-xl bg-white/5" />,
  },
);

const RevenueByTicketTypeChart = dynamic(
  () =>
    import('@/components/dashboard/charts/RevenueByTicketTypeChart').then(
      (m) => m.RevenueByTicketTypeChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-[220px] animate-pulse rounded-xl bg-white/5" />,
  },
);

import { formatCurrency } from '@/lib/currencyFormat';

import { getUser } from '@/lib/auth';

function DashboardSkeleton() {
  return (
    <>
      <div role="status" aria-live="polite" className="sr-only">
        Loading dashboard data
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-48" />
            <Skeleton className="h-20" />
          </div>
        ))}
      </div>
    </>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-8 text-center space-y-4">
      <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
      <div>
        <p className="text-white font-semibold text-lg">Failed to load analytics</p>
        <p className="text-red-300/80 text-sm mt-1">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') ?? undefined;
  const to = params.get('to') ?? undefined;
  const user = getUser();
  const { data, isLoading, error, mutate } = useOrganizerAnalytics({
    organizerId: user?.id,
    from,
    to,
  });

  const revenue = useMemo(() => selectRevenue(data), [data]);
  const ticketBreakdown = useMemo(() => selectTicketBreakdown(data), [data]);
  const liveCheckIns = useMemo(() => selectLiveCheckIns(data), [data]);

  const hasEvents = !isLoading && !error && (data?.totalEvents ?? 0) > 0;
  const hasData = !isLoading && !error && data !== null;

  const [announcement, setAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) {
      setAnnouncement('Loading dashboard data');
    } else if (error) {
      setAnnouncement('Failed to load dashboard data. Please refresh.');
    } else if (hasData) {
      setAnnouncement('Dashboard data loaded');
    }
  }, [isLoading, error, hasData]);

  const { revenueTrend, trendText, trendColor } = useMemo(() => {
    const rev = revenue ?? [];
    if (rev.length < 14) {
      return {
        revenueTrend: null,
        trendText: 'Insufficient data for trend',
        trendColor: 'text-gray-500',
      };
    }
    const currentWeek = rev.slice(-7).reduce((sum, d) => sum + d.revenue, 0);
    const lastWeek = rev.slice(-14, -7).reduce((sum, d) => sum + d.revenue, 0);
    if (lastWeek === 0) {
      return {
        revenueTrend: null,
        trendText: 'Insufficient data for trend',
        trendColor: 'text-gray-500',
      };
    }
    const trend = ((currentWeek - lastWeek) / lastWeek) * 100;
    const text = `Trending by ${Math.abs(trend).toFixed(1)}% ${
      trend >= 0 ? '↗️' : '↘️'
    } this week`;
    const color = trend >= 0 ? 'text-emerald-400' : 'text-red-400';
    return { revenueTrend: trend, trendText: text, trendColor: color };
  }, [revenue]);

  const revenueData = revenue.map((d) => ({ month: d.day, revenue: d.revenue })) ?? [];
  const barData = data?.performance.map((d) => ({ month: d.day, value: d.value })) ?? [];
  const totalEarned = data?.totalEarned ?? 0;
  const payoutsQueued = data?.payoutsQueued ?? 0;
  const nextSettlementDays = data?.nextSettlementDays ?? 0;

  const eventImgs =
    data?.events?.slice(0, 4).map((e) => ({
      src: e.coverImage ?? null,
      alt: e.name,
    })) ?? [];

  const eventNames = data?.events?.map((e) => e.name) ?? [];
  const liveEvent = data?.events?.find(() => liveCheckIns.checkInsLive);

  const projectedRevenueInput = (() => {
    const events = data?.events ?? [];
    if (events.length === 0) return null;
    const totalRemaining = events.reduce((sum, e) => sum + (e.remainingTickets ?? 0), 0);
    const totalCapacity = events.reduce((sum, e) => sum + (e.totalTickets ?? 0), 0);
    if (totalRemaining === 0 || totalCapacity === 0) return null;
    const avgPrice =
      events.reduce((sum, e) => sum + (e.averageTicketPrice ?? 0), 0) / events.length;
    const soldSoFar = totalCapacity - totalRemaining;
    const sellThroughRate = soldSoFar / totalCapacity;
    return {
      remainingTickets: totalRemaining,
      averageTicketPrice: avgPrice,
      sellThroughRate,
      totalTickets: totalCapacity,
    };
  })();

  return (
    <div className="dark min-h-screen overflow-y-auto flex flex-col bg-surface-dark">
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
      <div className="relative px-4 py-8 sm:px-6 lg:px-8 flex-shrink-0">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex justify-center">
            <StatusBadge text="Tailored to all your event needs" />
          </div>

          <HeroContent
            title="Create, Manage and Control your events efficiently"
            subtitle="Streamline your event's processes with our easy-to-use dashboard"
          />

          <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4">
            <CTAButton href="/events/create" text="Get Started" variant="primary" />
            <CTAButton href="/events" text="Discover events" variant="secondary" />
            <button
              onClick={() => data && exportAnalyticsCsv(data)}
              disabled={!hasData}
              title={!hasData ? 'No analytics data available to export' : undefined}
              className="rounded-full border border-brand-primary px-6 py-2 text-sm font-semibold text-brand-accent transition hover:bg-brand-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export CSV
            </button>
          </div>

          <QuickActions eventNames={eventNames} />

          <div className="mb-6 flex justify-end">
            <DateRangePicker />
          </div>

          {/* Loading skeleton */}
          {isLoading && <DashboardSkeleton />}

          {/* Error state */}
          {!isLoading && error && <ErrorCard message={error} onRetry={mutate} />}

          {!isLoading && !error && !hasEvents && (
            <EmptyState
              title="No events yet"
              description="Create your first event to start seeing analytics, revenue, and performance data here."
              action={{
                label: 'Create your first event',
                onClick: () => router.push('/events/create'),
              }}
            />
          )}

          {!isLoading && !error && hasEvents && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:h-[500px]">
              {/* Left Column - Revenue */}
              <ScrollColumn animationClass="animate-scroll-up-once">
                <Card>
                  <CardHeader
                    title="Revenue"
                    subtitle="A quick look at earnings this week"
                    extraInfo="Weekly Summary"
                  />
                </Card>

                <Card>
                  <div className="mb-4">
                    <CardHeader title="Revenue" subtitle="Revenue for the past week" />
                  </div>
                  <div className="h-48 w-full min-h-[192px]">
                    <ChartErrorBoundary chartName="Revenue">
                      <RevenueChart data={revenueData} />
                    </ChartErrorBoundary>
                  </div>
                  <p className={`mt-4 text-xs ${trendColor}`}>{trendText}</p>
                </Card>

                <Card>
                  <StatDisplay
                    label="Payouts queued"
                    value={formatCurrency(payoutsQueued)}
                    detail={`Next settlement: ${nextSettlementDays} days`}
                  />
                </Card>

                {projectedRevenueInput && (
                  <ProjectedRevenueCard input={projectedRevenueInput} />
                )}
              </ScrollColumn>

              {/* Middle Column - Attendees / Check-ins */}
              <ScrollColumn animationClass="animate-scroll-down-once" className="gap-0">
                <Card>
                  <p className="text-xs uppercase text-brand-accent mb-2">
                    Latest check-ins
                  </p>
                  <LiveCheckInCard
                    eventId={liveEvent?.id ?? ''}
                    eventName={liveEvent?.name ?? ''}
                    isLive={liveCheckIns.checkInsLive}
                  />
                </Card>

                <Card>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-brand-primary">
                      {formatCurrency(totalEarned)}
                    </p>
                    {revenueTrend !== null ? (
                      <p className={`text-xs ${trendColor}`}>{trendText}</p>
                    ) : (
                      <p className="text-xs text-gray-500">Insufficient data</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {eventImgs.map((image, index) => (
                      <EventImage key={index} src={image.src} alt={image.alt} />
                    ))}
                  </div>
                </Card>
              </ScrollColumn>

              {/* Right Column - Performance */}
              <ScrollColumn animationClass="animate-scroll-up-once" className="gap-6">
                <Card className="rounded-lg">
                  <p className="text-xs uppercase text-brand-accent">Performance</p>
                  <p className="text-sm text-brand-accent">
                    Top-selling tickets this week
                  </p>
                  <div className="mt-3 text-xs text-brand-primary">
                    Updated 2 mins ago
                  </div>
                </Card>

                <Card className="rounded-lg">
                  <div className="mb-4 flex justify-between items-start">
                    <div>
                      <p className="text-xs uppercase text-brand-accent">Trending</p>
                      <p className={`text-sm font-semibold ${trendColor}`}>{trendText}</p>
                      <p className="text-xs text-brand-accent">Past 7 days</p>
                    </div>
                    <span className="text-sm font-semibold text-brand-primary">7d</span>
                  </div>
                  <div className="h-48 w-full min-h-[192px]">
                    <ChartErrorBoundary chartName="Performance">
                      <PerformanceChart data={barData} />
                    </ChartErrorBoundary>
                  </div>
                  <div className="mt-4 border-t pt-4 border-brand-primary">
                    <p className="text-xs font-semibold uppercase text-brand-accent">
                      Total Earned
                    </p>
                    <p className="text-xl font-bold text-brand-primary">
                      {formatCurrency(totalEarned)}
                    </p>
                    {revenueTrend !== null ? (
                      <p className={`text-xs ${trendColor}`}>{trendText}</p>
                    ) : (
                      <p className="text-xs text-gray-500">Insufficient data</p>
                    )}
                  </div>
                </Card>
              </ScrollColumn>
            </div>
          )}

          <div className="mt-8">
            <RecentActivity />
          </div>

          {!isLoading && !error && ticketBreakdown && ticketBreakdown.length > 0 && (
            <div className="mt-10">
              <Card>
                <CardHeader
                  title="Ticket Type Breakdown"
                  subtitle="Revenue and volume by ticket category"
                />
                <div className="mt-4">
                  <TicketTypeChart data={ticketBreakdown} />
                  <ChartErrorBoundary chartName="Ticket Type Breakdown">
                    <TicketTypeChart data={data.ticketBreakdown} />
                  </ChartErrorBoundary>
                </div>
              </Card>
            </div>
          )}

          {!isLoading && !error && ticketBreakdown && ticketBreakdown.length > 0 && (
            <div className="mt-10">
              <Card>
                <CardHeader
                  title="Revenue by Ticket Type"
                  subtitle="Which ticket categories drive the most revenue"
                />
                <div className="mt-4">
                  <RevenueByTicketTypeChart data={ticketBreakdown} />
                  <ChartErrorBoundary chartName="Revenue by Ticket Type">
                    <RevenueByTicketTypeChart data={data.ticketBreakdown} />
                  </ChartErrorBoundary>
                </div>
              </Card>
            </div>
          )}

          {!isLoading && !error && data?.demographics && (
            <div className="mt-10">
              <DemographicsSection demographics={data.demographics} />
            </div>
          )}

          {!isLoading && !error && hasEvents && (
            <div className="mt-10">
              <p className="mb-4 text-sm font-semibold uppercase text-brand-accent">
                Payout History
              </p>
              <PayoutHistory />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
