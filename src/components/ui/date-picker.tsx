'use client';

import * as React from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Format a date as an ISO 8601 calendar date from its *local* parts.
 *
 * Deliberately not `toISOString()`, which converts to UTC first: for anyone west
 * of Greenwich, midnight local is the previous day in UTC, so a picked date
 * would be emitted one day early. The calendar shows local days, so it must emit
 * local days.
 */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parse an ISO calendar date into a local midnight Date, or null if invalid. */
export function fromIsoDate(value: string): Date | null {
  if (!ISO_DATE.test(value)) return null;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  // Rejects overflow like 2026-02-31, which the Date constructor would roll over.
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const addMonths = (date: Date, months: number) =>
  new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
const isSameDay = (a: Date, b: Date) => toIsoDate(a) === toIsoDate(b);

/** Six weeks from the Sunday on or before the 1st, so the grid never reflows. */
function buildCalendarWeeks(month: Date): Date[][] {
  const first = startOfMonth(month);
  const gridStart = addDays(first, -first.getDay());

  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => addDays(gridStart, week * 7 + day)),
  );
}

export interface DatePickerProps {
  /** Selected date as an ISO calendar date (`YYYY-MM-DD`), or '' for none. */
  value: string;
  /** Receives an ISO calendar date, or '' when the field is cleared. */
  onChange: (value: string) => void;
  /** Visible label. Required, because a bare date field is unusable without one. */
  label: string;
  /** Inclusive lower bound, as an ISO calendar date. */
  min?: string;
  /** Inclusive upper bound, as an ISO calendar date. */
  max?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Date field for event scheduling: a typed text input plus a keyboard-navigable
 * calendar.
 *
 * The text input is the primary control rather than a fallback — typing
 * `2026-07-04` is faster than nine arrow presses, and it means the field works
 * with no pointer and no calendar open at all. The calendar is an optional
 * second path for browsing.
 *
 * Values are ISO calendar dates (`YYYY-MM-DD`) in both directions, matching the
 * string date fields on the domain types. A caller needing a full date-time
 * composes this with a time rather than this component guessing one.
 */
function DatePicker({
  value,
  onChange,
  label,
  min,
  max,
  id,
  disabled = false,
  className,
}: DatePickerProps) {
  const reactId = React.useId();
  const inputId = id ?? `${reactId}-input`;
  const dialogId = `${reactId}-dialog`;
  const errorId = `${reactId}-error`;

  const selected = React.useMemo(() => fromIsoDate(value), [value]);
  const minDate = React.useMemo(() => (min ? fromIsoDate(min) : null), [min]);
  const maxDate = React.useMemo(() => (max ? fromIsoDate(max) : null), [max]);

  const [open, setOpen] = React.useState(false);
  // What the user has typed, which may be mid-edit and not yet a valid date.
  const [draft, setDraft] = React.useState(value);
  const [invalid, setInvalid] = React.useState(false);
  const [focusedDate, setFocusedDate] = React.useState<Date>(selected ?? new Date());
  const [lastValue, setLastValue] = React.useState(value);

  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const activeDayRef = React.useRef<HTMLButtonElement | null>(null);

  // Keep the text input in step when `value` changes from outside.
  //
  // Adjusted during render rather than in an effect: React re-runs the component
  // immediately without painting the stale draft, so there is no flash of the
  // old text and no extra commit. An effect would also trip
  // react-hooks/set-state-in-effect.
  if (value !== lastValue) {
    setLastValue(value);
    setDraft(value);
    setInvalid(false);
  }

  const outOfRange = React.useCallback(
    (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    },
    [minDate, maxDate],
  );

  const commitDraft = React.useCallback(
    (raw: string) => {
      const trimmed = raw.trim();

      if (trimmed === '') {
        setInvalid(false);
        onChange('');
        return;
      }

      const parsed = fromIsoDate(trimmed);
      if (!parsed || outOfRange(parsed)) {
        setInvalid(true);
        return;
      }

      setInvalid(false);
      onChange(toIsoDate(parsed));
    },
    [onChange, outOfRange],
  );

  const selectDate = React.useCallback(
    (date: Date) => {
      if (outOfRange(date)) return;
      onChange(toIsoDate(date));
      setOpen(false);
      triggerRef.current?.focus();
    },
    [onChange, outOfRange],
  );

  const openCalendar = React.useCallback(() => {
    setFocusedDate(selected ?? new Date());
    setOpen(true);
  }, [selected]);

  // Move real DOM focus to whichever day is the current grid target.
  React.useEffect(() => {
    if (open) activeDayRef.current?.focus();
  }, [open, focusedDate]);

  const onGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: Date | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(focusedDate, -1);
        break;
      case 'ArrowRight':
        next = addDays(focusedDate, 1);
        break;
      case 'ArrowUp':
        next = addDays(focusedDate, -7);
        break;
      case 'ArrowDown':
        next = addDays(focusedDate, 7);
        break;
      case 'Home':
        next = addDays(focusedDate, -focusedDate.getDay());
        break;
      case 'End':
        next = addDays(focusedDate, 6 - focusedDate.getDay());
        break;
      case 'PageUp':
        next = addMonths(focusedDate, -1);
        break;
      case 'PageDown':
        next = addMonths(focusedDate, 1);
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectDate(focusedDate);
        return;
      default:
        return;
    }

    event.preventDefault();
    // Focus may move onto a bounded-out day; selection is what enforces the
    // bounds, so browsing past them stays possible without selecting them.
    setFocusedDate(next);
  };

  const weeks = React.useMemo(() => buildCalendarWeeks(focusedDate), [focusedDate]);
  const monthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(startOfMonth(focusedDate));

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={inputId}
        className="text-sm font-medium leading-none text-foreground"
      >
        {label}
      </label>

      <div className="relative flex items-center gap-2">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          placeholder="YYYY-MM-DD"
          value={draft}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => commitDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commitDraft(draft);
            }
          }}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive',
          )}
        />

        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-label={`Choose ${label} from a calendar`}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? dialogId : undefined}
          onClick={() => (open ? setOpen(false) : openCalendar())}
          className={cn(
            'inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition-colors',
            'hover:bg-secondary hover:text-secondary-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <CalendarDays className="size-4" aria-hidden="true" />
        </button>
      </div>

      {invalid && (
        <p id={errorId} className="text-sm text-destructive">
          Enter a date as YYYY-MM-DD{min || max ? ', within the allowed range' : ''}.
        </p>
      )}

      {open && (
        <div
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-label={`${label} calendar`}
          className="absolute z-50 mt-2 w-[19rem] translate-y-20 rounded-[var(--radius)] border border-border bg-popover p-3 text-popover-foreground shadow-md"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setFocusedDate(addMonths(focusedDate, -1))}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>

            {/* aria-live so month changes are announced to a screen reader. */}
            <span aria-live="polite" className="text-sm font-medium">
              {monthLabel}
            </span>

            <button
              type="button"
              aria-label="Next month"
              onClick={() => setFocusedDate(addMonths(focusedDate, 1))}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div role="grid" aria-label={monthLabel} onKeyDown={onGridKeyDown}>
            <div role="row" className="mb-1 grid grid-cols-7">
              {WEEKDAYS.map((day) => (
                <span
                  key={day}
                  role="columnheader"
                  aria-label={day}
                  className="text-center text-xs text-muted-foreground"
                >
                  {day}
                </span>
              ))}
            </div>

            {weeks.map((week) => (
              <div role="row" key={toIsoDate(week[0])} className="grid grid-cols-7">
                {week.map((day) => {
                  const iso = toIsoDate(day);
                  const isSelected = selected !== null && isSameDay(day, selected);
                  const isFocused = isSameDay(day, focusedDate);
                  const isOutside = day.getMonth() !== focusedDate.getMonth();
                  const isDisabled = outOfRange(day);

                  return (
                    <div role="gridcell" key={iso} aria-selected={isSelected}>
                      <button
                        ref={isFocused ? activeDayRef : undefined}
                        type="button"
                        // Roving tabindex: the grid is one tab stop, so Tab
                        // leaves the calendar instead of visiting 42 days.
                        tabIndex={isFocused ? 0 : -1}
                        aria-label={new Intl.DateTimeFormat('en-US', {
                          dateStyle: 'long',
                        }).format(day)}
                        aria-current={isSelected ? 'date' : undefined}
                        aria-disabled={isDisabled || undefined}
                        onClick={() => selectDate(day)}
                        className={cn(
                          'size-9 rounded-md text-sm transition-colors',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
                          isOutside && 'text-muted-foreground/60',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary hover:text-secondary-foreground',
                          isDisabled && 'pointer-events-none opacity-40',
                        )}
                      >
                        {day.getDate()}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { DatePicker };
