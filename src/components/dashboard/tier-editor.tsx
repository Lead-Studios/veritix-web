'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TicketTier } from '@/types';

type DraftTier = Pick<TicketTier, 'name' | 'priceMinor' | 'quantityTotal'>;

export function TierEditor({ tiers, onChange }: { tiers: DraftTier[]; onChange: (tiers: DraftTier[]) => void }) {
  const addTier = () => onChange([...tiers, { name: '', priceMinor: 0, quantityTotal: 0 }]);
  const removeTier = (index: number) => onChange(tiers.filter((_, i) => i !== index));

  const invalid = tiers.some((t) => t.priceMinor < 0 || t.quantityTotal < 0);

  return (
    <div className="space-y-2">
      {tiers.map((tier, index) => (
        <div key={index} className="flex gap-2">
          <Input value={tier.name} placeholder="Tier name" readOnly />
          <Button variant="ghost" onClick={() => removeTier(index)}>Remove</Button>
        </div>
      ))}
      <Button variant="outline" onClick={addTier}>Add tier</Button>
      {tiers.length === 0 && <p className="text-sm text-destructive">At least one tier is required.</p>}
      {invalid && <p className="text-sm text-destructive">Price and quantity must not be negative.</p>}
    </div>
  );
}
