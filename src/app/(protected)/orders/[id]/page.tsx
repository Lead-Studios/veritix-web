'use client';

import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowRight, LoaderCircle, Ticket as TicketIcon } from 'lucide-react';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ErrorState } from '@/components/feedback/error-state';
import { LoadingState } from '@/components/feedback/loading-state';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { routes } from '@/lib/routes';
import type { Order, OrderStatus } from '@/types';

/**
 * Confirmation for a completed purchase.
 *
 * An order starts out `pending` while the transaction settles, so the page
 * polls until it moves on rather than showing a dead "maybe it worked" screen.
 * Once it is no longer pending the polling stops.
 */

const POLL_INTERVAL_MS = 4_000;

const STATUS_VARIANT: Record<OrderStatus, BadgeProps['variant']> = {
  pending: 'warning',
  paid: 'success',
  failed: 'destructive',
  refunded: 'secondary',
};

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const {
    data: order,
    error,
    isLoading,
    mutate,
  } = useSWR<Order>(`/orders/${id}`, {
    refreshInterval: (latest) => (latest?.status === 'pending' ? POLL_INTERVAL_MS : 0),
  });

  if (error) {
    return (
      <ErrorState
        title="We could not load this order"
        description="The order may still be settling. Try again in a moment."
        onRetry={() => mutate()}
      />
    );
  }

  if (isLoading || !order) {
    return <LoadingState label="Loading your order" />;
  }

  const isPending = order.status === 'pending';
  const escrowReference = order.tickets.find((ticket) => ticket.escrowId)?.escrowId;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Order {order.id}</h1>
          <p className="text-sm text-muted-foreground">
            Placed {formatDateTime(order.createdAt)}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge>
      </div>

      {isPending && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-md border border-warning/40 bg-warning/10 p-4 text-sm"
        >
          <LoaderCircle
            className="size-4 shrink-0 animate-spin text-warning"
            aria-hidden="true"
          />
          <p className="text-muted-foreground">
            Waiting for the payment to settle. This page updates on its own.
          </p>
        </div>
      )}

      {order.status === 'failed' && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm"
        >
          <p className="font-medium text-foreground">This payment did not go through</p>
          <p className="text-muted-foreground">
            Nothing was charged. Your tickets are still in your cart if you want to try
            again.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            {order.tickets.length} {order.tickets.length === 1 ? 'ticket' : 'tickets'}{' '}
            issued
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium tabular-nums">
              {formatCurrency(order.totalMinor, order.currency)}
            </span>
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Escrow reference</p>
            <p className="break-all font-mono text-xs">
              {escrowReference ?? 'Not settled yet'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tickets issued</CardTitle>
          <CardDescription>
            Each ticket is verifiable on Stellar at the door.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {order.tickets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tickets have been issued for this order yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {order.tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-sm last:border-0 last:pb-0"
                >
                  <span className="flex items-center gap-2">
                    <TicketIcon
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="font-mono text-xs">{ticket.id}</span>
                  </span>
                  <span className="flex items-center gap-3 text-muted-foreground">
                    <span>Issued {formatDateTime(ticket.issuedAt)}</span>
                    <Badge variant={ticket.status === 'valid' ? 'success' : 'secondary'}>
                      {ticket.status}
                    </Badge>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div>
        <Button asChild>
          <Link href={routes.myTickets}>
            Go to My Tickets
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
