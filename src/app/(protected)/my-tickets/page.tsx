'use client';

import * as React from 'react';
import { EmptyState } from '@/components/feedback/empty-state';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';
import type { Ticket } from '@/types';

export default function MyTicketsPage() {
  const [tickets] = React.useState<Ticket[]>([]);

  if (tickets.length === 0) {
    return (
      <EmptyState
        title="No tickets yet"
        description="Once you buy a ticket, it will show up here."
        action={
          <Button asChild>
            <a href={routes.events}>Browse events</a>
          </Button>
        }
      />
    );
  }

  return <div>{tickets.length} ticket(s)</div>;
}
