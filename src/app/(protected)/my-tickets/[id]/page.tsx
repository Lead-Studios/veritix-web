'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/feedback/loading-state';
import { TicketQr } from '@/components/tickets/ticket-qr';
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

      <TicketQr
        signedPayload={ticket.id}
        label={`QR code for ticket ${ticket.id}, status ${ticket.status}`}
      />
    </div>
  );
}
