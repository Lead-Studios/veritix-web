'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useEventFilters } from '@/hooks/use-event-filters';

export interface EventSearchProps {
  delayMs?: number;
  placeholder?: string;
  className?: string;
}

export function EventSearch({
  delayMs = 350,
  placeholder = 'Search events, artists, or venues',
  className,
}: EventSearchProps) {
  const { filters, setFilter } = useEventFilters(['q']);
  const queryInUrl = (filters as any).q ?? '';

  const [value, setValue] = React.useState(queryInUrl);
  const [lastQueryInUrl, setLastQueryInUrl] = React.useState(queryInUrl);

  if (queryInUrl !== lastQueryInUrl) {
    setLastQueryInUrl(queryInUrl);
    setValue(queryInUrl);
  }

  const writeQuery = React.useCallback(
    (nextValue: string) => {
      setFilter('q', nextValue);
    },
    [setFilter],
  );

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
