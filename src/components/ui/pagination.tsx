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
 *
 * The page is a self-contained component rather than a set of
 * `PaginationContent`/`PaginationItem`/`PaginationLink` primitives: the only
 * consumer wants a complete, correctly-labelled control, and every page-number
 * and previous/next pair is announced by an explicit accessible name.
 */

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** 1-based current page. */
  page: number;
  totalPages: number;
  /** Target href for a page. Must preserve the other query parameters. */
  hrefForPage: (page: number) => string;
  /** Distinguishes this control from any other navigation on the page. */
  label?: string;
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

/**
 * A step that is not available. A `<span>` rather than a disabled `<button>`,
 * because a disabled control is removed from the tab order and skipped by
 * screen readers, which leaves no way to discover that the control exists.
 */
const disabledClass = cn(
  buttonVariants({ variant: 'outline', size: 'icon' }),
  stepClass,
  'pointer-events-none opacity-50',
);

export function Pagination({
  page,
  totalPages,
  hrefForPage,
  label = 'Pagination',
  className,
  ...props
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav
      aria-label={label}
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    >
      {isFirst ? (
        <span className={disabledClass} aria-disabled="true">
          <ChevronLeft aria-hidden="true" />
          <span className="sr-only">Previous page, unavailable</span>
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
          // Was `aria-hidden`, which made the skipped pages invisible: a screen
          // reader heard 1, 2, 6 with nothing between them. The visible glyph
          // is decorative; the explanation is in text.
          <span key={`gap-${index}`} className="px-1 text-sm text-muted-foreground">
            <span aria-hidden="true">…</span>
            <span className="sr-only">and other pages</span>
          </span>
        ) : (
          <Link
            key={entry}
            href={hrefForPage(entry)}
            // The current page is conveyed by `aria-current`, not only by the
            // filled-in button style, which a screen reader cannot see.
            aria-current={entry === page ? 'page' : undefined}
            aria-label={entry === page ? `Page ${entry}, current page` : `Go to page ${entry}`}
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
          <span className="sr-only">Next page, unavailable</span>
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
