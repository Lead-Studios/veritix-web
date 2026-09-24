import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BadgeCheck, CalendarClock, MapPin } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Avatar } from '@/components/ui/avatar';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TierSelector } from '@/components/events/tier-selector';
import { ApiError, api } from '@/lib/api-client';
import { formatDateTime } from '@/lib/format';
import { routes } from '@/lib/routes';
import type { EventStatus, VeritixEvent } from '@/types';

/**
 * Public detail page for a single event, addressed by its slug.
 *
 * An unknown slug resolves to the segment's `not-found.tsx` instead of the
 * generic 404, so the buyer gets an explanation and a way back to the listing.
 */

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

const STATUS_VARIANT: Record<EventStatus, BadgeProps['variant']> = {
  draft: 'secondary',
  published: 'success',
  cancelled: 'destructive',
  completed: 'outline',
};

async function getEvent(slug: string): Promise<VeritixEvent | null> {
  try {
    return await api.get<VeritixEvent>(`/events/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return { title: 'Event not found', robots: { index: false, follow: false } };
  }

  const description = event.description.slice(0, 160);
  const images = event.coverImageUrl
    ? [{ url: event.coverImageUrl, alt: event.title }]
    : undefined;

  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      type: 'website',
      url: routes.event(event.slug),
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      images: event.coverImageUrl ? [event.coverImageUrl] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  // Sends the buyer to this segment's not-found state.
  if (!event) notFound();

  const remainingTotal = event.tiers.reduce(
    (total, tier) => total + Math.max(0, tier.quantityTotal - tier.quantitySold),
    0,
  );
  const soldOut = event.tiers.length > 0 && remainingTotal === 0;

  return (
    <Container className="flex flex-col gap-8 py-10 sm:py-14">
      <div className="overflow-hidden rounded-lg border border-border bg-secondary">
        <div className="relative aspect-[21/9] w-full">
          {event.coverImageUrl ? (
            <Image
              src={event.coverImageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-muted-foreground">
              <CalendarClock className="size-8" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANT[event.status]}>{event.status}</Badge>
            {soldOut && <Badge variant="secondary">Sold out</Badge>}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {event.title}
          </h1>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-4" aria-hidden="true" />
              {formatDateTime(event.startsAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {event.venue}, {event.city}
            </span>
          </p>
        </div>
      </div>

      <p className="max-w-3xl text-base text-muted-foreground">{event.description}</p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
              <CardDescription>
                Pick the tiers you want. Quantities are capped at what is left.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TierSelector tiers={event.tiers} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>
                All times are shown in your local timezone.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Starts</span>
                <span className="font-medium">{formatDateTime(event.startsAt)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ends</span>
                <span className="font-medium">{formatDateTime(event.endsAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:sticky lg:top-24 lg:self-start">
          <CardHeader>
            <CardTitle>Organizer</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Avatar alt={event.organizer.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{event.organizer.name}</p>
              {event.organizer.verified ? (
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
                  Verified organizer
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Not verified yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Link
          href={routes.events}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Back to all events
        </Link>
      </div>
    </Container>
  );
}
