'use client';

import * as React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  LoaderCircle,
  ShieldCheck,
  Wallet,
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
import { env } from '@/lib/env';
import { formatXLM } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

/**
 * Wallet payment step.
 *
 * The flow is prepare → sign → submit → confirm:
 *
 *   1. `POST /api/orders` opens the escrow and returns an unsigned envelope.
 *      Escrow creation needs the platform secret key, so it happens behind the
 *      API route, never here.
 *   2. The envelope goes to Freighter to sign. The extension injects itself on
 *      the page, so signing needs no SDK import — we only ever pass it an XDR
 *      string and get one back.
 *   3. `PATCH /api/orders` submits the signed envelope.
 *   4. Checkout polls `GET /api/orders?id=` until the backend reports the
 *      transaction confirmed. The order is not treated as paid before that.
 */

/** The parts of the Freighter extension API this step uses. */
interface FreighterProvider {
  getPublicKey(): Promise<string>;
  getNetwork?(): Promise<string>;
  signTransaction(
    xdr: string,
    options?: { network?: string; address?: string },
  ): Promise<string | { signedTxXdr?: string; error?: string }>;
}

interface OrderRecord {
  id: string;
  status: OrderStatus;
  escrowId: string;
  paymentXdr?: string;
}

export type PaymentStatus =
  | 'idle'
  | 'connecting'
  | 'preparing'
  | 'signing'
  | 'pending'
  | 'paid'
  | 'no-wallet'
  | 'rejected'
  | 'insufficient'
  | 'network-mismatch'
  | 'failed';

export interface PaymentStepProps {
  eventId: string;
  lines: Array<{ tierId: string; quantity: number }>;
  /** Order total in stroops. Rendered through `formatXLM`. */
  amountStroops: bigint;
  /** Fires once the backend confirms the transaction; the order is paid then. */
  onPaid?: (order: { id: string; escrowId: string }) => void;
  pollIntervalMs?: number;
}

/** Freighter injects itself on the page under one of these names. */
function freighter(): FreighterProvider | null {
  if (typeof window === 'undefined') return null;

  const injected = window as unknown as {
    freighterApi?: FreighterProvider;
    freighter?: FreighterProvider;
  };

  return injected.freighterApi ?? injected.freighter ?? null;
}

/** The wallet must be on the network this app targets, or the envelope is void. */
function networkMatches(network: string): boolean {
  const value = network.trim().toLowerCase();

  return env.NEXT_PUBLIC_STELLAR_NETWORK === 'testnet'
    ? value === 'testnet'
    : value === 'public' || value === 'mainnet';
}

interface FailureCopy {
  title: string;
  description: string;
  tone: 'destructive' | 'warning';
}

const FAILURE_COPY: Record<
  'no-wallet' | 'rejected' | 'insufficient' | 'network-mismatch' | 'failed',
  FailureCopy
> = {
  'no-wallet': {
    title: 'No Stellar wallet found',
    description:
      'Install the Freighter extension and reload, then connect it to pay with XLM.',
    tone: 'warning',
  },
  rejected: {
    title: 'Payment rejected',
    description:
      'You declined the request in your wallet, so nothing was charged. Your tickets are still selected.',
    tone: 'destructive',
  },
  insufficient: {
    title: 'Not enough XLM',
    description:
      'The wallet balance does not cover this order plus the network fee. Top up and try again — nothing was charged.',
    tone: 'destructive',
  },
  'network-mismatch': {
    title: 'Wrong network',
    description: `Your wallet is not on ${env.NEXT_PUBLIC_STELLAR_NETWORK}. Switch networks in the extension and reconnect before paying.`,
    tone: 'warning',
  },
  failed: {
    title: 'Payment did not go through',
    description:
      'Something went wrong before the transaction was submitted. Nothing was charged and you can safely try again.',
    tone: 'destructive',
  },
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  const text = await response.text();
  const payload: unknown = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : response.statusText;
    throw new Error(message);
  }

  return payload as T;
}

/** Map a thrown value onto the failure we can actually explain. */
function classify(error: unknown, phase: 'connect' | 'sign'): PaymentStatus {
  // EIP-1193 style rejection code, which Freighter follows.
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? (error as { code?: unknown }).code
      : undefined;
  if (code === 4001) return 'rejected';

  const text = `${
    error instanceof Error ? `${error.name} ${error.message}` : String(error)
  }`.toLowerCase();

  if (text.includes('reject') || text.includes('denied') || text.includes('declin')) {
    return 'rejected';
  }
  if (
    text.includes('insufficient') ||
    text.includes('underfunded') ||
    text.includes('balance')
  ) {
    return 'insufficient';
  }
  if (text.includes('network') || text.includes('passphrase')) return 'network-mismatch';

  return phase === 'connect' ? 'no-wallet' : 'failed';
}

export function PaymentStep({
  eventId,
  lines,
  amountStroops,
  onPaid,
  pollIntervalMs = 4_000,
}: PaymentStepProps) {
  const [address, setAddress] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<PaymentStatus>('idle');
  const [order, setOrder] = React.useState<OrderRecord | null>(null);

  const mountedRef = React.useRef(true);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  /** Keep asking until the order settles; the order is not paid until it does. */
  const pollForSettlement = React.useCallback(
    async (orderId: string) => {
      try {
        const latest = await apiFetch<OrderRecord>(
          `/api/orders?id=${encodeURIComponent(orderId)}`,
        );
        if (!mountedRef.current) return;

        setOrder(latest);

        if (latest.status === 'paid') {
          setStatus('paid');
          onPaid?.({ id: latest.id, escrowId: latest.escrowId });
          return;
        }
        if (latest.status === 'failed') {
          setStatus('failed');
          return;
        }
      } catch {
        // A dropped poll is not a failed payment — keep waiting.
      }

      if (!mountedRef.current) return;
      timerRef.current = setTimeout(
        () => void pollForSettlement(orderId),
        pollIntervalMs,
      );
    },
    [onPaid, pollIntervalMs],
  );

  const connect = React.useCallback(async () => {
    const provider = freighter();

    if (!provider) {
      setStatus('no-wallet');
      return;
    }

    setStatus('connecting');

    try {
      const publicKey = await provider.getPublicKey();
      if (!publicKey) throw new Error('The wallet did not return an address');

      const walletNetwork = (await provider.getNetwork?.()) ?? '';
      if (walletNetwork && !networkMatches(walletNetwork)) {
        setStatus('network-mismatch');
        return;
      }

      setAddress(publicKey);
      setStatus('idle');
    } catch (error) {
      setStatus(classify(error, 'connect'));
    }
  }, []);

  const pay = React.useCallback(async () => {
    const provider = freighter();

    if (!provider || !address) {
      setStatus('no-wallet');
      return;
    }

    try {
      // 1. Create the order and its escrow; the backend prepares the envelope.
      setStatus('preparing');
      const created = await apiFetch<OrderRecord>('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          buyerAddress: address,
          amountStroops: amountStroops.toString(),
          lines,
        }),
      });

      if (!mountedRef.current) return;
      setOrder(created);

      if (!created.paymentXdr) {
        throw new Error('Escrow was created without a payment envelope to sign');
      }

      // 2. Sign it in the wallet.
      setStatus('signing');
      const signed = await provider.signTransaction(created.paymentXdr, {
        network: env.NEXT_PUBLIC_STELLAR_NETWORK,
        address,
      });
      const signedXdr = typeof signed === 'string' ? signed : (signed.signedTxXdr ?? '');
      if (!signedXdr) {
        throw new Error(
          typeof signed === 'object' && signed.error
            ? signed.error
            : 'The wallet did not return a signed transaction',
        );
      }

      // 3. Submit, then wait for the network to confirm.
      setStatus('pending');
      const submitted = await apiFetch<OrderRecord>('/api/orders', {
        method: 'PATCH',
        body: JSON.stringify({ orderId: created.id, signedXdr }),
      });

      if (!mountedRef.current) return;
      setOrder(submitted);
      void pollForSettlement(submitted.id);
    } catch (error) {
      if (!mountedRef.current) return;
      setStatus(classify(error, 'sign'));
    }
  }, [address, amountStroops, eventId, lines, pollForSettlement]);

  const isBusy =
    status === 'connecting' ||
    status === 'preparing' ||
    status === 'signing' ||
    status === 'pending';
  const isPaid = status === 'paid';
  const failure = status === 'idle' || isBusy || isPaid ? null : FAILURE_COPY[status];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Your payment is held in escrow on Stellar until the event completes.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-secondary/40 p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Amount due</p>
            <p className="text-lg font-semibold tabular-nums">
              {formatXLM(amountStroops)} XLM
            </p>
          </div>

          {address ? (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Wallet</p>
              <p className="break-all font-mono text-xs">{address}</p>
            </div>
          ) : (
            <Button type="button" variant="outline" onClick={() => void connect()}>
              <Wallet aria-hidden="true" />
              {status === 'connecting' ? 'Connecting…' : 'Connect wallet'}
            </Button>
          )}
        </div>

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
            <AlertTriangle
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

        {status === 'pending' && order && (
          <div
            role="status"
            className="flex gap-3 rounded-md border border-border bg-secondary/40 p-4 text-sm"
          >
            <LoaderCircle
              className="mt-0.5 size-4 shrink-0 animate-spin"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="font-medium text-foreground">Waiting for confirmation</p>
              <p className="text-muted-foreground">
                The signed payment has been submitted. We will not mark this order paid
                until the network confirms it.
              </p>
              <p className="break-all font-mono text-xs text-muted-foreground">
                Escrow {order.escrowId}
              </p>
            </div>
          </div>
        )}

        {isPaid && order && (
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
              <p className="text-muted-foreground">
                Your tickets are on their way. Keep the escrow reference for your records.
              </p>
              <p className="break-all font-mono text-xs text-muted-foreground">
                Escrow {order.escrowId}
              </p>
            </div>
          </div>
        )}

        {!address && status === 'idle' && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
            Connect a wallet to continue — nothing is charged until you sign.
          </p>
        )}

        {status === 'pending' && !order && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            Waiting for the submitted transaction.
          </p>
        )}
      </CardContent>

      <CardFooter className="justify-end">
        <Button
          type="button"
          disabled={!address || isBusy || isPaid}
          onClick={() => void pay()}
        >
          {isBusy && <LoaderCircle className="animate-spin" aria-hidden="true" />}
          {isPaid
            ? 'Paid'
            : isBusy
              ? 'Processing…'
              : `Pay ${formatXLM(amountStroops)} XLM`}
        </Button>
      </CardFooter>
    </Card>
  );
}
