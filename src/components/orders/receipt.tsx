'use client';

import { Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import type { Order, VeritixEvent } from '@/types';

/**
 * Receipt the buyer can keep — for expenses, or for chasing a refund.
 *
 * Everything is derived from the order and the event it belongs to, so the
 * numbers here always match what was actually charged. Printing hides the app
 * chrome (see the `@media print` block in `global.css`) and leaves just the
 * receipt on the page.
 */

export interface ReceiptProps {
  order: Order;
  event: VeritixEvent;
  /** On-chain or processor reference for the payment. */
  paymentReference?: string;
}

interface ReceiptLine {
  tierId: string;
  name: string;
  quantity: number;
  unitMinor: number;
}

/** Group the issued tickets by tier, since the order only stores tier ids. */
function summariseLines(order: Order, event: VeritixEvent): ReceiptLine[] {
  const counts = new Map<string, number>();

  for (const ticket of order.tickets) {
    counts.set(ticket.tierId, (counts.get(ticket.tierId) ?? 0) + 1);
  }

  return [...counts.entries()].map(([tierId, quantity]) => {
    const tier = event.tiers.find((candidate) => candidate.id === tierId);
    return {
      tierId,
      name: tier?.name ?? 'Ticket',
      quantity,
      unitMinor: tier?.priceMinor ?? 0,
    };
  });
}

export function Receipt({ order, event, paymentReference }: ReceiptProps) {
  const lines = summariseLines(order, event);
  const escrowReference = order.tickets.find((ticket) => ticket.escrowId)?.escrowId;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex justify-end print:hidden">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer aria-hidden="true" />
          Print receipt
        </Button>
      </div>

      <article
        data-receipt
        aria-label={`Receipt for order ${order.id}`}
        className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold tracking-tight">Veritix</p>
            <p className="text-sm text-muted-foreground">Payment receipt</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-medium">Receipt {order.id}</p>
            <p className="text-muted-foreground">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>

        <Separator className="my-6" />

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Event</dt>
            <dd className="text-sm font-medium">{event.title}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Venue</dt>
            <dd className="text-sm font-medium">
              {event.venue}, {event.city}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Event date</dt>
            <dd className="text-sm font-medium">{formatDate(event.startsAt)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Status</dt>
            <dd className="mt-1">
              <Badge variant={order.status === 'paid' ? 'success' : 'secondary'}>
                {order.status}
              </Badge>
            </dd>
          </div>
        </dl>

        <Separator className="my-6" />

        <table className="w-full text-sm">
          <caption className="sr-only">Tickets purchased</caption>
          <thead>
            <tr className="text-left text-muted-foreground">
              <th scope="col" className="pb-2 font-medium">
                Ticket
              </th>
              <th scope="col" className="pb-2 text-right font-medium">
                Qty
              </th>
              <th scope="col" className="pb-2 text-right font-medium">
                Unit price
              </th>
              <th scope="col" className="pb-2 text-right font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.tierId} className="border-t border-border">
                <td className="py-2">{line.name}</td>
                <td className="py-2 text-right tabular-nums">{line.quantity}</td>
                <td className="py-2 text-right tabular-nums">
                  {formatCurrency(line.unitMinor, order.currency)}
                </td>
                <td className="py-2 text-right tabular-nums">
                  {formatCurrency(line.unitMinor * line.quantity, order.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Separator className="my-6" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total paid</span>
          <span className="text-base font-semibold tabular-nums">
            {formatCurrency(order.totalMinor, order.currency)}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Payment reference</dt>
            <dd className="break-all font-mono text-xs">
              {paymentReference ?? escrowReference ?? 'Not settled yet'}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Buyer</dt>
            <dd className="break-all font-mono text-xs">{order.buyerId}</dd>
          </div>
        </dl>

        <p className="mt-6 text-xs text-muted-foreground">
          Keep this receipt for your records. Ticket ownership is verifiable on Stellar
          using the payment reference above.
        </p>
      </article>
    </div>
  );
}
