'use client';

import { HiHeart } from 'react-icons/hi';
import { cn } from '@/lib/utils';

/**
 * Favourite toggle for a single event.
 *
 * Presentational on purpose: the caller owns one `useFavourite()` per page and
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
    <button
      type="button"
      aria-pressed={isFavourite}
      aria-label={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
      className={cn(
        'inline-flex items-center justify-center rounded-full p-2 transition-all duration-300',
        isFavourite
          ? 'bg-pink-500 text-white hover:bg-pink-600'
          : 'bg-white/10 text-white hover:bg-white/20',
        className
      )}
      onClick={(e) => {
        // Stops the card link from navigating when this sits inside one.
        e.preventDefault();
        onToggle(eventId);
      }}
    >
      <HiHeart
        className={cn('h-5 w-5', isFavourite && 'fill-current')}
        aria-hidden="true"
      />
    </button>
  );
}
