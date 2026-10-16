'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt: string;
  /** Shown when there is no image or the image fails to load. */
  fallback?: string;
}

/** Derive up to two initials from a display name. */
function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function Avatar({ className, src, alt, fallback, ...props }: AvatarProps) {
  const [errored, setErrored] = React.useState(false);
  const showImage = Boolean(src) && !errored;

  return (
    <span
      className={cn(
        'relative inline-flex size-9 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-medium text-muted-foreground',
        className,
      )}
      {...props}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatars are arbitrary remote URLs
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span aria-hidden="true">{fallback ?? initialsFrom(alt)}</span>
      )}
      {!showImage && <span className="sr-only">{alt}</span>}
    </span>
  );
}

export { Avatar };
