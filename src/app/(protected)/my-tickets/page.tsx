'use client';

import * as React from 'react';
import Link from 'next/link';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import { routes } from '@/lib/routes';
import type { Ticket, TicketStatus } from '@/types';

const STATUS_VARIANT: Record<TicketStatus, 'success' | 'secondary' | 'warning' | 'outline'> = {
  valid: 'success',
  used: 'secondary',
  refunded: 'warning',
  transferred: 'outline',
};

export default function MyTicketsPage() {
  const [tickets, setTickets] = React.useState<Ticket[] | null>(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    fetch('/api/tickets')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('request failed'))))
      .then((data: Ticket[]) => {
        if (!cancelled) setTickets(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">My tickets</h1>
        <ErrorState
          title="We could not load your tickets"
          description="Try again in a moment."
          onRetry={() => {
            setError(false);
            setTickets(null);
          }}
        />
      </div>
    );
  }

  if (!tickets) return <LoadingState label="Loading your tickets" />;

  if (tickets.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">My tickets</h1>
        <EmptyState
          title="No tickets yet"
          description="Once you buy a ticket, it will show up here."
          action={
            /* `Link` rather than an <a>: a plain anchor triggers a full page
               load and throws away the client-side navigation the rest of the
               app relies on. */
            <Button asChild>
              <Link href={routes.events}>Browse events</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const now = Date.now();
  const upcoming = tickets.filter((t) => new Date(t.issuedAt).getTime() >= now);
  const past = tickets.filter((t) => new Date(t.issuedAt).getTime() < now);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My tickets</h1>

      {/* The two sections previously had headings but no content, and the page
          had no <h1>, so the outline began at level 2. */}
      {(
        [
          ['Upcoming', upcoming],
          ['Past', past],
        ] as const
      ).map(([label, group]) => (
        <section
          key={label}
          className="space-y-3"
          aria-labelledby={`tickets-${label.toLowerCase()}`}
        >
          <h2 id={`tickets-${label.toLowerCase()}`} className="text-lg font-medium">
            {label} ({group.length})
          </h2>
          {group.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No {label.toLowerCase()} tickets to show.
            </p>
          ) : (
            <ul className="space-y-2">
              {group.map((ticket) => (
                <li key={ticket.id}>
                  <Link
                    href={routes.myTicket(ticket.id)}
                    className="flex items-center justify-between rounded-md border border-border p-4 transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {/* `/api/tickets` returns a bare `Ticket[]` with no event
                        title or tier name, and this page does not invent a
                        backend contract to fill them in. The reference and
                        issue date are what the response actually supports. */}
                    <span className="min-w-0 space-y-0.5">
                      <span className="block truncate font-mono text-sm">
                        {ticket.id}
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        Issued {formatDate(ticket.issuedAt)}
                      </span>
                    </span>
                    <Badge variant={STATUS_VARIANT[ticket.status]}>{ticket.status}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
