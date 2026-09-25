'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * Search box for the events listing.
 *
 * The `q` query parameter is the source of truth, so a shared link reproduces
 * the same results and the back button steps through the searches. Typing is
 * debounced before it touches the URL, and the input is seeded from the URL so
 * a reload or a pasted link shows the active term.
 */

export interface EventSearchProps {
  /** Debounce before writing to the URL, in milliseconds. */
  delayMs?: number;
  placeholder?: string;
  className?: string;
}

export function EventSearch({
  delayMs = 350,
  placeholder = 'Search events, artists, or venues',
  className,
}: EventSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryInUrl = searchParams.get('q') ?? '';
  const [value, setValue] = React.useState(queryInUrl);

  // Adopt the URL when something else changes it — the back button, a
  // clear-all, or a link followed from elsewhere.
  const [lastQueryInUrl, setLastQueryInUrl] = React.useState(queryInUrl);
  if (queryInUrl !== lastQueryInUrl) {
    setLastQueryInUrl(queryInUrl);
    setValue(queryInUrl);
  }

  const writeQuery = React.useCallback(
    (nextValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = nextValue.trim();

      if (trimmed) params.set('q', trimmed);
      else params.delete('q');

      // A new search always starts back at the first page.
      params.delete('page');

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Debounce only the user's typing; the initial render must not rewrite the URL.
  const isFirstRun = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timer = setTimeout(() => writeQuery(value), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, value, writeQuery]);

  return (
    <form
      role="search"
      className={cn('relative', className)}
      onSubmit={(event) => {
        event.preventDefault();
        writeQuery(value);
      }}
    >
      <Search
        className={cn(
          'pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2',
          'text-muted-foreground',
        )}
        aria-hidden="true"
      />
      <Input
        type="search"
        name="q"
        value={value}
        onChange={(changeEvent) => setValue(changeEvent.target.value)}
        placeholder={placeholder}
        aria-label="Search events"
        className="pl-9 pr-9"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear search"
          className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
          onClick={() => {
            setValue('');
            writeQuery('');
          }}
        >
          <X aria-hidden="true" />
        </Button>
      )}
    </form>
  );
}
