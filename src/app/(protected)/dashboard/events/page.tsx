'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import { routes } from '@/lib/routes';
import type { VeritixEvent } from '@/types';

export default function OrganizerEventsPage() {
  const [events] = React.useState<VeritixEvent[]>([]);

  if (events.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Events</h1>
        <EmptyState
          title="No events yet"
          description="Published and draft events you create will be listed here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Events</h1>

      <Table>
        {/* Announced by the caption rather than only by the page heading, so a
            user reading cell by cell knows what the data is without scrolling
            back to the top. */}
        <TableCaption className="sr-only">Your events</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              {/* data-label feeds the stacked-cell layout below the md
                  breakpoint, where the column headers are no longer visible. */}
              <TableCell data-label="Event">
                <Link
                  href={routes.event(event.slug)}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {event.title}
                </Link>
              </TableCell>
              <TableCell data-label="Status">
                <Badge>{event.status}</Badge>
              </TableCell>
              {/* These were rendered as the string "Edit · Duplicate · View":
                  three advertised actions that no pointer, keyboard, or screen
                  reader could operate. Each is now a real control with its own
                  accessible name. */}
              <TableCell data-label="Actions">
                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={routes.dashboardEventEdit(event.id)}>Edit</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={routes.dashboardEventNew}>Duplicate</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={routes.event(event.slug)}>View</Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
