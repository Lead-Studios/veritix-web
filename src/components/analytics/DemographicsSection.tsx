'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface AgeGroup {
  label: string; // e.g. "18–24"
  count: number;
}

export interface GenderBreakdown {
  label: string; // e.g. "Male" | "Female" | "Non-binary" | "Prefer not to say"
  count: number;
}

export interface LocationBreakdown {
  city: string;
  count: number;
}

export interface DemographicsData {
  ageGroups: AgeGroup[];
  genderBreakdown: GenderBreakdown[];
  topLocations: LocationBreakdown[];
}

interface DemographicsSectionProps {
  data: DemographicsData;
  isLoading?: boolean;
  className?: string;
}

const GENDER_COLORS = ['#7c3aed', '#a78bfa', '#c4b5fd', '#ede9fe'];
const AGE_COLOR = '#7c3aed';

function LoadingCard({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
      <p className="mb-3 text-sm font-medium text-gray-400">{label}</p>
      <div className="h-48 animate-pulse rounded-lg bg-gray-800" />
    </div>
  );
}

/**
 * Demographics section for the event analytics dashboard.
 * Renders age distribution (bar chart), gender breakdown (pie chart),
 * and top locations (horizontal bar chart).
 */
export const DemographicsSection: React.FC<DemographicsSectionProps> = ({
  data,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`grid gap-4 md:grid-cols-3 ${className}`}>
        <LoadingCard label="Age Distribution" />
        <LoadingCard label="Gender Breakdown" />
        <LoadingCard label="Top Locations" />
      </div>
    );
  }

  const totalGender = data.genderBreakdown.reduce((s, g) => s + g.count, 0);

  return (
    <section
      aria-label="Attendee demographics"
      className={`grid gap-4 md:grid-cols-3 ${className}`}
    >
      {/* Age Distribution */}
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
        <h3 className="mb-3 text-sm font-medium text-gray-400">Age Distribution</h3>
        <ResponsiveContainer width="100%" height={192}>
          <BarChart
            data={data.ageGroups}
            margin={{ top: 0, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #374151',
                background: '#111827',
                color: '#f9fafb',
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="count"
              name="Attendees"
              fill={AGE_COLOR}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gender Breakdown */}
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
        <h3 className="mb-3 text-sm font-medium text-gray-400">Gender Breakdown</h3>
        <ResponsiveContainer width="100%" height={192}>
          <PieChart>
            <Pie
              data={data.genderBreakdown}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="45%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
            >
              {data.genderBreakdown.map((_, i) => (
                <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} (${((value / totalGender) * 100).toFixed(1)}%)`,
                name,
              ]}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #374151',
                background: '#111827',
                color: '#f9fafb',
                fontSize: 12,
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: '#d1d5db' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Locations */}
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
        <h3 className="mb-3 text-sm font-medium text-gray-400">Top Locations</h3>
        <ResponsiveContainer width="100%" height={192}>
          <BarChart
            layout="vertical"
            data={data.topLocations}
            margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="city"
              type="category"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #374151',
                background: '#111827',
                color: '#f9fafb',
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" name="Attendees" fill="#a78bfa" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default DemographicsSection;
