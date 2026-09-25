'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { TicketStatus } from '@/types';

interface RefundDialogProps {
  ticketStatus: TicketStatus;
  refundPolicy: string;
  onSubmit: (reason: string) => void;
}

export function RefundDialog({ ticketStatus, refundPolicy, onSubmit }: RefundDialogProps) {
  const [reason, setReason] = React.useState('');
  const disabled = ticketStatus === 'used' || ticketStatus === 'refunded';

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{refundPolicy}</p>
      <p className="text-sm text-muted-foreground">Approved refunds release the escrow back to you.</p>
      <textarea
        className="w-full rounded-md border border-input bg-background p-2 text-sm"
        placeholder="Reason for refund"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        disabled={disabled}
      />
      <Button disabled={disabled || !reason.trim()} onClick={() => onSubmit(reason)}>
        Request refund
      </Button>
    </div>
  );
}
