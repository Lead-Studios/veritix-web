'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import type { VeritixEvent } from '@/types';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const [event] = React.useState<VeritixEvent | null>(null);

  if (!event) {
    return <p className="text-sm text-muted-foreground">Loading event…</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Edit {event.title}</h1>
      {event.tiers.map((tier) => (
        <p key={tier.id} className="text-sm text-muted-foreground">
          {tier.name}
          {tier.quantitySold > 0 ? ' — locked, already has sales' : ''}
        </p>
      ))}
    </div>
  );
}
