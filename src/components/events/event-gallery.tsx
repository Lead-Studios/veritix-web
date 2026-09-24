'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/**
 * Image gallery for an event.
 *
 * A main image with a thumbnail strip underneath, plus a lightbox on the
 * `Dialog` primitive. Arrow keys move through the images — the handler sits on
 * the wrapper, so it works whether focus is on the main image, a thumbnail, or
 * a control, and it wraps around at both ends.
 */

export interface EventGalleryProps {
  images: string[];
  /** Event title, used to build meaningful alt text. */
  title: string;
  className?: string;
}

export function EventGallery({ images, title, className }: EventGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  const count = images.length;
  const safeIndex = count === 0 ? 0 : Math.min(activeIndex, count - 1);
  const current = images[safeIndex];

  const step = React.useCallback(
    (delta: number) => {
      if (count < 2) return;
      setActiveIndex((index) => (index + delta + count) % count);
    },
    [count],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    }
  };

  // Nothing to show yet — let the page render its own placeholder.
  if (count === 0) return null;

  const label = (index: number) => `${title} — image ${index + 1} of ${count}`;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`${title} images`}
      className={cn('flex flex-col gap-3', className)}
      onKeyDown={onKeyDown}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-secondary">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label="Open full-size image"
        >
          <Image
            src={current}
            alt={label(safeIndex)}
            fill
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover"
          />
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-background/90 px-2 py-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Expand className="size-3.5" aria-hidden="true" />
            View full size
          </span>
        </button>

        {count > 1 && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="pointer-events-auto"
                aria-label="Previous image"
                onClick={() => step(-1)}
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="pointer-events-auto"
                aria-label="Next image"
                onClick={() => step(1)}
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === safeIndex ? 'true' : undefined}
                className={cn(
                  'relative block h-16 w-24 shrink-0 overflow-hidden rounded-md border',
                  index === safeIndex
                    ? 'border-primary ring-2 ring-ring ring-offset-2 ring-offset-background'
                    : 'border-border opacity-80 hover:opacity-100',
                )}
              >
                <Image src={image} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        title={label(safeIndex)}
        className="max-w-5xl"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-secondary">
          <Image
            src={current}
            alt={label(safeIndex)}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>

        {count > 1 && (
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" size="sm" onClick={() => step(-1)}>
              <ChevronLeft aria-hidden="true" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {safeIndex + 1} / {count}
            </span>
            <Button type="button" variant="outline" size="sm" onClick={() => step(1)}>
              Next
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
