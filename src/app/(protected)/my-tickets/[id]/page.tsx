'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingState } from '@/components/feedback/loading-state';
import { TicketQr } from '@/components/tickets/ticket-qr';
import { RefundDialog } from '@/components/tickets/refund-dialog';
import { TransferDialog } from '@/components/tickets/transfer-dialog';
import type { Ticket, TicketStatus } from '@/types';

const STATUS_VARIANT: Record<TicketStatus, 'success' | 'secondary' | 'warning' | 'outline'> = {
  valid: 'success',
  used: 'secondary',
  refunded: 'warning',
  transferred: 'outline',
};

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = React.useState<Ticket | null | undefined>(undefined);
  const [showTransfer, setShowTransfer] = React.useState(false);
  const [showRefund, setShowRefund] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/api/tickets/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Ticket | null) => {
        if (!cancelled) setTicket(data);
      })
      .catch(() => {
        if (!cancelled) setTicket(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (ticket === null) return notFound();
  // A bare "Loading ticket…" paragraph announces nothing, so a screen-reader
  // user is left in silence with no sign that anything is happening.
  if (ticket === undefined) return <LoadingState label="Loading ticket" />;

  return (
    <div className="space-y-6">
      {/* The page previously had no heading at all, so the outline the user
          navigates by started at the status line. */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Ticket</h1>
        <p className="text-sm text-muted-foreground">
          Reference <span className="font-mono text-foreground">{ticket.id}</span>
        </p>
      </div>

      <dl className="grid gap-2 text-sm">
        <div className="flex items-center gap-2">
          <dt className="text-muted-foreground">Status</dt>
          <dd>
            {/* The raw status string was the only indication of state; a Badge
                makes it scannable, and it matches the listing. */}
            <Badge variant={STATUS_VARIANT[ticket.status]}>{ticket.status}</Badge>
          </dd>
        </div>
        {ticket.escrowId && (
          <div className="flex items-center gap-2">
            <dt className="text-muted-foreground">Escrow</dt>
            <dd className="font-mono">{ticket.escrowId}</dd>
          </div>
        )}
      </dl>

      <div className="flex flex-wrap gap-2">
        <Button
          disabled={ticket.status === 'used' || ticket.status === 'refunded' || ticket.status === 'transferred'}
          onClick={() => setShowTransfer(true)}
        >
          Transfer
        </Button>
        <Button
          disabled={ticket.status === 'used' || ticket.status === 'refunded' || ticket.status === 'transferred'}
          onClick={() => setShowRefund(true)}
          variant="outline"
        >
          Request refund
        </Button>
      </div>

      <Dialog open={showTransfer} onOpenChange={setShowTransfer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer ticket</DialogTitle>
          </DialogHeader>
          <TransferDialog onTransfer={async () => setShowTransfer(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showRefund} onOpenChange={setShowRefund}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request refund</DialogTitle>
          </DialogHeader>
          <RefundDialog ticketStatus={ticket.status} refundPolicy="30-day refund policy applies." onSubmit={() => setShowRefund(false)} />
        </DialogContent>
      </Dialog>

      <TicketQr
        signedPayload={ticket.id}
        label={`QR code for ticket ${ticket.id}, status ${ticket.status}`}
      />
    </div>
  );
}
