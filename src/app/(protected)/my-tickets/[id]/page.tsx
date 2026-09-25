'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { TicketQr } from '@/components/tickets/ticket-qr';
import type { Ticket } from '@/types';

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = React.useState<Ticket | null | undefined>(undefined);

  React.useEffect(() => {
    fetch(`/api/tickets/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setTicket);
  }, [id]);

  if (ticket === null) return notFound();
  if (ticket === undefined) return <p className="text-sm text-muted-foreground">Loading ticket…</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Status: {ticket.status}</p>
      {ticket.escrowId && <p className="text-sm text-muted-foreground">Escrow: {ticket.escrowId}</p>}
      <TicketQr signedPayload={ticket.id} />
    </div>
  );
}
