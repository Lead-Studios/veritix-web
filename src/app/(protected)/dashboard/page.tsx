'use client'

import { StatusBadge } from '@/src/components/dashboard/StatusBadge'
import { HeroContent } from '@/src/components/dashboard/HeroContent'
import { CTAButton } from '@/src/components/dashboard/CTAButton'
import { ScrollColumn } from '@/src/components/dashboard/ScrollColumn'
import { Card, CardHeader, StatDisplay } from '@/src/components/dashboard/Card'
import { EventImage } from '@/src/components/dashboard/EventImage'
import { RevenueChart } from '@/src/components/dashboard/charts/RevenueChart'
import { PerformanceChart } from '@/src/components/dashboard/charts/PerformanceChart'
import { revenueData, barData, eventImages } from '@/src/components/dashboard/constants'

export default function DashboardPage() {
  return (
    <div className="dark min-h-screen md:h-screen overflow-y-auto md:overflow-hidden flex flex-col bg-[#101428]">
      <div className="relative px-4 py-12 sm:px-6 lg:px-8 flex-shrink-0">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex justify-center">
            <StatusBadge text="Tailored to all your event needs" />
          </div>

          <HeroContent
            title="Create, Manage and Control your events efficiently"
            subtitle="Streamline your event's processes with our easy-to-use dashboard"
          />

          <div className="mb-12 flex flex-col sm:flex-row justify-center gap-4">
            <CTAButton href="/events/create" text="Get Started" variant="primary" />
            <CTAButton href="/events" text="Discover events" variant="secondary" />
          </div>

          <div className="grid gap-1 lg:grid-cols-3 h-[500px] gap-4 lg:gap-1">
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
                  <CardHeader
                    title="Revenue"
                    subtitle="Revenue for the past week"
                  />
                </div>
                <div className="h-48 w-full min-h-[192px]">
                  <RevenueChart data={revenueData} />
                </div>
                <p className="mt-4 text-xs text-[#21D4FF]">
                  Trending by 18.6% in the past week ↗️
                </p>
              </Card>

              <Card>
                <StatDisplay
                  label="Payouts queued"
                  value="₦ 320,450"
                  detail="Next settlement: 2 days"
                />
              </Card>
            </ScrollColumn>

            {/* Middle Column - Attendees */}
            <ScrollColumn animationClass="animate-scroll-down-once" className="gap-0">
              <Card>
                <p className="text-xs uppercase text-[#21D4FF]">Latest check-ins</p>
                <p className="text-sm text-[#21D4FF]">Doors open in 2h</p>
                <div className="mt-3 text-xs text-[#4D21FF]">Live updates enabled</div>
              </Card>

              <Card>
                <div className="mb-4">
                  <p className="text-2xl font-bold text-[#4D21FF]">₦1,057,884.78</p>
                  <p className="text-xs text-[#21D4FF]">1.5k from last week</p>
                </div>
                <div className="grid grid-cols-2 gap-3 h-full">
                  {eventImages.map((image, index) => (
                    <EventImage key={index} {...image} />
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
                  <p className="text-xl font-bold text-[#4D21FF]">₦1,200,000</p>
                  <p className="text-xs text-[#21D4FF]">Total amount sent to your bank account</p>
                </div>
              </Card>
            </ScrollColumn>
          </div>
        </div>
      </div>
    </div>
  )
}
