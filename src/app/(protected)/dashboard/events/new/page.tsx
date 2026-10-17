'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TierEditor } from '@/components/dashboard/tier-editor';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ApiError, api } from '@/lib/api-client';
import { routes } from '@/lib/routes';
// The same rules the API enforces, including "end date not before start date".
import { eventBasicsSchema } from '@/lib/event-schema';
import type { VeritixEvent } from '@/types';

const EMPTY = {
  title: '',
  description: '',
  venue: '',
  city: '',
  startsAt: '',
  endsAt: '',
};

/**
 * The API refuses to persist an event without at least one ticket tier, but
 * this first step only collects the basics. Rather than dead-end on a field
 * the user cannot see, creation seeds a single placeholder tier that the
 * organizer renames, prices, and sizes on the edit page it lands on.
 */
const PLACEHOLDER_TIER = {
  name: 'General admission',
  priceMinor: 0,
  currency: 'USD',
  quantityTotal: 100,
} as const;

/** Field paths the form can render inline; anything else is listed at the end. */
const INLINE_FIELDS = ['title', 'description', 'venue', 'city', 'startsAt', 'endsAt'] as const;

interface ApiFieldError {
  field: string;
  message: string;
}

function readFieldErrors(error: unknown): { message: string | null; fields: Record<string, string> } {
  if (!(error instanceof ApiError)) {
    return { message: error instanceof Error ? error.message : null, fields: {} };
  }

  const body = error.body as { message?: unknown; fields?: unknown } | undefined;
  const fields: Record<string, string> = {};

  if (Array.isArray(body?.fields)) {
    for (const entry of body.fields as ApiFieldError[]) {
      if (entry && typeof entry.field === 'string' && !fields[entry.field]) {
        fields[entry.field] = entry.message;
      }
    }
  }

  return {
    message: typeof body?.message === 'string' ? body.message : error.message,
    fields,
  };
}

export default function NewEventPage() {
  const router = useRouter();
  const [values, setValues] = React.useState(EMPTY);
  // Nothing is flagged until the form has been touched: a `role="alert"` that
  // renders on mount fires as soon as the page loads and tells the user about
  // a field they have not even looked at yet.
  const [touched, setTouched] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [serverErrors, setServerErrors] = React.useState<Record<string, string>>({});
  const [formError, setFormError] = React.useState<string | null>(null);

  const result = eventBasicsSchema.safeParse(values);
  // Field-level messages, so each control can point at the one thing wrong with
  // it. The previous single paragraph said "fill in every field" and was
  // associated with nothing.
  const errors = React.useMemo(() => {
    const map: Record<string, string> = {};
    if (result.success) return map;
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? '');
      if (key && !map[key]) map[key] = issue.message;
    }
    return map;
  }, [result]);

  // A message from the server takes precedence over the local one for the same
  // field: it is the authority, and it is what the save actually failed on.
  const errorFor = (key: string): string | undefined =>
    serverErrors[key] ?? (touched ? errors[key] : undefined);

  const clearServerError = (key: string) => {
    setServerErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const set =
    (key: keyof typeof EMPTY) => (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setTouched(true);
      clearServerError(key);
      setValues((current) => ({ ...current, [key]: event.target.value }));
    };

  const setDate = (key: 'startsAt' | 'endsAt') => (value: string) => {
    setTouched(true);
    clearServerError(key);
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    setFormError(null);
    if (!result.success || submitting) return;

    setSubmitting(true);
    try {
      const created = await api.post<VeritixEvent>('/events', {
        title: values.title.trim(),
        description: values.description.trim(),
        venue: values.venue.trim(),
        city: values.city.trim(),
        startsAt: values.startsAt,
        endsAt: values.endsAt,
        tiers: [PLACEHOLDER_TIER],
        splits: [],
      });

      router.push(routes.dashboardEventEdit(created.id));
    } catch (error) {
      const { message, fields } = readFieldErrors(error);
      setServerErrors(fields);
      setFormError(message ?? 'Could not create the event');
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { key: 'title' as const, label: 'Title' },
    { key: 'venue' as const, label: 'Venue' },
    { key: 'city' as const, label: 'City' },
  ];

  const startsAtError = errorFor('startsAt');
  const endsAtError = errorFor('endsAt');
  // The server can reject fields the form does not render inline (tiers,
  // splits). Those are surfaced in one list so nothing is silently dropped.
  const unattachedErrors = Object.entries(serverErrors).filter(
    ([key]) => !INLINE_FIELDS.includes(key as (typeof INLINE_FIELDS)[number]),
  );

  return (
    <div className="space-y-6">
      {/* The page had no heading at all, so a screen-reader user arrived at
          six unlabelled fields with no indication of what they were filling in. */}
      <h1 className="text-2xl font-semibold">New event</h1>

      <form className="space-y-6" noValidate onSubmit={handleSubmit}>
        <fieldset className="space-y-4">
          {/* Groups the basics so a screen reader announces them as one set
              instead of six unlabelled boxes. */}
          <legend className="text-sm font-medium text-muted-foreground">Event basics</legend>

          {fields.map((field) => {
            const inputId = `event-${field.key}`;
            const errorId = `${inputId}-error`;
            const error = errorFor(field.key);
            return (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={inputId} required>
                  {field.label}
                </Label>
                <Input
                  id={inputId}
                  value={values[field.key]}
                  onChange={set(field.key)}
                  required
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                />
                {/* The single error summary below would not be reachable from the
                    control that caused the problem, so each one is described
                    inline too. */}
                {error && (
                  <p id={errorId} className="text-sm text-destructive">
                    {error}
                  </p>
                )}
              </div>
            );
          })}

          <div className="space-y-1.5">
            <Label htmlFor="event-description" required>
              Description
            </Label>
            {/* `description` was in the schema and in the state but had no
                control at all, so its "required" rule could never be satisfied. */}
            <Textarea
              id="event-description"
              value={values.description}
              onChange={set('description')}
              required
              aria-invalid={errorFor('description') ? true : undefined}
              aria-describedby={
                errorFor('description') ? 'event-description-error' : undefined
              }
            />
            {errorFor('description') && (
              <p id="event-description-error" className="text-sm text-destructive">
                {errorFor('description')}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-medium text-muted-foreground">Schedule</legend>
          <DatePicker
            id="event-starts-at"
            label="Start date"
            value={values.startsAt}
            onChange={setDate('startsAt')}
          />
          {startsAtError && values.startsAt && (
            <p id="event-starts-at-error" className="text-sm text-destructive">
              {startsAtError}
            </p>
          )}
          <DatePicker
            id="event-ends-at"
            label="End date"
            value={values.endsAt}
            onChange={setDate('endsAt')}
          />
          {endsAtError && values.startsAt && values.endsAt && (
            <p id="event-ends-at-error" className="text-sm text-destructive">
              {endsAtError}
            </p>
          )}
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-medium text-muted-foreground">Ticket tiers</legend>
          <TierEditor tiers={tiers} onChange={setTiers} />
          {touched && tiers.length === 0 && (
            <p role="alert" className="text-sm text-destructive">
              At least one tier is required.
            </p>
          )}
        </fieldset>

        {/* role="alert" so the summary is announced the moment it appears; a bare
            <p> is inserted silently and most users never notice it. */}
        {touched && !result.success && (
          <p role="alert" className="text-sm text-destructive">
            Fill in every required field to continue. {Object.keys(errors).length} field
            {Object.keys(errors).length === 1 ? '' : 's'} still need attention.
          </p>
        )}

        {/* Whatever the server rejected that is not tied to a control above,
            said plainly rather than swallowed. */}
        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}
        {unattachedErrors.length > 0 && (
          <ul role="alert" className="list-inside list-disc text-sm text-destructive">
            {unattachedErrors.map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting && <Spinner label={null} />}
            {submitting ? 'Creating…' : 'Create event'}
          </Button>
          <p className="text-sm text-muted-foreground">
            A draft is created first, so nothing is published by accident.
          </p>
        </div>
      </form>
    </div>
  );
}
