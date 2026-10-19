'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface SplitRow {
  walletAddress: string;
  percentage: number;
}

/**
 * An id for the row, not its position.
 *
 * Rows used to be keyed by array index. That makes React reconcile a
 * *position* rather than a *row*, so removing a row left the inputs bound to
 * the row that shifted into its place — typing into "wallet 2" could edit
 * "wallet 1" once an earlier recipient was removed.
 *
 * The id is derived from the row's own data where possible and falls back to
 * the index only for rows too empty to identify themselves, so it stays unique
 * without forcing callers to thread an `id` through their state.
 */
function rowId(row: SplitRow, index: number): string {
  const wallet = row.walletAddress.trim();
  return wallet ? `wallet-${wallet}` : `row-${index}`;
}

export function SplitEditor({
  rows,
  onChange,
}: {
  rows: SplitRow[];
  onChange: (rows: SplitRow[]) => void;
}) {
  const baseId = React.useId();
  const total = rows.reduce((sum, r) => sum + (Number.isFinite(r.percentage) ? r.percentage : 0), 0);
  const balanced = Math.abs(total - 100) < 0.0001;

  const handleChange = (index: number, field: 'walletAddress' | 'percentage', value: string) => {
    const next = rows.map((row, i) =>
      i === index
        ? {
            walletAddress: field === 'walletAddress' ? value : row.walletAddress,
            percentage: field === 'percentage' ? Number(value) : row.percentage,
          }
        : row,
    );
    onChange(next);
  };

  const handleAdd = () => {
    onChange([...rows, { walletAddress: '', percentage: 0 }]);
  };

  const handleRemove = (index: number) => {
    if (rows.length <= 1) return;
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={rowId(row, index)} className="flex flex-wrap items-end gap-2">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <Label htmlFor={`${baseId}-wallet-${index}`}>Wallet address {index + 1}</Label>
            <Input
              id={`${baseId}-wallet-${index}`}
              value={row.walletAddress}
              onChange={(e) => handleChange(index, 'walletAddress', e.target.value)}
              placeholder="0x..."
            />
          </div>
          <div className="w-32 space-y-1.5">
            <Label htmlFor={`${baseId}-percentage-${index}`}>Share {index + 1} (%)</Label>
            <Input
              id={`${baseId}-percentage-${index}`}
              type="number"
              min={0}
              max={100}
              step="any"
              value={row.percentage}
              onChange={(e) => handleChange(index, 'percentage', e.target.value)}
              className="w-32"
            />
          </div>
          {rows.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="mb-2 rounded-md px-2 py-1 text-sm text-destructive hover:bg-destructive/10"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        Add recipient
      </button>
      <p
        role="status"
        className={balanced ? 'text-sm text-muted-foreground' : 'text-sm text-destructive'}
      >
        Total: {total.toFixed(2)}% {balanced ? '(balanced)' : '(must equal 100%)'}
      </p>
    </div>
  );
}
