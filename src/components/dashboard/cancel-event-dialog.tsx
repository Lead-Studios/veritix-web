'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CancelEventDialogProps {
  eventTitle: string;
  buyerCount: number;
  refundValueMinor: number;
  onConfirm: () => void;
}

export function CancelEventDialog({ eventTitle, buyerCount, refundValueMinor, onConfirm }: CancelEventDialogProps) {
  const [confirmText, setConfirmText] = React.useState('');
  const canConfirm = confirmText.trim() === eventTitle;

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">
        This refunds {buyerCount} buyer(s) totalling {refundValueMinor} minor units.
      </p>
      <Input
        placeholder={`Type "${eventTitle}" to confirm`}
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
      />
      <Button variant="destructive" disabled={!canConfirm} onClick={onConfirm}>
        Cancel event and refund
      </Button>
    </div>
  );
}
