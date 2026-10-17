'use client';

import useSWR from 'swr';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { formatCurrency, formatDate } from '@/lib/format';
import type { PayoutsSnapshot } from '@/lib/payouts';

/**
 * Raw `bg-green-100`/`bg-yellow-100` pairs were unreadable in dark mode.
 */
const STATUS_VARIANT = {
  Settled: 'success',
  Escrowed: 'warning',
} as const;

const PAYOUTS_KEY = '/payouts';

export default function PayoutsPage() {
  const { data, error, isLoading, mutate } = useSWR<PayoutsSnapshot>(PAYOUTS_KEY);

  const heading = (
    <div>
      <h1 className="text-2xl font-semibold">Payouts</h1>
      <p className="text-sm text-muted-foreground">
        Total still held in escrow:{' '}
        <span className="font-medium text-foreground">
          {formatCurrency(data?.totalEscrowedMinor ?? 0, data?.currency ?? 'USD')}
        </span>
      </p>
    </div>
  );

  if (error) {
    return (
      <div className="space-y-6">
        {heading}
        <ErrorState
          title="We could not load your payouts"
          description="Your settlement history is unavailable right now. Try again in a moment."
          onRetry={() => mutate()}
        />
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        {heading}
        <p role="status" className="sr-only">
          Loading payouts
        </p>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12" />
          ))}
        </div>
      </div>
    );
  }

  const items = data?.items ?? [];
  const currency = data?.currency ?? 'USD';

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        {heading}
        <EmptyState
          title="No payouts yet"
          description="Escrowed and settled payouts for your events will appear here."
        />
      </div>
    );
  }

  return (
    // A <div>, not a second <main>: the protected layout already renders
    // <main id="main">, and a nested main is two landmarks where there should
    // be one. The layout also supplies the page padding.
    <div className="space-y-6">
      {heading}
      <div className="rounded-lg border border-border">
        <Table>
          {/* Without a caption the table is announced as a bare grid, and the
              header row repeats "Escrow Ref Amount Status…" on every cell. */}
          <TableCaption className="sr-only">Escrowed and settled payouts</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Escrow Ref</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Settlement Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((payout) => (
              <TableRow key={payout.ref}>
                <TableCell data-label="Escrow Ref" className="font-mono">
                  {payout.ref}
                </TableCell>
                <TableCell data-label="Amount">{formatCurrency(payout.amountMinor, currency)}</TableCell>
                <TableCell data-label="Status">
                  <Badge variant={STATUS_VARIANT[payout.status]}>{payout.status}</Badge>
                </TableCell>
                <TableCell data-label="Settlement Date" className="text-muted-foreground">
                  {/* An empty cell announced as "blank" is indistinguishable
                      from a rendering bug; say why it is empty. */}
                  {payout.settledAt ? formatDate(`${payout.settledAt}T00:00:00`) : 'Pending'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
