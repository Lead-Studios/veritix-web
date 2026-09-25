'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { EventStatus } from '@/types';

interface PublishToggleProps {
  status: EventStatus;
  tierCount: number;
  onPublish: () => void;
  onUnpublish: () => void;
}

export function PublishToggle({
  status,
  tierCount,
  onPublish,
  onUnpublish,
}: PublishToggleProps) {
  // The reason the button is disabled lived only in `title`, which is not
  // reliably announced and is unreachable by keyboard. It is rendered as real
  // text and wired up with aria-describedby instead.
  const publishHintId = React.useId();
  const needsTier = tierCount === 0;

  if (status === 'published') {
    return (
      <Button variant="outline" onClick={onUnpublish}>
        Unpublish
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        onClick={onPublish}
        disabled={needsTier}
        aria-describedby={needsTier ? publishHintId : undefined}
      >
        Publish
      </Button>
      {needsTier && (
        <p id={publishHintId} className="text-sm text-muted-foreground">
          Add a ticket tier before publishing
        </p>
      )}
    </div>
  );
}
