'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PromoCodeProps {
  onApply: (code: string) => Promise<{ valid: boolean; discountMinor?: number; message?: string }>;
}

export function PromoCode({ onApply }: PromoCodeProps) {
  const [code, setCode] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);

  const handleApply = async () => {
    const result = await onApply(code);
    setMessage(result.valid ? `Discount applied: ${result.discountMinor}` : result.message ?? 'Invalid or expired code');
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input placeholder="Promo code" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button variant="outline" onClick={handleApply} disabled={!code.trim()}>Apply</Button>
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
