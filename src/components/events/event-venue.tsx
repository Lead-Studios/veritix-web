import { HiExternalLink, HiLocationMarker } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import type { Event } from '@/types/event';

/**
 * Where the event is, and a way to go look at it.
 *
 * The map link is a plain search URL rather than an embedded map: embedding
 * would mean pulling in a mapping SDK and a key, and all a buyer needs at this
 * point is the address and a shortcut into the app they already use.
 */

export interface EventVenueProps {
  event: Event;
  className?: string;
}

/** Search URL for the venue, using venue name + location. */
function mapSearchUrl(event: Event): string {
  const query = [event.venue, event.location].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function EventVenue({ event, className }: EventVenueProps) {
  return (
    <section
      aria-label="Venue and location"
      className={cn('flex flex-col gap-3', className)}
    >
      <h2 className="text-lg font-semibold leading-tight tracking-tight text-white">Venue</h2>

      <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
        <HiLocationMarker
          className="mt-0.5 h-4 w-4 shrink-0 text-[#4D21FF]"
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium text-white">{event.venue}</p>
          {event.location && (
            <p className="text-sm text-gray-400">{event.location}</p>
          )}

          <a
            href={mapSearchUrl(event)}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4D21FF] underline-offset-4 hover:underline"
          >
            Open in Maps
            <HiExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
