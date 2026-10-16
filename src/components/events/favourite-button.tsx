'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Favourite toggle for a single event.
 *
 * Presentational on purpose: the caller owns one `useFavourites()` per page and
 * passes the state down, so the card and the event detail header can never
 * disagree about whether an event is saved.
 */

export interface FavouriteButtonProps {
  eventId: string;
  isFavourite: boolean;
  onToggle: (eventId: string) => void;
  className?: string;
}

export function FavouriteButton({
  eventId,
  isFavourite,
  onToggle,
  className,
}: FavouriteButtonProps) {
  return (
    <Button
      type="button"
      variant={isFavourite ? 'secondary' : 'outline'}
      size="icon"
      aria-pressed={isFavourite}
      aria-label={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
      className={className}
      onClick={(event) => {
        // Stops the card link from navigating when this sits inside one.
        event.preventDefault();
        onToggle(eventId);
      }}
    >
      <Heart
        className={cn(isFavourite && 'fill-current text-primary')}
        aria-hidden="true"
      />
    </Button>
  );
}
