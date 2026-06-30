"use client";

import dynamic from "next/dynamic";
import type { Demographics } from "@/hooks/useOrganizerAnalytics";

interface Props {
  demographics: Demographics;
}

// Lazy-load the map so it never SSR-crashes
const GeoHeatmap = dynamic(() => import("./GeoHeatmap"), {
  ssr: false,
  loading: () => <div className="h-[300px] animate-pulse rounded-xl bg-white/5" />,
});

function DemoGroup({ title, items }: { title: string; items: { label: string; count: number; percentage: number }[] }) {
  return (
    <div className="rounded-lg bg-white/5 p-4">
      <p className="mb-3 text-xs font-semibold uppercase text-[#21D4FF]">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-xs text-[#21D4FF]">
            <span className="truncate">{item.label}</span>
            <span className="ml-2 shrink-0 font-semibold text-[#4D21FF]">
              {item.count.toLocaleString()} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DemographicsSection({ demographics }: Props) {
  const hasData =
    demographics.region.length > 0 ||
    demographics.deviceType.length > 0 ||
    demographics.referralSource.length > 0;

  if (!hasData) return null;

  return (
    <section aria-label="Demographic breakdown">
      <p className="mb-4 text-sm font-semibold uppercase text-[#21D4FF]">Audience Demographics</p>

      {/* Geographic heatmap — shown when region data exists */}
      {demographics.region.length > 0 ? (
        <div className="mb-6">
          <GeoHeatmap regions={demographics.region} />
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demographics.region.length > 0 && (
          <DemoGroup title="Region" items={demographics.region} />
        )}
        {demographics.deviceType.length > 0 && (
          <DemoGroup title="Device Type" items={demographics.deviceType} />
        )}
        {demographics.referralSource.length > 0 && (
          <DemoGroup title="Referral Source" items={demographics.referralSource} />
        )}
      </div>
    </section>
  );
}
