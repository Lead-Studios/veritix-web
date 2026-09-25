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

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard label="Events" value={0} />
      <StatCard label="Tickets sold" value={0} />
      <StatCard label="Gross revenue" value="$0" />
      <StatCard label="Pending payouts" value="$0" />
    </div>
  );
}
