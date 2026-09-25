'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/feedback/loading-state';
import type { VeritixEvent } from '@/types';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const [event] = React.useState<VeritixEvent | null>(null);

  if (!event) {
    // role="status" lives inside LoadingState. A bare paragraph announcing
    // nothing leaves the user unsure whether the page is empty or still working.
    return <LoadingState label={`Loading event ${id}…`} />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Edit {event.title}</h1>
      <ul className="space-y-2">
        {event.tiers.map((tier) => (
          <li key={tier.id} className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-foreground">{tier.name}</span>
            {tier.quantitySold > 0 ? (
              // Was a bare conditional string; a Badge makes the state
              // scannable, and the reason is spelled out rather than implied.
              <Badge variant="warning">
                Locked — {tier.quantitySold} already sold, so this tier can no longer be
                renamed or removed
              </Badge>
            ) : (
              <Badge variant="outline">Editable</Badge>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
