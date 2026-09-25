'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TransferDialogProps {
  onTransfer: (recipient: string) => Promise<void>;
}

export function TransferDialog({ onTransfer }: TransferDialogProps) {
  const [recipient, setRecipient] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(false);

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <Input
        placeholder="Recipient email or wallet address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
        I understand this transfer is irreversible.
      </label>
      <Button disabled={!recipient || !confirmed} onClick={() => onTransfer(recipient)}>
        Transfer ticket
      </Button>
    </div>
  );
}
