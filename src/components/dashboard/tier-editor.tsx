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

  const invalid = tiers.some((t) => t.priceMinor < 0 || t.quantityTotal < 0);
  const errorId = `${baseId}-error`;

  return (
    <div className="space-y-2">
      {tiers.map((tier, index) => {
        // Several tiers render several controls. Numbering them is the only
        // thing that tells a screen-reader user which one they are on; the
        // placeholder was the sole name and it vanished on first keystroke.
        const inputId = `${baseId}-tier-${index}`;
        return (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor={inputId}>Tier {index + 1} name</Label>
              <Input
                id={inputId}
                value={tier.name}
                readOnly
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? errorId : undefined}
              />
            </div>
            <Button variant="ghost" onClick={() => removeTier(index)}>
              Remove tier {index + 1}
            </Button>
          </div>
        );
      })}
      <Button variant="outline" onClick={addTier}>
        Add tier
      </Button>
      {/* role="alert": these are validation messages, and a bare paragraph is
          inserted without being announced. */}
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
