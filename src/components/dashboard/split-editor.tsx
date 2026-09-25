'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SplitRow {
  walletAddress: string;
  percentage: number;
}

export function SplitEditor({
  rows,
  onChange,
}: {
  rows: SplitRow[];
  onChange: (rows: SplitRow[]) => void;
}) {
  const baseId = React.useId();
  const total = rows.reduce((sum, r) => sum + r.percentage, 0);
  const balanced = total === 100;

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={index} className="flex items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor={`${baseId}-wallet-${index}`}>Wallet address {index + 1}</Label>
            <Input
              id={`${baseId}-wallet-${index}`}
              value={row.walletAddress}
              readOnly
            />
          </div>
          <div className="w-24 space-y-1.5">
            {/* The unit was implied by the total line at the bottom of the
                form; the field itself gave no indication of what it holds. */}
            <Label htmlFor={`${baseId}-percentage-${index}`}>Share {index + 1} (%)</Label>
            <Input
              id={`${baseId}-percentage-${index}`}
              type="number"
              value={row.percentage}
              readOnly
              className="w-24"
            />
          </div>
        </div>
      ))}
      {/* The total flipping between states was the only feedback in the
          component and it was invisible to assistive tech. */}
      <p
        role="status"
        className={
          balanced ? 'text-sm text-muted-foreground' : 'text-sm text-destructive'
        }
      >
        Total: {total}% {balanced ? '(balanced)' : '(must equal 100%)'}
      </p>
    </div>
  );
}
