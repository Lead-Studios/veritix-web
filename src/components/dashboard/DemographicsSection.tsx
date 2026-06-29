import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Demographics } from "@/hooks/useOrganizerAnalytics";

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

const BAR_COLORS = ["#4D21FF", "#21D4FF", "#7c85ff", "#39c6ff", "#6f7bff", "#21d4aa"];

function ReferralSourceChart({
  items,
}: {
  items: { label: string; count: number; percentage: number }[];
}) {
  const data = items.map((item) => ({ name: item.label, count: item.count, pct: item.percentage }));

  return (
    <div className="rounded-lg bg-white/5 p-4">
      <p className="mb-3 text-xs font-semibold uppercase text-[#21D4FF]">How did they find you?</p>
      <ResponsiveContainer width="100%" height={items.length * 36 + 16}>
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
              <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demographics.region.length > 0 && (
          <DemoGroup title="Region" items={demographics.region} />
        )}
        {demographics.deviceType.length > 0 && (
          <DemoGroup title="Device Type" items={demographics.deviceType} />
        )}
        {demographics.referralSource.length > 0 && (
          <div className="sm:col-span-2 lg:col-span-1">
            <ReferralSourceChart items={demographics.referralSource} />
          </div>
        )}
      </div>
    </section>
  );
}
