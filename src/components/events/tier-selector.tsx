'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { TicketTier } from '@/types';

/**
 * Ticket tier picker for the event detail page.
 *
 * Each tier shows its price and what is left, and the stepper is capped at that
 * remaining inventory — the buyer can never ask for a ticket that does not
 * exist. Sold-out tiers lose their stepper entirely rather than sitting there
 * disabled and confusing.
 */

export interface TierSelectorProps {
  tiers: TicketTier[];
  /** Ceiling per tier, applied on top of the remaining-inventory cap. */
  maxPerTier?: number;
  /** Receives the tier id to quantity map whenever the selection changes. */
  onSelectionChange?: (selection: Record<string, number>) => void;
  className?: string;
}

function remainingFor(tier: TicketTier): number {
  return Math.max(0, tier.quantityTotal - tier.quantitySold);
}

export function TierSelector({
  tiers,
  maxPerTier = 10,
  onSelectionChange,
  className,
}: TierSelectorProps) {
  const [selection, setSelection] = React.useState<Record<string, number>>({});

  const currency = tiers[0]?.currency ?? 'USD';

  const setQuantity = (tier: TicketTier, next: number) => {
    const cap = Math.min(remainingFor(tier), maxPerTier);
    const quantity = Math.max(0, Math.min(next, cap));

    const updated = { ...selection };
    if (quantity > 0) updated[tier.id] = quantity;
    else delete updated[tier.id];

    setSelection(updated);
    onSelectionChange?.(updated);
  };

  const itemCount = Object.values(selection).reduce(
    (total, quantity) => total + quantity,
    0,
  );
  const totalMinor = tiers.reduce(
    (total, tier) => total + tier.priceMinor * (selection[tier.id] ?? 0),
    0,
  );

  if (tiers.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>
        No tiers announced yet.
      </p>
    );
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <ul className="flex flex-col">
        {tiers.map((tier, index) => {
          const remaining = remainingFor(tier);
          const cap = Math.min(remaining, maxPerTier);
          const quantity = selection[tier.id] ?? 0;

          return (
            <li
              key={tier.id}
              className={cn(
                'flex flex-wrap items-center justify-between gap-4 py-4',
                index > 0 && 'border-t border-border',
              )}
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{tier.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(tier.priceMinor, tier.currency)}
                  {remaining > 0 && remaining <= 5 && (
                    <span className="ml-2 text-warning">Only {remaining} left</span>
                  )}
                </p>
              </div>

              {remaining === 0 ? (
                <Badge variant="secondary">Sold out</Badge>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8"
                    aria-label={`Remove one ${tier.name} ticket`}
                    disabled={quantity === 0}
                    onClick={() => setQuantity(tier, quantity - 1)}
                  >
                    <Minus aria-hidden="true" />
                  </Button>
                  <span
                    className="w-8 text-center text-sm tabular-nums"
                    aria-live="polite"
                  >
                    {quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8"
                    aria-label={`Add one ${tier.name} ticket`}
                    disabled={quantity >= cap}
                    onClick={() => setQuantity(tier, quantity + 1)}
                  >
                    <Plus aria-hidden="true" />
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
        <span className="text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'ticket' : 'tickets'} selected
        </span>
        <span className="font-medium tabular-nums">
          {formatCurrency(totalMinor, currency)}
        </span>
      </div>
    </div>
  );
}
