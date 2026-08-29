'use client';

import React, { useEffect, useState } from 'react';
import { PayoutRecord, fetchOrganizerPayouts } from '@/lib/api/payouts';
import { usePayoutDateFilter } from '@/hooks/usePayoutDateFilter';

interface PayoutHistoryProps {
  organizerId: string;
}

const DATE_PRESETS = [
  { label: '7 days', value: '7d' as const },
  { label: '30 days', value: '30d' as const },
  { label: '90 days', value: '90d' as const },
  { label: 'YTD', value: 'ytd' as const },
] as const;

export function PayoutHistory({ organizerId }: PayoutHistoryProps) {
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { filter, setPreset, setCustomRange, clear } = usePayoutDateFilter();

  useEffect(() => {
    let isMounted = true;

    async function loadPayouts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOrganizerPayouts(organizerId);
        if (isMounted) {
          // Apply client-side date filtering
          let filtered = data;
          if (filter.from) {
            filtered = filtered.filter((p) => p.date >= filter.from!);
          }
          if (filter.to) {
            filtered = filtered.filter((p) => p.date <= filter.to!);
          }
          setPayouts(filtered);
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
  }, [organizerId, filter.from, filter.to]);

  return (
    <div>
      {/* Date range filter */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500">Filter by:</span>
        {DATE_PRESETS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setPreset(value)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filter.preset === value
                ? 'bg-brand-primary text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
        {filter.from && filter.to && (
          <>
            <input
              type="date"
              value={filter.from}
              onChange={(e) =>
                setCustomRange(
                  e.target.value,
                  filter.to ?? new Date().toISOString().slice(0, 10),
                )
              }
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white focus:border-brand-primary focus:outline-none [color-scheme:dark]"
              aria-label="From date"
            />
            <span className="text-gray-500">–</span>
            <input
              type="date"
              value={filter.to}
              onChange={(e) => setCustomRange(filter.from ?? '', e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white focus:border-brand-primary focus:outline-none [color-scheme:dark]"
              aria-label="To date"
            />
          </>
        )}
        {(filter.preset || filter.from || filter.to) && (
          <button
            type="button"
            onClick={clear}
            className="rounded-lg px-3 py-1 text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            All time
          </button>
        )}
      </div>

      {/* Payouts table */}
      {loading ? (
        <PayoutHistorySkeleton />
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      ) : payouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            No payout history found
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Payouts will appear here once transactions are processed.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400"
                >
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
      )}
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
