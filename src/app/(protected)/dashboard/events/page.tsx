'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'react-toastify';
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
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { api } from '@/lib/api-client';
import { duplicateEvent } from '@/lib/duplicate-event';
import { routes } from '@/lib/routes';
import type { Paginated, VeritixEvent } from '@/types';

/**
 * The organizer's own events.
 *
 * The list is read from the session-scoped `/events?mine=1` route rather than
 * held in component state, so it reflects what the organizer has actually
 * created. `mine=1` is what makes the route scope by the session user; the
 * client never sends an organizer id it could be tricked into spoofing.
 */
const EVENTS_KEY = '/events?mine=1';

export default function OrganizerEventsPage() {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<Paginated<VeritixEvent>>(EVENTS_KEY);
  // Which row's Duplicate button is mid-request, so it can be disabled and the
  // same event cannot be copied twice by a double click.
  const [duplicatingId, setDuplicatingId] = React.useState<string | null>(null);

  const events = data?.items ?? [];

  const handleDuplicate = async (event: VeritixEvent) => {
    if (duplicatingId) return;
    setDuplicatingId(event.id);

    try {
      const draft = duplicateEvent(event);
      // A persisted draft still needs a start and end date, and the helper
      // clears them so the organizer picks new ones before publishing. The
      // copy therefore starts from the source's schedule and the organizer
      // adjusts it on the edit page it lands on.
      const created = await api.post<VeritixEvent>('/events', {
        ...draft,
        startsAt: draft.startsAt || event.startsAt,
        endsAt: draft.endsAt || event.endsAt,
      });

      toast.success(`Duplicated “${event.title}”`);
      router.push(routes.dashboardEventEdit(created.id));
    } catch (duplicateError) {
      toast.error(
        duplicateError instanceof Error
          ? duplicateError.message
          : 'Could not duplicate the event',
      );
    } finally {
      setDuplicatingId(null);
    }
  };

  const heading = <h1 className="text-2xl font-semibold">Events</h1>;

  if (error) {
    return (
      <div className="space-y-6">
        {heading}
        <ErrorState
          title="We could not load your events"
          description="Your events are unavailable right now. Try again in a moment."
          onRetry={() => mutate()}
        />
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        {heading}
        <p role="status" className="sr-only">
          Loading your events
        </p>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-12" />
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="space-y-6">
        {heading}
        <EmptyState
          title="No events yet"
          description="Published and draft events you create will be listed here."
          action={
            <Button asChild size="sm">
              <Link href={routes.dashboardEventNew}>Create an event</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {heading}

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
                  {/* Duplicate used to be a link to the blank new-event form,
                      which copied nothing. It now builds a copy through the
                      shared helper, creates the draft, and opens its edit
                      page. */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void handleDuplicate(event)}
                    disabled={duplicatingId !== null}
                    aria-label={`Duplicate ${event.title}`}
                  >
                    {duplicatingId === event.id ? 'Duplicating…' : 'Duplicate'}
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
