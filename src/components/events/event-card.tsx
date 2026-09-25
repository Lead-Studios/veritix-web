import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/format';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { TicketTier, VeritixEvent } from '@/types';

/**
 * Summary card for one event.
 *
 * The listing, search results, and favourites all render this, so the shape is
 * fixed: a 16:9 cover, the title and date, then venue and entry price. The
 * loading placeholder in `event-card-skeleton.tsx` copies these exact
 * dimensions — change one and the other has to follow.
 */

export interface EventCardProps {
  event: VeritixEvent;
  className?: string;
}

function cheapestTier(tiers: TicketTier[]): TicketTier | null {
  return tiers.reduce<TicketTier | null>(
    (lowest, tier) =>
      lowest === null || tier.priceMinor < lowest.priceMinor ? tier : lowest,
    null,
  );
}

export function EventCard({ event, className }: EventCardProps) {
  const cheapest = cheapestTier(event.tiers);
  const soldOut =
    event.tiers.length > 0 &&
    event.tiers.every((tier) => tier.quantitySold >= tier.quantityTotal);

  let priceLabel = 'No tickets yet';
  if (soldOut) priceLabel = 'Sold out';
  else if (cheapest) {
    priceLabel = `From ${formatCurrency(cheapest.priceMinor, cheapest.currency)}`;
  }

  return (
    <Card
      className={cn(
        'group h-full overflow-hidden transition-colors hover:border-primary/50',
        className,
      )}
    >
      <Link href={routes.event(event.slug)} className="flex h-full flex-col">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
          {event.coverImageUrl ? (
            <Image
              src={event.coverImageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-muted-foreground">
              <CalendarDays className="size-6" aria-hidden="true" />
            </span>
          )}
        </div>

        <CardHeader className="p-5 pb-0">
          <CardTitle className="line-clamp-2 text-base">{event.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{formatDate(event.startsAt)}</p>
        </CardHeader>

        <CardContent className="mt-auto flex flex-col gap-1 p-5 pt-3">
          <p className="truncate text-sm text-muted-foreground">
            {event.venue} · {event.city}
          </p>
          <p className="text-sm font-medium">{priceLabel}</p>
        </CardContent>
      </Link>
    </Card>
  );
}
