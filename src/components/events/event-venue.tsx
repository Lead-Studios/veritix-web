import { ExternalLink, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VeritixEvent } from '@/types';

/**
 * Where the event is, and a way to go look at it.
 *
 * The map link is a plain search URL rather than an embedded map: embedding
 * would mean pulling in a mapping SDK and a key, and all a buyer needs at this
 * point is the address and a shortcut into the app they already use.
 */

export interface EventVenueProps {
  event: VeritixEvent;
  className?: string;
}

/** Search URL for the venue, including anything more specific we are given. */
function mapSearchUrl(event: VeritixEvent): string {
  const query = [event.venue, event.address, event.city].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function EventVenue({ event, className }: EventVenueProps) {
  const addressLine = [event.address, event.city].filter(Boolean).join(', ');

  return (
    <section
      aria-label="Venue and location"
      className={cn('flex flex-col gap-3', className)}
    >
      <h2 className="text-lg font-semibold leading-tight tracking-tight">Venue</h2>

      <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
        <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />

        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium">{event.venue}</p>
          {addressLine && <p className="text-sm text-muted-foreground">{addressLine}</p>}

          <a
            href={mapSearchUrl(event)}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Open in Maps
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
