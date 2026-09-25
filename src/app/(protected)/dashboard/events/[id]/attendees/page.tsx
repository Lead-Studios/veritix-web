'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Attendee {
  name: string;
  email: string;
  tier: string;
  orderDate: string;
  checkedIn: boolean;
}

export default function AttendeesPage() {
  const { id } = useParams<{ id: string }>();
  const [query, setQuery] = React.useState('');
  const [attendees] = React.useState<Attendee[]>([]);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return attendees;
    return attendees.filter((a) => a.name.toLowerCase().includes(needle));
  }, [attendees, query]);

  return (
    <div className="space-y-4">
      {/* The page had no heading, so the search box and the table floated with
          nothing to orient by. */}
      <h1 className="text-2xl font-semibold">Attendees</h1>

      <div className="space-y-1.5">
        {/* The placeholder was the only thing naming this control, and it
            disappears as soon as the user types. */}
        <Label htmlFor="attendee-search">Search attendees</Label>
        <Input
          id="attendee-search"
          type="search"
          value={query}
          placeholder="Name"
          onChange={(e) => setQuery(e.target.value)}
          aria-describedby="attendee-result-count"
        />
      </div>

      {/* Typing in the search box changed the table silently. Announcing the
          count is the only way a non-sighted user knows the filter ran. */}
      <p
        id="attendee-result-count"
        role="status"
        className="text-sm text-muted-foreground"
      >
        Showing {filtered.length} of {attendees.length}{' '}
        {attendees.length === 1 ? 'attendee' : 'attendees'} for event {id}
        {query.trim() ? ` matching “${query.trim()}”` : ''}.
      </p>

      <Table>
        <TableCaption className="sr-only">Attendees for event {id}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Order date</TableHead>
            <TableHead>Checked in</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((a) => (
            <TableRow key={a.email}>
              <TableCell data-label="Name">{a.name}</TableCell>
              <TableCell data-label="Email">{a.email}</TableCell>
              <TableCell data-label="Tier">{a.tier}</TableCell>
              <TableCell data-label="Order date">{a.orderDate}</TableCell>
              {/* "Yes"/"No" alone is ambiguous when read out of context; the
                  cell header supplies the rest. */}
              <TableCell data-label="Checked in">{a.checkedIn ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
