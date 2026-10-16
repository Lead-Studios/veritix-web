'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useToast } from '@/components/ui/toast';
import { ApiError, api } from '@/lib/api-client';
import { formatDateTime } from '@/lib/format';

interface Attendee {
  ticketId: string;
  name: string;
  email: string;
  tier: string;
  orderDate: string;
  checkedIn: boolean;
  /** How the ticket was checked in. `manual` means staff did it from this page. */
  checkInMethod?: 'scan' | 'manual';
  /** ISO timestamp of the check-in, stamped by the server. */
  checkedInAt?: string;
  /** Display name of the staff member who performed a manual check-in. */
  checkedInBy?: string;
}

/**
 * What the backend returns for a manual check-in. The performer and time are
 * taken from the session on the server, never sent from here: an audit field
 * the browser could fill in is not an audit trail.
 */
interface ManualCheckInResponse {
  checkedInAt: string;
  checkedInBy: string;
}

export default function AttendeesPage() {
  const { id } = useParams<{ id: string }>();
  const [query, setQuery] = React.useState('');
  const [attendees, setAttendees] = React.useState<Attendee[]>([]);
  const [pending, setPending] = React.useState<Attendee | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const { toast } = useToast();

  const confirmCheckIn = async () => {
    if (!pending) return;
    const target = pending;
    setSubmitting(true);
    try {
      const result = await api.post<ManualCheckInResponse>(
        `/events/${encodeURIComponent(id)}/attendees/${encodeURIComponent(target.ticketId)}/check-in`,
        { method: 'manual' },
      );
      setAttendees((current) =>
        current.map((a) =>
          a.ticketId === target.ticketId
            ? {
                ...a,
                checkedIn: true,
                checkInMethod: 'manual',
                checkedInAt: result.checkedInAt,
                checkedInBy: result.checkedInBy,
              }
            : a,
        ),
      );
      setPending(null);
      toast({ title: `${target.name} checked in`, variant: 'success' });
    } catch (error) {
      // A 409 means someone else (or a scanner) got there first; say so rather
      // than a generic failure, since the attendee is in fact inside.
      const alreadyIn = error instanceof ApiError && error.status === 409;
      toast({
        title: alreadyIn ? `${target.name} is already checked in` : 'Check-in failed',
        description: alreadyIn
          ? 'Refresh the list to see who checked them in.'
          : error instanceof Error
            ? error.message
            : 'Try again.',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

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
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((a) => (
            <TableRow key={a.ticketId}>
              <TableCell data-label="Name">{a.name}</TableCell>
              <TableCell data-label="Email">{a.email}</TableCell>
              <TableCell data-label="Tier">{a.tier}</TableCell>
              <TableCell data-label="Order date">{a.orderDate}</TableCell>
              {/* "Yes"/"No" alone is ambiguous when read out of context; the
                  cell header supplies the rest. */}
              <TableCell data-label="Checked in">
                {a.checkedIn ? 'Yes' : 'No'}
                {a.checkInMethod === 'manual' && (
                  <span className="mt-1 block text-xs text-muted-foreground">
                    <Badge variant="outline" className="mr-1">
                      Manual
                    </Badge>
                    {a.checkedInBy ? `by ${a.checkedInBy}` : ''}
                    {a.checkedInAt ? ` at ${formatDateTime(a.checkedInAt)}` : ''}
                  </span>
                )}
              </TableCell>
              <TableCell data-label="Actions">
                {!a.checkedIn && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPending(a)}
                    aria-label={`Check in ${a.name}`}
                  >
                    Check in
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open && !submitting) setPending(null);
        }}
      >
        <DialogContent closeOnOverlayClick={!submitting}>
          <DialogHeader>
            <DialogTitle>Check in {pending?.name}?</DialogTitle>
            <DialogDescription>
              Use this when the attendee cannot show their ticket. Confirm their identity first:
              the check-in is recorded under your account with the current time, and their ticket
              ({pending?.tier}, {pending?.email}) can no longer be scanned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={confirmCheckIn} disabled={submitting}>
              {submitting ? 'Checking in…' : 'Confirm check-in'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
