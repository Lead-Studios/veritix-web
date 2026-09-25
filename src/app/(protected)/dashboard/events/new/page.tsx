'use client';

import * as React from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';

const eventBasicsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  venue: z.string().min(1, 'Venue is required'),
  city: z.string().min(1, 'City is required'),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
});

const EMPTY = {
  title: '',
  description: '',
  venue: '',
  city: '',
  startsAt: '',
  endsAt: '',
};

export default function NewEventPage() {
  const [values, setValues] = React.useState(EMPTY);
  // Nothing is flagged until the form has been touched: a `role="alert"` that
  // renders on mount fires as soon as the page loads and tells the user about
  // a field they have not even looked at yet.
  const [touched, setTouched] = React.useState(false);

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

  const set =
    (key: keyof typeof EMPTY) => (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setTouched(true);
      setValues((current) => ({ ...current, [key]: event.target.value }));
    };

  const fields = [
    { key: 'title' as const, label: 'Title' },
    { key: 'venue' as const, label: 'Venue' },
    { key: 'city' as const, label: 'City' },
  ];

  return (
    <div className="space-y-6">
      {/* The page had no heading at all, so a screen-reader user arrived at
          six unlabelled fields with no indication of what they were filling in. */}
      <h1 className="text-2xl font-semibold">New event</h1>

      <form className="space-y-6" noValidate>
        <fieldset className="space-y-4">
          {/* Groups the basics so a screen reader announces them as one set
              instead of six unlabelled boxes. */}
          <legend className="text-sm font-medium text-muted-foreground">Event basics</legend>

          {fields.map((field) => {
            const inputId = `event-${field.key}`;
            const errorId = `${inputId}-error`;
            const error = touched ? errors[field.key] : undefined;
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
              aria-invalid={touched && errors.description ? true : undefined}
              aria-describedby={
                touched && errors.description ? 'event-description-error' : undefined
              }
            />
            {touched && errors.description && (
              <p id="event-description-error" className="text-sm text-destructive">
                {errors.description}
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
            onChange={(v) => setValues((current) => ({ ...current, startsAt: v }))}
          />
          <DatePicker
            id="event-ends-at"
            label="End date"
            value={values.endsAt}
            onChange={(v) => setValues((current) => ({ ...current, endsAt: v }))}
          />
        </fieldset>

        {/* role="alert" so the summary is announced the moment it appears; a bare
            <p> is inserted silently and most users never notice it. */}
        {touched && !result.success && (
          <p role="alert" className="text-sm text-destructive">
            Fill in every required field to continue. {Object.keys(errors).length} field
            {Object.keys(errors).length === 1 ? '' : 's'} still need attention.
          </p>
        )}
      </form>
    </div>
  );
}
