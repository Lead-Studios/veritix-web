'use client';

import * as React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  LoaderCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * The payment step of checkout.
 *
 * A wallet interaction fails in more than one way, and they need different
 * words: the buyer declined, we gave up waiting, or the transaction was
 * submitted but has not confirmed. Each is surfaced separately.
 *
 * Two rules keep a retry safe:
 *
 *   1. The idempotency key is derived from the order reference, so every retry
 *      (including after a reload) reuses the same one and the backend can
 *      dedupe a double submit.
 *   2. A timed-out attempt keeps listening. If it confirms late the step moves
 *      to "confirmed" instead of asking the buyer to pay again.
 *
 * The cart is never touched here. Only `onConfirmed` fires, and the caller is
 * responsible for clearing the selection — a failed or abandoned attempt must
 * leave the buyer's tickets exactly where they were.
 */

export type PaymentStatus =
  'idle' | 'submitting' | 'confirmed' | 'rejected' | 'timeout' | 'unconfirmed' | 'failed';

export interface PaymentStepProps {
  /** Amount in integer minor units. */
  totalMinor: number;
  currency?: string;
  /**
   * Stable identifier for this order. Also the idempotency key, so a retry can
   * never be charged twice for the same order.
   */
  orderReference: string;
  /** Signs and submits the payment. Resolve with the on-chain reference. */
  pay: (idempotencyKey: string) => Promise<string>;
  /** Fires once the payment is confirmed and the cart may be cleared. */
  onConfirmed?: (transactionReference: string) => void;
  /** How long to wait for the wallet and network before treating it as lost. */
  timeoutMs?: number;
}

interface FailureCopy {
  title: string;
  description: string;
  Icon: typeof AlertTriangle;
  tone: 'destructive' | 'warning';
}

const FAILURE_COPY: Record<
  'rejected' | 'timeout' | 'unconfirmed' | 'failed',
  FailureCopy
> = {
  rejected: {
    title: 'Payment rejected',
    description:
      'You declined the request in your wallet, so nothing was charged. Your tickets are still selected.',
    Icon: AlertTriangle,
    tone: 'destructive',
  },
  timeout: {
    title: 'No response in time',
    description:
      'We stopped waiting for the wallet and the network. The transaction may still go through — retrying reuses the same order reference, so you cannot be charged twice.',
    Icon: Clock,
    tone: 'warning',
  },
  unconfirmed: {
    title: 'Submitted, but not confirmed yet',
    description:
      'The network accepted the transaction but it has not been confirmed. It usually settles within a minute, so check your tickets before paying again.',
    Icon: Clock,
    tone: 'warning',
  },
  failed: {
    title: 'Payment failed',
    description:
      'Something went wrong before the transaction was submitted. Nothing was charged and you can safely try again.',
    Icon: AlertTriangle,
    tone: 'destructive',
  },
};

/** Turn a thrown value into one of the failure kinds we can explain. */
export function classifyPaymentError(
  error: unknown,
): 'rejected' | 'timeout' | 'unconfirmed' | 'failed' {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? (error as { code?: unknown }).code
      : undefined;

  // EIP-1193 / Freighter-style rejection.
  if (code === 4001) return 'rejected';

  const text = `${error instanceof Error ? error.name : ''} ${
    error instanceof Error ? error.message : String(error)
  }`.toLowerCase();

  if (text.includes('reject') || text.includes('denied') || text.includes('declin')) {
    return 'rejected';
  }
  if (error instanceof Error && error.name === 'AbortError') return 'timeout';
  if (text.includes('timeout') || text.includes('timed out')) return 'timeout';
  if (
    text.includes('confirm') ||
    text.includes('pending') ||
    text.includes('unconfirmed')
  ) {
    return 'unconfirmed';
  }

  return 'failed';
}

export function PaymentStep({
  totalMinor,
  currency = 'USD',
  orderReference,
  pay,
  onConfirmed,
  timeoutMs = 60_000,
}: PaymentStepProps) {
  const [status, setStatus] = React.useState<PaymentStatus>('idle');
  const [reference, setReference] = React.useState<string | null>(null);
  const mountedRef = React.useRef(true);

  React.useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  const isBusy = status === 'submitting';
  const isConfirmed = status === 'confirmed';
  const failure =
    status === 'idle' || isBusy || isConfirmed ? null : FAILURE_COPY[status];

  const submit = React.useCallback(async () => {
    setStatus('submitting');

    const attempt = pay(`veritix-order-${orderReference}`);

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<'timeout'>((resolve) => {
      timer = setTimeout(() => resolve('timeout'), timeoutMs);
    });

    const settled = await Promise.race([
      attempt.then((transactionReference) => ({
        ok: true as const,
        transactionReference,
      })),
      attempt.then(
        () => undefined,
        (error: unknown) => ({ ok: false as const, error }),
      ),
      timeout,
    ]);

    if (timer) clearTimeout(timer);

    if (settled === 'timeout') {
      if (!mountedRef.current) return;
      setStatus('timeout');

      // The wallet may still come back. Adopt a late confirmation rather than
      // leaving the buyer to pay a second time.
      attempt.then(
        (transactionReference) => {
          if (!mountedRef.current) return;
          setReference(transactionReference);
          setStatus('confirmed');
          onConfirmed?.(transactionReference);
        },
        () => {
          // The attempt failed after we stopped waiting; the timeout copy stands.
        },
      );
      return;
    }

    if (!mountedRef.current) return;

    if (settled && settled.ok) {
      setReference(settled.transactionReference);
      setStatus('confirmed');
      onConfirmed?.(settled.transactionReference);
      return;
    }

    setStatus(classifyPaymentError(settled ? settled.error : undefined));
  }, [onConfirmed, orderReference, pay, timeoutMs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Ticket payments are held in escrow on Stellar until the event completes.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {failure && (
          <div
            role="alert"
            className={cn(
              'flex gap-3 rounded-md border p-4 text-sm',
              failure.tone === 'destructive'
                ? 'border-destructive/30 bg-destructive/5'
                : 'border-warning/40 bg-warning/10',
            )}
          >
            <failure.Icon
              className={cn(
                'mt-0.5 size-4 shrink-0',
                failure.tone === 'destructive' ? 'text-destructive' : 'text-warning',
              )}
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="font-medium text-foreground">{failure.title}</p>
              <p className="text-muted-foreground">{failure.description}</p>
            </div>
          </div>
        )}

        {isConfirmed && (
          <div
            role="status"
            className="flex gap-3 rounded-md border border-success/40 bg-success/10 p-4 text-sm"
          >
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0 text-success"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="font-medium text-foreground">Payment confirmed</p>
              <p className="break-all text-muted-foreground">
                Reference {reference ?? 'pending'}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-end">
        <Button
          type="button"
          disabled={isBusy || isConfirmed}
          onClick={() => void submit()}
        >
          {isBusy ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <CreditCard aria-hidden="true" />
          )}
          {isBusy
            ? 'Waiting for your wallet…'
            : isConfirmed
              ? 'Paid'
              : failure
                ? `Try again · ${formatCurrency(totalMinor, currency)}`
                : `Pay ${formatCurrency(totalMinor, currency)}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
