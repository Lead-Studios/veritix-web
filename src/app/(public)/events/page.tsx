'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { SearchX } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { EventCard } from '@/components/events/event-card';
import { EventCardSkeletonGrid } from '@/components/events/event-card-skeleton';
import { EventSearch } from '@/components/events/event-search';
import { EventFilters } from '@/components/events/event-filters';
import { routes } from '@/lib/routes';
import type { Paginated, VeritixEvent } from '@/types';

/**
 * Public listing of events.
 *
 * The URL drives the whole view: search, filters, and the page number all live
 * in the query string, so a filtered and paginated listing can be shared, is
 * restored on reload, and steps backwards through the browser history.
 */

const PAGE_SIZE = 12;

/** Parameters the listing owns. Anything else in the URL is left alone. */
const QUERY_KEYS = ['q', 'city', 'date', 'minPrice', 'maxPrice', 'sort'] as const;

function buildRequest(searchParams: URLSearchParams): string {
  const query = new URLSearchParams({ pageSize: String(PAGE_SIZE) });

  for (const key of QUERY_KEYS) {
    const value = searchParams.get(key)?.trim();
    if (value) query.set(key, value);
  }

  query.set('page', searchParams.get('page')?.trim() || '1');

  return `/events?${query.toString()}`;
}

function EventsListing() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const request = buildRequest(new URLSearchParams(searchParams.toString()));
  const { data, error, isLoading, mutate } = useSWR<Paginated<VeritixEvent>>(request, {
    // Keep the current page on screen while the next one loads.
    keepPreviousData: true,
  });

  const page = Number.parseInt(searchParams.get('page') ?? '1', 10) || 1;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const hasActiveFilters = QUERY_KEYS.some((key) => searchParams.get(key));

  const hrefForPage = (target: number): string => {
    const next = new URLSearchParams(searchParams.toString());

    if (target <= 1) next.delete('page');
    else next.set('page', String(target));

    const query = next.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <Container className="flex flex-col gap-8 py-10 sm:py-14">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Events</h1>
        <p className="text-muted-foreground">
          Browse what is on, and narrow it down to what you want to see.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <EventSearch className="w-full max-w-xl" />
        <EventFilters />
      </div>

      {error ? (
        <ErrorState
          title="We could not load the events"
          description="The listing is unavailable right now. Try again in a moment."
          onRetry={() => mutate()}
        />
      ) : isLoading && !data ? (
        <EventCardSkeletonGrid count={6} />
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} hrefForPage={hrefForPage} />
        </>
      ) : (
        <EmptyState
          icon={<SearchX className="size-6" aria-hidden="true" />}
          title="No events match these filters"
          description={
            hasActiveFilters
              ? 'Try widening the date range or clearing a filter.'
              : 'Nothing is listed yet — check back soon.'
          }
          action={
            hasActiveFilters ? (
              <Button asChild variant="outline" size="sm">
                <Link href={routes.events}>Clear filters</Link>
              </Button>
            ) : undefined
          }
        />
      )}
    </Container>
  );
}

export default function EventsPage() {
  return (
    // useSearchParams needs a Suspense boundary during static rendering.
    <Suspense
      fallback={
        <Container className="py-10 sm:py-14">
          <EventCardSkeletonGrid count={6} />
        </Container>
      }
    >
      <EventsListing />
    </Suspense>
  );
}
