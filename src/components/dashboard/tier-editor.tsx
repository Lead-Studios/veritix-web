'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TicketTier } from '@/types';

type DraftTier = Pick<TicketTier, 'name' | 'priceMinor' | 'quantityTotal'>;

export function TierEditor({
  tiers,
  onChange,
}: {
  tiers: DraftTier[];
  onChange: (tiers: DraftTier[]) => void;
}) {
  const baseId = React.useId();
  const addTier = () =>
    onChange([...tiers, { name: '', priceMinor: 0, quantityTotal: 0 }]);
  const removeTier = (index: number) => onChange(tiers.filter((_, i) => i !== index));

  const updateTier = (index: number, field: keyof DraftTier, value: string | number) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const invalid = tiers.some((t) => t.priceMinor < 0 || t.quantityTotal < 0);
  const errorId = `${baseId}-error`;

  return (
    <div className="space-y-4">
      {tiers.map((tier, index) => {
        const tierBaseId = `${baseId}-tier-${index}`;
        return (
          <div key={index} className="space-y-2 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Tier {index + 1}</h4>
              {tiers.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeTier(index)}>
                  Remove
                </Button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor={`${tierBaseId}-name`}>Name</Label>
                <Input
                  id={`${tierBaseId}-name`}
                  value={tier.name}
                  onChange={(e) => updateTier(index, 'name', e.target.value)}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? errorId : undefined}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${tierBaseId}-price`}>Price (minor units)</Label>
                <Input
                  id={`${tierBaseId}-price`}
                  type="number"
                  value={tier.priceMinor}
                  onChange={(e) => updateTier(index, 'priceMinor', parseInt(e.target.value) || 0)}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? errorId : undefined}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${tierBaseId}-quantity`}>Quantity</Label>
                <Input
                  id={`${tierBaseId}-quantity`}
                  type="number"
                  value={tier.quantityTotal}
                  onChange={(e) => updateTier(index, 'quantityTotal', parseInt(e.target.value) || 0)}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? errorId : undefined}
                />
              </div>
            </div>
          </div>
        );
      })}
      <Button variant="outline" onClick={addTier}>
        Add tier
      </Button>
      {tiers.length === 0 && (
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
