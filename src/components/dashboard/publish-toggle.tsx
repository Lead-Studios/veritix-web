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

export function PublishToggle({ status, tierCount, onPublish, onUnpublish }: PublishToggleProps) {
  if (status === 'published') {
    return <Button variant="outline" onClick={onUnpublish}>Unpublish</Button>;
  }

  return (
    <Button onClick={onPublish} disabled={tierCount === 0} title={tierCount === 0 ? 'Add a ticket tier before publishing' : undefined}>
      Publish
    </Button>
  );
}
