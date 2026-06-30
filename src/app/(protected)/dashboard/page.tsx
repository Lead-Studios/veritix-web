'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { HeroContent } from '@/components/dashboard/HeroContent'
import { CTAButton } from '@/components/dashboard/CTAButton'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { ScrollColumn } from '@/components/dashboard/ScrollColumn'
import { Card, CardHeader, StatDisplay } from '@/components/dashboard/Card'
import { EventImage } from '@/components/dashboard/EventImage'
import { RevenueChart } from '@/components/dashboard/charts/RevenueChart'
import { PerformanceChart } from '@/components/dashboard/charts/PerformanceChart'
import { EmptyState } from '@/components/EmptyState'
import dynamic from 'next/dynamic'
import { DemographicsSection } from '@/components/dashboard/DemographicsSection'
import { DateRangePicker } from '@/components/dashboard/DateRangePicker'
import { PayoutHistory } from '@/components/dashboard/PayoutHistory'
import { LiveCheckInCard } from '@/components/dashboard/LiveCheckInCard'
import { useOrganizerAnalytics } from '@/hooks/useOrganizerAnalytics'
import { exportAnalyticsCsv } from '@/lib/exportAnalyticsCsv'
import { Skeleton } from '@/components/ui/Skeleton'

const TicketTypeChart = dynamic(
  () => import('@/components/dashboard/charts/TicketTypeChart').then((m) => m.TicketTypeChart),
  { ssr: false, loading: () => <div className="h-[220px] animate-pulse rounded-xl bg-white/5" /> }
)

const RevenueByTicketTypeChart = dynamic(
  () => import('@/components/dashboard/charts/RevenueByTicketTypeChart').then((m) => m.RevenueByTicketTypeChart),
  { ssr: false, loading: () => <div className="h-[220px] animate-pulse rounded-xl bg-white/5" /> }
)

function formatCurrency(n: number) {
  return `₦ ${n.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-48" />
          <Skeleton className="h-20" />
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') ?? undefined
  const to = params.get('to') ?? undefined
  const { data, loading } = useOrganizerAnalytics({ from, to })

  const hasEvents = !loading && (data?.totalEvents ?? 0) > 0
  const hasData = !loading && data !== null

  const revenueData = data?.revenue.map((d) => ({ month: d.day, revenue: d.revenue })) ?? []
  const barData = data?.performance.map((d) => ({ month: d.day, value: d.value })) ?? []
  const totalEarned = data?.totalEarned ?? 0
  const payoutsQueued = data?.payoutsQueued ?? 0
  const nextSettlementDays = data?.nextSettlementDays ?? 0

  const revenueTrend = (() => {
    const rev = data?.revenue ?? []
    if (rev.length < 14) return null
    const currentWeek = rev.slice(-7).reduce((sum, d) => sum + d.revenue, 0)
    const lastWeek = rev.slice(-14, -7).reduce((sum, d) => sum + d.revenue, 0)
    if (lastWeek === 0) return null
    return ((currentWeek - lastWeek) / lastWeek) * 100
  })()

  const eventImages = data?.events?.slice(0, 4).map((e) => ({
    src: e.coverImage ?? null,
    alt: e.name,
  })) ?? [];

  const trendText = revenueTrend === null
    ? 'Insufficient data for trend'
    : `Trending by ${Math.abs(revenueTrend).toFixed(1)}% ${revenueTrend >= 0 ? '↗️' : '↘️'} this week`;
  const trendColor = revenueTrend === null ? 'text-gray-500' : revenueTrend >= 0 ? 'text-emerald-400' : 'text-red-400';
  const trendText = revenueTrend === null
    ? 'Insufficient data for trend'
    : `Trending by ${Math.abs(revenueTrend).toFixed(1)}% ${revenueTrend >= 0 ? '↗️' : '↘️'} this week`
  const trendColor = revenueTrend === null ? 'text-gray-500' : revenueTrend >= 0 ? 'text-emerald-400' : 'text-red-400'

  const eventImgs = data?.events?.slice(0, 4).map((e) => ({
    src: e.coverImage ?? null,
    alt: e.name,
  })) ?? []

  const liveEvent = data?.events?.find(() => data.checkInsLive)

  return (
    <div className="dark min-h-screen overflow-y-auto flex flex-col bg-[#101428]">
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
              title={!hasData ? "No analytics data available to export" : undefined}
              className="rounded-full border border-[#4D21FF] px-6 py-2 text-sm font-semibold text-[#21D4FF] transition hover:bg-[#4D21FF]/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export CSV
            </button>
          </div>

          <QuickActions />

          {/* Date range picker for filtering charts */}
          <div className="mb-6 flex justify-end">
            <DateRangePicker />
          </div>

          {/* Loading skeleton */}
          {loading && <DashboardSkeleton />}

          {!loading && !hasEvents && (
            <EmptyState
              title="No events yet"
              description="Create your first event to start seeing analytics, revenue, and performance data here."
              action={{
                label: 'Create your first event',
                onClick: () => router.push('/events/create'),
              }}
            />
          )}

          {!loading && hasEvents && (
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
                    <RevenueChart data={revenueData} />
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
              </ScrollColumn>

              {/* Middle Column - Attendees / Check-ins */}
              <ScrollColumn animationClass="animate-scroll-down-once" className="gap-0">
                <Card>
                  <p className="text-xs uppercase text-[#21D4FF] mb-2">Latest check-ins</p>
                  <LiveCheckInCard
                    eventId={liveEvent?.id ?? ''}
                    eventName={liveEvent?.name ?? ''}
                    isLive={data?.checkInsLive ?? false}
                  />
                </Card>

                <Card>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-[#4D21FF]">{formatCurrency(totalEarned)}</p>
                    <p className="text-xs text-[#21D4FF]">1.5k from last week</p>
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
                  <p className="text-xs uppercase text-[#21D4FF]">Performance</p>
                  <p className="text-sm text-[#21D4FF]">Top-selling tickets this week</p>
                  <div className="mt-3 text-xs text-[#4D21FF]">Updated 2 mins ago</div>
                </Card>

                <Card className="rounded-lg">
                  <div className="mb-4 flex justify-between items-start">
                    <div>
                      <p className="text-xs uppercase text-[#21D4FF]">Trending</p>
                      <p className={`text-sm font-semibold ${trendColor}`}>{trendText}</p>
                      <p className="text-xs text-[#21D4FF]">Past 7 days</p>
                    </div>
                    <span className="text-sm font-semibold text-[#4D21FF]">7d</span>
                  </div>
                  <div className="h-48 w-full min-h-[192px]">
                    <PerformanceChart data={barData} />
                  </div>
                  <div className="mt-4 border-t pt-4 border-[#4D21FF]">
                    <p className="text-xs font-semibold uppercase text-[#21D4FF]">Total Earned</p>
                    <p className="text-xl font-bold text-[#4D21FF]">{formatCurrency(totalEarned)}</p>
                    <p className="text-xs text-[#21D4FF]">Total amount sent to your bank account</p>
                  </div>
                </Card>
              </ScrollColumn>
            </div>
          )}

          <div className="mt-8">
            <RecentActivity />
          </div>

          {/* Ticket Type Breakdown */}
          {!loading && data?.ticketBreakdown && data.ticketBreakdown.length > 0 && (
            <div className="mt-10">
              <Card>
                <CardHeader title="Ticket Type Breakdown" subtitle="Revenue and volume by ticket category" />
                <div className="mt-4">
                  <TicketTypeChart data={data.ticketBreakdown} />
                </div>
              </Card>
            </div>
          )}

          {/* Revenue by Ticket Type */}
          {!loading && data?.ticketBreakdown && data.ticketBreakdown.length > 0 && (
            <div className="mt-10">
              <Card>
                <CardHeader title="Revenue by Ticket Type" subtitle="Which ticket categories drive the most revenue" />
                <div className="mt-4">
                  <RevenueByTicketTypeChart data={data.ticketBreakdown} />
                </div>
              </Card>
            </div>
          )}

          {/* Demographics */}
          {!loading && data?.demographics && (
            <div className="mt-10">
              <DemographicsSection demographics={data.demographics} />
            </div>
          )}

          {/* Payout History */}
          {!loading && hasEvents && (
            <div className="mt-10">
              <p className="mb-4 text-sm font-semibold uppercase text-[#21D4FF]">Payout History</p>
              <PayoutHistory />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
