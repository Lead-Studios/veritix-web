'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

  const filtered = attendees.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4">
      <Input placeholder="Search attendees" value={query} onChange={(e) => setQuery(e.target.value)} />
      <Table>
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
              <TableCell>{a.name}</TableCell>
              <TableCell>{a.email}</TableCell>
              <TableCell>{a.tier}</TableCell>
              <TableCell>{a.orderDate}</TableCell>
              <TableCell>{a.checkedIn ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
