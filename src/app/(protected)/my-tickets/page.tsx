'use client';

import * as React from 'react';
import { TicketCard } from '@/components/tickets/ticket-card';
import type { Ticket } from '@/types';

export default function MyTicketsPage() {
  const [tickets, setTickets] = React.useState<Ticket[] | null>(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/tickets')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setTickets)
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="text-sm text-destructive">Could not load your tickets.</p>;
  if (!tickets) return <p className="text-sm text-muted-foreground">Loading tickets…</p>;

  const now = Date.now();
  const upcoming = tickets.filter((t) => new Date(t.issuedAt).getTime() >= now);
  const past = tickets.filter((t) => new Date(t.issuedAt).getTime() < now);

  return (
    <div className="space-y-6">
      <section><h2 className="mb-2 font-medium">Upcoming ({upcoming.length})</h2></section>
      <section><h2 className="mb-2 font-medium">Past ({past.length})</h2></section>
    </div>
  );
}
