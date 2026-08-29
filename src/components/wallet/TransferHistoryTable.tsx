'use client';

import React, { useState } from 'react';

export type TransferStatus = 'completed' | 'pending' | 'failed';

export interface TransferRecord {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  currency?: string;
  status: TransferStatus;
  reference?: string;
}

interface TransferHistoryTableProps {
  transfers: TransferRecord[];
  isLoading?: boolean;
  onRowClick?: (transfer: TransferRecord) => void;
  className?: string;
}

const STATUS_STYLES: Record<TransferStatus, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

function formatAmount(amount: number, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

const COLUMNS = [
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description' },
  { key: 'reference', label: 'Reference' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
] as const;

export const TransferHistoryTable: React.FC<TransferHistoryTableProps> = ({
  transfers,
  isLoading = false,
  onRowClick,
  className = '',
}) => {
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...transfers].sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    return sortDir === 'asc' ? diff : -diff;
  });

  if (isLoading) {
    return (
      <div role="status" aria-label="Loading transfer history" className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-gray-800" />
        ))}
      </div>
    );
  }

  if (!transfers.length) {
    return <p className="py-10 text-center text-sm text-gray-400">No transfers found.</p>;
  }

  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-700 ${className}`}>
      <table className="min-w-full text-sm text-gray-200">
        <thead className="border-b border-gray-700 bg-gray-900 text-xs uppercase text-gray-400">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} scope="col" className="px-4 py-3 text-left">
                {col.key === 'date' ? (
                  <button
                    className="flex items-center gap-1 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                    aria-label={`Sort by date ${sortDir === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    {col.label}
                    <span aria-hidden="true">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {sorted.map((tx) => (
            <tr
              key={tx.id}
              className={`transition-colors hover:bg-gray-800/60 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(tx)}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRowClick(tx);
                }
              }}
              role={onRowClick ? 'button' : undefined}
              aria-label={
                onRowClick
                  ? `View details for ${tx.description} on ${formatDate(tx.date)}`
                  : undefined
              }
            >
              <td className="whitespace-nowrap px-4 py-3">{formatDate(tx.date)}</td>
              <td className="px-4 py-3">{tx.description}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-400">
                {tx.reference ?? '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium">
                {formatAmount(tx.amount, tx.currency)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[tx.status]}`}
                >
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransferHistoryTable;
