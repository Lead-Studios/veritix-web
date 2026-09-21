import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Placeholder block shown while content loads. Always give it the approximate
 * dimensions of the real content so the layout does not shift on load.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-md bg-muted', className)}
      aria-hidden="true"
      {...props}
    >
      <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </div>
  );
}

export { Skeleton };
