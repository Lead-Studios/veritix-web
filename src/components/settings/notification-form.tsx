'use client';

import * as React from 'react';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { api, fetcher } from '@/lib/api-client';

/**
 * What the platform emails a user.
 *
 * Each toggle saves on change rather than behind a Save button: these are
 * independent preferences and a user switching off marketing should not have to
 * hunt for a button. The trade is that a slow or failed save can leave the
 * switch showing the wrong thing, so the toggle is optimistic and reverts to
 * the last known-good value when the request fails. The confirmed value is only
 * updated once the server has agreed, which is what the next render reads.
 */

export interface NotificationPreferences {
  /** Reminders before an event the user holds a ticket for. */
  eventReminders: boolean;
  /** Receipts and order confirmations. Transactional, so default is on. */
  orderReceipts: boolean;
  /** Product news and offers. Off unless the user opts in. */
  marketing: boolean;
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  eventReminders: true,
  orderReceipts: true,
  marketing: false,
};

export const PREFERENCE_KEYS = ['eventReminders', 'orderReceipts', 'marketing'] as const;

export type PreferenceKey = (typeof PREFERENCE_KEYS)[number];

export const PREFERENCE_PATH = '/settings/notifications';

const LABELS: Record<PreferenceKey, { title: string; description: string }> = {
  eventReminders: {
    title: 'Event reminders',
    description: 'A nudge before an event you hold a ticket for.',
  },
  orderReceipts: {
    title: 'Order receipts',
    description: 'Confirmations and receipts for your purchases and transfers.',
  },
  marketing: {
    title: 'Product news',
    description: 'Occasional emails about features, events, and offers.',
  },
};

export interface NotificationFormProps {
  /** Pre-loaded preferences, so the page can pass what it already fetched. */
  initial?: NotificationPreferences;
  className?: string;
}

export function NotificationForm({ initial, className }: NotificationFormProps) {
  const { data, mutate, isLoading } = useSWR<NotificationPreferences>(
    initial ? null : PREFERENCE_PATH,
    fetcher,
  );

  // `data` is the server's answer and the only thing written back on failure;
  // `pending` is the optimistic value on screen. They are kept separate on
  // purpose, so a failed save has a known-good value to revert to.
  const confirmed = data ?? initial ?? DEFAULT_PREFERENCES;
  const [pending, setPending] = React.useState<NotificationPreferences>(confirmed);
  const [savingKey, setSavingKey] = React.useState<PreferenceKey | null>(null);

  const handleToggle = async (key: PreferenceKey, next: boolean) => {
    if (savingKey) return;
    const previous = pending;

    setPending({ ...pending, [key]: next });
    setSavingKey(key);

    try {
      const saved = await api.patch<NotificationPreferences>(PREFERENCE_PATH, { [key]: next });
      // Trust the server's copy of the whole set, not just the toggle, so a
      // default the platform applies server-side is not overwritten locally.
      const confirmedNext = { ...previous, ...saved };
      setPending(confirmedNext);
      await mutate(confirmedNext, { revalidate: false });
      toast.success(`${LABELS[key].title} updated`);
    } catch (error) {
      setPending(previous);
      toast.error(
        error instanceof Error ? error.message : `Could not update ${LABELS[key].title.toLowerCase()}`,
      );
    } finally {
      setSavingKey(null);
    }
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)} data-testid="notification-preferences-loading">
        {PREFERENCE_KEYS.map((key) => (
          <Skeleton key={key} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ul className={cn('divide-y', className)}>
      {PREFERENCE_KEYS.map((key) => {
        const checked = pending[key];
        const busy = savingKey === key;
        // Only the row being saved is disabled: the others stay usable.
        const disabled = savingKey !== null;

        return (
          <li key={key} className="flex items-start justify-between gap-6 py-4 first:pt-0 last:pb-0">
            <div className="space-y-0.5">
              <label htmlFor={`preference-${key}`} className="text-sm font-medium">
                {LABELS[key].title}
              </label>
              <p className="text-sm text-muted-foreground">{LABELS[key].description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 pt-0.5">
              {busy && <Spinner label={null} />}
              <Switch
                id={`preference-${key}`}
                checked={checked}
                onCheckedChange={(next) => void handleToggle(key, next)}
                disabled={disabled}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
