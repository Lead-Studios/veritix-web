'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TransferDialogProps {
  onTransfer: (recipient: string) => Promise<void>;
}

export function TransferDialog({ onTransfer }: TransferDialogProps) {
  const [recipient, setRecipient] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const recipientId = React.useId();
  const errorId = `${recipientId}-error`;

  const submit = async () => {
    setPending(true);
    setError(null);
    try {
      await onTransfer(recipient);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'The transfer could not be completed.',
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="space-y-1.5">
        <Label htmlFor={recipientId} required>
          Recipient email or wallet address
        </Label>
        <Input
          id={recipientId}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </div>
      {/* The raw <input type="checkbox"> here had no focus ring, unlike
          ui/checkbox, and its consequence was only implied by the label text. */}
      <div className="flex items-start gap-2">
        <Checkbox
          id={`${recipientId}-confirm`}
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
        />
        <Label htmlFor={`${recipientId}-confirm`} className="font-normal leading-snug">
          I understand this transfer is irreversible and the ticket cannot be returned to you.
        </Label>
      </div>
      {/* A pending state: the handler returns a promise, and without one the
          button stays live and a second transfer can be fired. */}
      <Button
        disabled={!recipient || !confirmed || pending}
        aria-busy={pending}
        onClick={submit}
      >
        {pending ? 'Transferring…' : 'Transfer ticket'}
      </Button>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
