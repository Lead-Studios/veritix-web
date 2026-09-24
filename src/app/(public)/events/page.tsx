'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { CalendarX } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { EventCard } from '@/components/events/event-card';
import { routes } from '@/lib/routes';
import type { Paginated, VeritixEvent } from '@/types';

/**
 * Public listing of events.
 *
 * Fetches through the API client, which `AppProviders` wires into SWR — so this
 * gets the shared error shape, timeout handling and retry policy rather than a
 * bespoke fetch. Loading, empty and error all render through the shared
 * feedback components so the page matches the rest of the app.
 */

const PAGE_SIZE = 12;

export default function EventsPage() {
  const { data, error, isLoading, mutate } = useSWR<Paginated<VeritixEvent>>(
    `/events?page=1&pageSize=${PAGE_SIZE}`,
  );

  return (
    <Container className="flex flex-col gap-8 py-10 sm:py-14">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Events</h1>
        <p className="text-muted-foreground">
          Find something worth going to — every ticket is verifiable on Stellar.
        </p>
      </header>

      {error ? (
        <ErrorState
          title="We could not load the events"
          description="The listing is unavailable right now. Give it another try in a moment."
          onRetry={() => mutate()}
        />
      ) : isLoading ? (
        <LoadingState label="Loading events" />
      ) : data && data.items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarX className="size-6" aria-hidden="true" />}
          title="No events are listed yet"
          description="There is nothing on sale right now. Check back soon, or head back to the home page."
          action={
            <Button asChild variant="outline" size="sm">
              <Link href={routes.home}>Back home</Link>
            </Button>
          }
        />
      )}
    </Container>
  );
}
