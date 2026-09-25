'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { TicketStatus } from '@/types';

interface RefundDialogProps {
  ticketStatus: TicketStatus;
  refundPolicy: string;
  onSubmit: (reason: string) => void;
}

/** Why the form is unavailable, so `disabled` is not a dead end. */
const BLOCKED_REASON: Partial<Record<TicketStatus, string>> = {
  used: 'This ticket has already been used, so it cannot be refunded.',
  refunded: 'This ticket has already been refunded.',
  transferred: 'This ticket has been transferred, so it is no longer yours to refund.',
};

export function RefundDialog({
  ticketStatus,
  refundPolicy,
  onSubmit,
}: RefundDialogProps) {
  const [reason, setReason] = React.useState('');
  const blockedReason = BLOCKED_REASON[ticketStatus];
  const disabled = Boolean(blockedReason);
  const reasonId = React.useId();
  const hintId = `${reasonId}-hint`;

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{refundPolicy}</p>
      <p className="text-sm text-muted-foreground">Approved refunds release the escrow back to you.</p>

      {/* A disabled control with no explanation reads as a broken page, so the
          reason is stated next to the badge. */}
      {blockedReason && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{ticketStatus}</Badge>
          {blockedReason}
        </p>
      )}

      <div className="space-y-1.5">
        {/* The textarea had a placeholder and no label, and hand-rolled classes
            that dropped the focus ring and the invalid state. */}
        <Label htmlFor={reasonId} required>
          Reason for refund
        </Label>
        <Textarea
          id={reasonId}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={disabled}
          required
          aria-describedby={hintId}
        />
        <p id={hintId} className="text-sm text-muted-foreground">
          {blockedReason ?? 'Tell the organizer why the refund is needed.'}
        </p>
      </div>

      <Button disabled={disabled || !reason.trim()} onClick={() => onSubmit(reason)}>
        Request refund
      </Button>
    </div>
  );
}
