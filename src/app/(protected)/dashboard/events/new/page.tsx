'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useEventDraft } from '@/hooks/use-event-draft';
import { SplitEditor, type SplitRow } from '@/components/dashboard/split-editor';
import { eventBasicsSchema } from '@/lib/event-schema';
import { api } from '@/lib/api-client';
import { toast } from 'react-toastify';
import { routes } from '@/lib/routes';

const EMPTY = {
  title: '',
  description: '',
  venue: '',
  city: '',
  startsAt: '',
  endsAt: '',
};

export default function NewEventPage() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useEventDraft<Record<string, any>>(EMPTY);
  const [splits, setSplits] = React.useState<SplitRow[]>([{ walletAddress: '', percentage: 0 }]);
  const [touched, setTouched] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const values = { ...EMPTY, ...(draft ?? {}) };

  const result = eventBasicsSchema.safeParse(values);
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
    (key: keyof typeof EMPTY) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTouched(true);
      setDraft({ ...values, [key]: event.target.value });
    };

  const fields = [
    { key: 'title' as const, label: 'Title' },
    { key: 'venue' as const, label: 'Venue' },
    { key: 'city' as const, label: 'City' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!result.success) return;
    setSubmitting(true);
    try {
      await api.post('/api/events', {
        ...values,
        splits: splits
          .filter((s) => s.walletAddress.trim() || s.percentage !== 0)
          .map((s) => ({ recipient: s.walletAddress, percent: s.percentage })),
      });
      clearDraft();
      toast.success('Event created');
      router.push(routes.dashboardEvents);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New event</h1>
      <form className="space-y-6" noValidate onSubmit={handleSubmit}>
        <fieldset className="space-y-4">
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
            <Textarea
              id="event-description"
              value={values.description}
              onChange={set('description')}
              required
              aria-invalid={touched && errors.description ? true : undefined}
              aria-describedby={touched && errors.description ? 'event-description-error' : undefined}
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
            onChange={(v) => {
              setTouched(true);
              setDraft({ ...values, startsAt: v });
            }}
          />
          <DatePicker
            id="event-ends-at"
            label="End date"
            value={values.endsAt}
            onChange={(v) => {
              setTouched(true);
              setDraft({ ...values, endsAt: v });
            }}
          />
          {touched && errors.endsAt && values.startsAt && values.endsAt && (
            <p id="event-ends-at-error" className="text-sm text-destructive">
              {errors.endsAt}
            </p>
          )}
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-medium text-muted-foreground">Revenue splits</legend>
          <SplitEditor rows={splits} onChange={setSplits} />
        </fieldset>

        {touched && !result.success && (
          <p role="alert" className="text-sm text-destructive">
            Fill in every required field to continue. {Object.keys(errors).length} field
            {Object.keys(errors).length === 1 ? '' : 's'} still need attention.
          </p>
        )}

        <Button type="submit" disabled={submitting}>
          {submitting && <Spinner label={null} />}
          {submitting ? 'Creating…' : 'Create event'}
        </Button>
      </form>
    </div>
  );
}
