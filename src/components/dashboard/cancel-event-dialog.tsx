'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/format';

interface CancelEventDialogProps {
  eventTitle: string;
  buyerCount: number;
  refundValueMinor: number;
  onConfirm: () => void;
}

export function CancelEventDialog({
  eventTitle,
  buyerCount,
  refundValueMinor,
  onConfirm,
}: CancelEventDialogProps) {
  const [confirmText, setConfirmText] = React.useState('');
  const canConfirm = confirmText.trim() === eventTitle;
  const inputId = React.useId();
  const hintId = `${inputId}-hint`;

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">
        {/* Refunds are a destructive, irreversible action, so the consequence is
            stated in words and in currency rather than as "minor units". */}
        This refunds {buyerCount} {buyerCount === 1 ? 'buyer' : 'buyers'} totalling{' '}
        {formatCurrency(refundValueMinor)} and cannot be undone.
      </p>
      <div className="space-y-1.5">
        {/* The confirmation field had a placeholder and no label, so an
            irreversible action was gated behind an unnamed text box. */}
        <Label htmlFor={inputId} required>
          Type “{eventTitle}” to confirm
        </Label>
        <Input
          id={inputId}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          required
          aria-invalid={!canConfirm}
          aria-describedby={hintId}
        />
        <p id={hintId} className="text-sm text-muted-foreground">
          {canConfirm
            ? 'Confirmed. The button below is now enabled.'
            : `The text must match “${eventTitle}” exactly.`}
        </p>
      </div>
      <Button variant="destructive" disabled={!canConfirm} onClick={onConfirm}>
        Cancel event and refund
      </Button>
    </div>
  );
}
