'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/format';

interface PromoCodeProps {
  onApply: (
    code: string,
  ) => Promise<{ valid: boolean; discountMinor?: number; message?: string }>;
}

export function PromoCode({ onApply }: PromoCodeProps) {
  const [code, setCode] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [applied, setApplied] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const inputId = React.useId();
  const resultId = `${inputId}-result`;

  const handleApply = async () => {
    setPending(true);
    try {
      const result = await onApply(code);
      setApplied(result.valid);
      // Raw minor units ("Discount applied: 1500") were announced as a bare
      // number with no currency, and meant different things to different
      // readers depending on what they assumed the unit was.
      setMessage(
        result.valid
          ? `Discount applied: ${formatCurrency(result.discountMinor ?? 0)}`
          : (result.message ?? 'Invalid or expired code'),
      );
    } catch {
      setApplied(false);
      setMessage('That code could not be checked. Try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor={inputId}>Promo code</Label>
          <Input
            id={inputId}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-describedby={message ? resultId : undefined}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleApply}
          disabled={!code.trim() || pending}
        >
          Apply
        </Button>
      </div>
      {/* Applying a code changed the total without saying anything. status for
          a success, alert for a failure, so neither is silently inserted. */}
      {message && (
        <p
          id={resultId}
          role={applied ? 'status' : 'alert'}
          className={
            applied ? 'text-sm text-muted-foreground' : 'text-sm text-destructive'
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}
