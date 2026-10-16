'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface DeleteAccountProps {
  /** Typed back exactly to confirm — the same "type X to confirm" shape as
   * CancelEventDialog, so this reads as the same kind of irreversible action. */
  email: string;
  /** Blocks deletion outright while true; not gated by extra confirmation. */
  hasOutstandingTickets?: boolean;
  hasOutstandingPayouts?: boolean;
  onDelete: () => Promise<void>;
}

/**
 * Account deletion, in settings.
 *
 * Outstanding tickets or payouts block deletion entirely rather than being
 * an extra confirmation step: an account with a ticket still valid for entry,
 * or a payout still settling, has an unresolved claim against it that
 * deleting the account would orphan.
 */
export function DeleteAccount({
  email,
  hasOutstandingTickets = false,
  hasOutstandingPayouts = false,
  onDelete,
}: DeleteAccountProps) {
  const [confirmText, setConfirmText] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputId = React.useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const blocked = hasOutstandingTickets || hasOutstandingPayouts;
  const canConfirm = !blocked && confirmText.trim() === email;

  const submit = async () => {
    if (!canConfirm) return;

    setPending(true);
    setError(null);
    try {
      await onDelete();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'The account could not be deleted.',
      );
      setPending(false);
    }
    // No `finally` clearing `pending`: on success the caller navigates the
    // account away, and leaving the button disabled avoids a second submit
    // while that happens.
  };

  return (
    <div className="space-y-4 rounded-lg border border-destructive/50 p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium">Delete account</p>
        <p className="text-sm text-muted-foreground">
          This permanently removes your profile, saved settings, and connected wallet.
          Past orders and payout records are kept for as long as financial record-keeping
          rules require, even after the account is gone.
        </p>
      </div>

      {blocked ? (
        <p className="text-sm text-warning">
          {hasOutstandingTickets && hasOutstandingPayouts
            ? 'You have valid tickets and a payout in progress, so this account can\u2019t be deleted yet.'
            : hasOutstandingTickets
              ? 'You have a valid ticket for an upcoming event, so this account can\u2019t be deleted yet.'
              : 'You have a payout in progress, so this account can\u2019t be deleted yet.'}
        </p>
      ) : (
        <div className="space-y-3 border-t border-border pt-4">
          <div className="space-y-1.5">
            <Label htmlFor={inputId} required>
              Type “{email}” to confirm
            </Label>
            <Input
              id={inputId}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              required
              disabled={pending}
              aria-invalid={!canConfirm}
              aria-describedby={error ? errorId : hintId}
            />
            <p id={hintId} className="text-sm text-muted-foreground">
              {canConfirm
                ? 'Confirmed. The button below is now enabled.'
                : `The text must match “${email}” exactly.`}
            </p>
          </div>
          <Button
            variant="destructive"
            disabled={!canConfirm || pending}
            aria-busy={pending}
            onClick={submit}
          >
            {pending ? 'Deleting…' : 'Delete my account'}
          </Button>
          {error && (
            <p id={errorId} role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
