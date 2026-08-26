"use client";

import dynamic from "next/dynamic";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Demographics } from "@/hooks/useOrganizerAnalytics";

const PIE_COLORS = ["#4D21FF", "#21D4FF", "#a78bfa", "#34d399", "#f59e0b", "#f87171"];

// Lazy-load the map so it never SSR-crashes
const GeoHeatmap = dynamic(() => import("./GeoHeatmap"), {
  ssr: false,
  loading: () => <div className="h-[300px] animate-pulse rounded-xl bg-white/5" />,
});

interface Props {
  demographics: Demographics;
}

function DemoGroup({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number; percentage: number }[];
}) {
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

function PieChartSection({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number; percentage: number }[];
}) {
  const data = items.map((item) => ({
    name: item.label,
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <div className="rounded-lg bg-white/5 p-4" role="img" aria-label={`${title} pie chart`}>
      <p className="mb-3 text-xs font-semibold uppercase text-[#21D4FF]">{title}</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#101428",
              border: "1px solid rgba(77,33,255,0.4)",
              borderRadius: 8,
              color: "#fff",
              fontSize: 12,
            }}
            formatter={(value: number, _name: string, props: { payload?: { percentage?: number } }) => [
              `${value.toLocaleString()} (${props.payload?.percentage ?? 0}%)`,
              "Attendees",
            ]}
          />
          <Legend
            formatter={(value: string) => (
              <span className="text-xs text-[#21D4FF]">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Accessible text alternative */}
      <table className="sr-only" aria-label={`${title} data`}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.label}>
              <td>{item.label}</td>
              <td>{item.count}</td>
              <td>{item.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const BAR_COLORS = ["#4D21FF", "#21D4FF", "#7c85ff", "#39c6ff", "#6f7bff", "#21d4aa"];

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer as BarResponsiveContainer,
  Cell as BarCell,
} from "recharts";

function ReferralSourceChart({
  items,
}: {
  items: { label: string; count: number; percentage: number }[];
}) {
  const data = items.map((item) => ({ name: item.label, count: item.count, pct: item.percentage }));

  return (
    <div className="rounded-lg bg-white/5 p-4">
      <p className="mb-3 text-xs font-semibold uppercase text-[#21D4FF]">How did they find you?</p>
      <BarResponsiveContainer width="100%" height={items.length * 36 + 16}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 48, left: 8, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={90}
            tick={{ fill: "#21D4FF", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{ background: "#101428", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
            formatter={(value: number, _name: string, props: { payload?: { pct?: number } }) =>
              [`${value.toLocaleString()} (${props.payload?.pct ?? 0}%)`, "Attendees"]
            }
            labelStyle={{ color: "#21D4FF", fontSize: 11 }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} label={{ position: "right", fill: "#4D21FF", fontSize: 11, formatter: (v: number) => v.toLocaleString() }}>
            {data.map((_entry, index) => (
              <BarCell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </BarResponsiveContainer>
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
          <PieChartSection title="Device Type" items={demographics.deviceType} />
        )}
        {demographics.referralSource.length > 0 && (
          <div className="sm:col-span-2 lg:col-span-1">
            <PieChartSection title="Referral Source" items={demographics.referralSource} />
          </div>
        )}
      </div>
    </section>
  );
}
