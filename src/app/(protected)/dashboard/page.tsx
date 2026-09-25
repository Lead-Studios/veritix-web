'use client';

import * as React from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardOverviewPage() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // The page had no heading, so a screen reader landing on the dashboard found
  // four unlabelled values and nothing to orient by.
  const heading = <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>;

  if (loading) {
    return (
      <div>
        {heading}
        {/* role="status" so the loading state is announced rather than being
            a silent block of grey rectangles. */}
        <p role="status" className="sr-only">
          Loading your dashboard
        </p>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {heading}
      {/* The grid is labelled so the numbers are not announced as one
          undifferentiated list. */}
      <dl className="grid grid-cols-2 gap-4" aria-label="Organizer summary">
        <StatCard label="Events" value={0} />
        <StatCard label="Tickets sold" value={0} />
        <StatCard label="Gross revenue" value="$0" />
        <StatCard label="Pending payouts" value="$0" />
      </dl>
    </div>
  );
}
