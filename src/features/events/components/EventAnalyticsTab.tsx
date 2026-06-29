"use client";

import useSWR from "swr";
import { fetchEventAnalytics } from "@/lib/eventAnalytics";
import { SalesVelocityChart } from "@/components/dashboard/charts/SalesVelocityChart";
import { Skeleton } from "@/components/ui/Skeleton";

interface EventAnalyticsTabProps {
  eventId: string;
}

export default function EventAnalyticsTab({ eventId }: EventAnalyticsTabProps) {
  const { data, error, isLoading } = useSWR(
    eventId ? `analytics-${eventId}` : null,
    () => fetchEventAnalytics(eventId),
    { revalidateOnFocus: false },
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40 rounded-xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-red-400">
        {error?.message ?? "Failed to load analytics."}
      </p>
    );
  }

  const velocityData = data.salesByDay.map((d) => ({
    date: d.date,
    ticketsSold: d.count,
  }));

  const scanRate =
    data.totalSold > 0 ? Math.round((data.checkIns / data.totalSold) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Tickets Sold", value: data.totalSold },
          { label: "Capacity", value: data.totalCapacity },
          { label: "Revenue", value: `$${data.revenue.toLocaleString()}` },
          { label: "Scan Rate", value: `${scanRate}%` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-[#4D21FF]/30 bg-[#0a0f24] p-4 text-center"
          >
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="mt-1 text-xs text-[#21D4FF]/70">{label}</p>
          </div>
        ))}
      </div>

      {/* Sales velocity chart */}
      <SalesVelocityChart data={velocityData} />

      {/* Ticket mix */}
      {data.ticketMix.length > 0 && (
        <div className="rounded-2xl border border-[#4D21FF]/30 bg-[#0a0f24] p-6">
          <h3 className="mb-4 text-base font-semibold text-white">Ticket Mix</h3>
          <ul className="space-y-3">
            {data.ticketMix.map((t) => {
              const pct = t.total > 0 ? (t.sold / t.total) * 100 : 0;
              return (
                <li key={t.type}>
                  <div className="mb-1 flex justify-between text-xs text-[#21D4FF]/80">
                    <span>{t.type}</span>
                    <span>{t.sold} / {t.total}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#4D21FF] to-[#21D4FF]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
