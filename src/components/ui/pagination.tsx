import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Page navigation for a paginated list.
 *
 * Rendered as real anchors rather than click handlers, so pagination shows up
 * in the browser history and the back button moves between pages.
 */

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** 1-based current page. */
  page: number;
  totalPages: number;
  /** Target href for a page. Must preserve the other query parameters. */
  hrefForPage: (page: number) => string;
}

/** First, last, and a window around the current page, with gaps collapsed. */
function pageWindow(page: number, totalPages: number): Array<number | 'gap'> {
  const candidates = [1, page - 1, page, page + 1, totalPages]
    .filter((candidate) => candidate >= 1 && candidate <= totalPages)
    .sort((a, b) => a - b);

  const out: Array<number | 'gap'> = [];
  let previous = 0;

  for (const candidate of candidates) {
    if (candidate === previous) continue;
    if (previous && candidate - previous > 1) out.push('gap');
    out.push(candidate);
    previous = candidate;
  }

  return out;
}

const stepClass = 'size-9';
const disabledClass = cn(
  buttonVariants({ variant: 'outline', size: 'icon' }),
  stepClass,
  'pointer-events-none opacity-50',
);

export function Pagination({
  page,
  totalPages,
  hrefForPage,
  className,
  ...props
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    >
      {isFirst ? (
        <span className={disabledClass} aria-disabled="true">
          <ChevronLeft aria-hidden="true" />
          <span className="sr-only">Previous page</span>
        </span>
      ) : (
        <Link
          href={hrefForPage(page - 1)}
          className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), stepClass)}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden="true" />
        </Link>
      )}

      {pageWindow(page, totalPages).map((entry, index) =>
        entry === 'gap' ? (
          <span
            key={`gap-${index}`}
            className="px-1 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <Link
            key={entry}
            href={hrefForPage(entry)}
            aria-current={entry === page ? 'page' : undefined}
            aria-label={`Page ${entry}`}
            className={cn(
              buttonVariants({
                variant: entry === page ? 'default' : 'outline',
                size: 'icon',
              }),
              stepClass,
              'text-sm',
            )}
          >
            {entry}
          </Link>
        ),
      )}

      {isLast ? (
        <span className={disabledClass} aria-disabled="true">
          <ChevronRight aria-hidden="true" />
          <span className="sr-only">Next page</span>
        </span>
      ) : (
        <Link
          href={hrefForPage(page + 1)}
          className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), stepClass)}
          aria-label="Next page"
        >
          <ChevronRight aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
