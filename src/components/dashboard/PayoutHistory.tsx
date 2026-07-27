'use client';

import React, { useEffect, useState } from 'react';
import { PayoutRecord, fetchOrganizerPayouts } from '@/lib/api/payouts';

interface PayoutHistoryProps {
  organizerId: string;
}

export function PayoutHistory({ organizerId }: PayoutHistoryProps) {
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPayouts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOrganizerPayouts(organizerId);
        if (isMounted) {
          setPayouts(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'An error occurred while loading payouts.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (organizerId) {
      loadPayouts();
    }

    return () => {
      isMounted = false;
    };
  }, [organizerId]);

  if (loading) {
    return <PayoutHistorySkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (payouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          No payout history found
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          Payouts will appear here once transactions are processed.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="min-w-full divide-y divide-gray-200 text-left text-xs dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
              Date
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
              Amount
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
              Transaction Ref
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
          {payouts.map((payout) => (
            <tr key={payout.id}>
              <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-gray-100">
                {new Date(payout.date).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                {payout.currency} {payout.amount.toLocaleString()}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <StatusBadge status={payout.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                {payout.transactionRef}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: PayoutRecord['status'] }) {
  const styles = {
    Settled: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function PayoutHistorySkeleton() {
  return (
    <div data-testid="payout-skeleton" className="animate-pulse space-y-3">
      <div className="h-8 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="h-10 rounded bg-gray-100 dark:bg-gray-900" />
      <div className="h-10 rounded bg-gray-100 dark:bg-gray-900" />
      <div className="h-10 rounded bg-gray-100 dark:bg-gray-900" />
    </div>
  );
}