'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TicketTier } from '@/types';

type DraftTier = Pick<TicketTier, 'name' | 'priceMinor' | 'quantityTotal'>;

/**
 * Internal representation that carries a stable client-side key alongside each
 * tier. Keying rows by a stable id means removing row 0 of 3 does not shift
 * focus to what was row 1.
 */
type KeyedTier = DraftTier & { key: string };

let counter = 0;
const nextKey = () => `tier-${++counter}`;

const toKeyed = (tiers: DraftTier[]): KeyedTier[] =>
  tiers.map((t) => ({ ...t, key: nextKey() }));

const strip = (tiers: KeyedTier[]): DraftTier[] =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tiers.map(({ key: _k, ...t }) => t);

export function TierEditor({
  tiers,
  onChange,
}: {
  tiers: DraftTier[];
  onChange: (tiers: DraftTier[]) => void;
}) {
  const baseId = React.useId();
  const [rows, setRows] = React.useState<KeyedTier[]>(() => toKeyed(tiers));

  const commit = (next: KeyedTier[]) => {
    setRows(next);
    onChange(strip(next));
  };

  const addTier = () =>
    commit([...rows, { key: nextKey(), name: '', priceMinor: 0, quantityTotal: 0 }]);

  const removeTier = (key: string) => commit(rows.filter((r) => r.key !== key));

  const updateTier = (key: string, patch: Partial<DraftTier>) =>
    commit(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const invalid = rows.some((t) => t.priceMinor < 0 || t.quantityTotal < 0);
  const errorId = `${baseId}-error`;

  return (
    <div className="space-y-3">
      {rows.map((tier, index) => {
        const nameId = `${baseId}-${tier.key}-name`;
        const priceId = `${baseId}-${tier.key}-price`;
        const qtyId = `${baseId}-${tier.key}-qty`;
        const humanIndex = index + 1;

        return (
          <div key={tier.key} className="rounded-md border border-input p-3 space-y-3">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor={nameId}>Tier {humanIndex} name</Label>
              <Input
                id={nameId}
                value={tier.name}
                placeholder="e.g. General Admission"
                onChange={(e) => updateTier(tier.key, { name: e.target.value })}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? errorId : undefined}
              />
            </div>

            {/* Price and quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor={priceId}>Price (minor units)</Label>
                <Input
                  id={priceId}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={tier.priceMinor}
                  onChange={(e) =>
                    updateTier(tier.key, { priceMinor: Math.max(0, Number(e.target.value)) })
                  }
                  aria-invalid={tier.priceMinor < 0 || undefined}
                  aria-describedby={invalid ? errorId : undefined}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={qtyId}>Quantity</Label>
                <Input
                  id={qtyId}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={tier.quantityTotal}
                  onChange={(e) =>
                    updateTier(tier.key, { quantityTotal: Math.max(0, Number(e.target.value)) })
                  }
                  aria-invalid={tier.quantityTotal < 0 || undefined}
                  aria-describedby={invalid ? errorId : undefined}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => removeTier(tier.key)}>
                Remove tier {humanIndex}
              </Button>
            </div>
          </div>
        );
      })}

      <Button variant="outline" onClick={addTier}>
        Add tier
      </Button>

      {rows.length === 0 && (
        <p role="alert" className="text-sm text-destructive">
          At least one tier is required.
        </p>
      )}
      {invalid && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          Price and quantity must not be negative.
        </p>
      )}
    </div>
  );
}
