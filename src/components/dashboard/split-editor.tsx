'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';

interface SplitRow {
  walletAddress: string;
  percentage: number;
}

export function SplitEditor({ rows, onChange }: { rows: SplitRow[]; onChange: (rows: SplitRow[]) => void }) {
  const total = rows.reduce((sum, r) => sum + r.percentage, 0);

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={index} className="flex gap-2">
          <Input placeholder="Wallet address" value={row.walletAddress} readOnly />
          <Input type="number" value={row.percentage} readOnly className="w-24" />
        </div>
      ))}
      <p className={total === 100 ? 'text-sm text-muted-foreground' : 'text-sm text-destructive'}>
        Total: {total}% {total !== 100 && '(must equal 100%)'}
      </p>
    </div>
  );
}
