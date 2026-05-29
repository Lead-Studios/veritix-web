'use client'

import { useRouter } from 'next/navigation'
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
import { TicketTypeChart } from '@/components/dashboard/charts/TicketTypeChart'
import { DemographicsSection } from '@/components/dashboard/DemographicsSection'
import { useOrganizerAnalytics } from '@/hooks/useOrganizerAnalytics'
import { exportAnalyticsCsv } from '@/lib/exportAnalyticsCsv'

function formatCurrency(n: number) {
  return `₦ ${n.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/10 ${className}`} />
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-4">
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-48" />
          <SkeletonBlock className="h-20" />
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { data, loading } = useOrganizerAnalytics()
  const router = useRouter()

  const hasEvents = !loading && (data?.totalEvents ?? 0) > 0
  const hasData = !loading && data !== null

  const revenueData = data?.revenue.map((d) => ({ month: d.day, revenue: d.revenue })) ?? []
  const barData = data?.performance.map((d) => ({ month: d.day, value: d.value })) ?? []
  const totalEarned = data?.totalEarned ?? 0
  const payoutsQueued = data?.payoutsQueued ?? 0
  const nextSettlementDays = data?.nextSettlementDays ?? 0

  const eventImages = data?.events?.slice(0, 4).map((e) => ({
    src: e.coverImage ?? null,
    alt: e.name,
  })) ?? []

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

          {/* Loading skeleton */}
          {loading && <DashboardSkeleton />}

          {/* Empty state — no events yet */}
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

          {/* Dashboard grid — only shown when events exist */}
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
                  <p className="mt-4 text-xs text-[#21D4FF]">Trending by 18.6% in the past week ↗️</p>
                </Card>

                <Card>
                  <StatDisplay
                    label="Payouts queued"
                    value={formatCurrency(payoutsQueued)}
                    detail={`Next settlement: ${nextSettlementDays} days`}
                  />
                </Card>
              </ScrollColumn>

              {/* Middle Column - Attendees */}
              <ScrollColumn animationClass="animate-scroll-down-once" className="gap-0">
                <Card>
                  <p className="text-xs uppercase text-[#21D4FF]">Latest check-ins</p>
                  <p className="text-sm text-[#21D4FF]">
                    {data?.checkInsLive
                      ? `Doors open in ${data.doorsOpenInMinutes}m`
                      : 'No active events'}
                  </p>
                  <div className="mt-3 text-xs text-[#4D21FF]">
                    {data?.checkInsLive ? 'Live updates enabled' : 'Updates paused'}
                  </div>
                </Card>

                <Card>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-[#4D21FF]">{formatCurrency(totalEarned)}</p>
                    <p className="text-xs text-[#21D4FF]">1.5k from last week</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {eventImages.map((image, index) => (
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
                      <p className="text-sm font-semibold text-[#21D4FF]">Trending by 38.2% ↗️</p>
                      <p className="text-xs text-[#21D4FF]">Jan 14 - Jan 20 2026</p>
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

          {!loading && data?.demographics && (
            <div className="mt-10">
              <DemographicsSection demographics={data.demographics} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
