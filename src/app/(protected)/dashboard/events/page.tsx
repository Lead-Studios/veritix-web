'use client';

import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { VeritixEvent } from '@/types';

export default function OrganizerEventsPage() {
  const [events] = React.useState<VeritixEvent[]>([]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>{event.title}</TableCell>
            <TableCell><Badge>{event.status}</Badge></TableCell>
            <TableCell>Edit · Duplicate · View</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
