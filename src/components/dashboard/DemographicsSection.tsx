'use client';

import dynamic from 'next/dynamic';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Demographics } from '@/hooks/useOrganizerAnalytics';
import { THEME_COLORS } from '@/lib/themeColors';

const PIE_COLORS = [
  THEME_COLORS.brandPrimary,
  THEME_COLORS.brandAccent,
  '#a78bfa',
  '#34d399',
  '#f59e0b',
  '#f87171',
];

// Lazy-load the map so it never SSR-crashes
const GeoHeatmap = dynamic(() => import('./GeoHeatmap'), {
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
      <p className="mb-3 text-xs font-semibold uppercase text-brand-accent">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-xs text-brand-accent"
          >
            <span className="truncate">{item.label}</span>
            <span className="ml-2 shrink-0 font-semibold text-brand-primary">
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
    <div
      className="rounded-lg bg-white/5 p-4"
      role="img"
      aria-label={`${title} pie chart`}
    >
      <p className="mb-3 text-xs font-semibold uppercase text-brand-accent">{title}</p>
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
              background: THEME_COLORS.surfaceDark,
              border: '1px solid rgba(77,33,255,0.4)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 12,
            }}
            formatter={(
              value: number,
              _name: string,
              props: { payload?: { percentage?: number } },
            ) => [
              `${value.toLocaleString()} (${props.payload?.percentage ?? 0}%)`,
              'Attendees',
            ]}
          />
          <Legend
            formatter={(value: string) => (
              <span className="text-xs text-brand-accent">{value}</span>
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

export function DemographicsSection({ demographics }: Props) {
  const hasData =
    demographics.region.length > 0 ||
    demographics.deviceType.length > 0 ||
    demographics.referralSource.length > 0;

  if (!hasData) return null;

  return (
    <section aria-label="Demographic breakdown">
      <p className="mb-4 text-sm font-semibold uppercase text-brand-accent">
        Audience Demographics
      </p>

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
            <PieChartSection
              title="Referral Source"
              items={demographics.referralSource}
            />
          </div>
        )}
      </div>
    </section>
  );
}
