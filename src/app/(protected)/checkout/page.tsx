'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { LoadingState } from '@/components/feedback/loading-state';
import { useCart } from '@/context/cart-context';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { routes } from '@/lib/routes';

/**
 * Checkout for the current cart.
 *
 * Kept behind the protected shell, so the proxy has already guaranteed a
 * session by the time this renders. With nothing selected there is no order to
 * summarize, so the buyer is sent back to where they can pick tickets.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const {
    event,
    lines,
    totalMinor,
    itemCount,
    currency,
    updateQuantity,
    removeItem,
    clear,
  } = useCart();

  const [buyer, setBuyer] = React.useState({ name: '', email: '' });

  const hasOrder = Boolean(event) && lines.length > 0;

  React.useEffect(() => {
    if (hasOrder) return;
    router.replace(event ? routes.event(event.slug) : routes.events);
  }, [event, hasOrder, router]);

  // Render the redirect target's placeholder rather than an empty order.
  if (!event || lines.length === 0) {
    return <LoadingState label="Nothing to check out — returning to the event…" />;
  }

  const orderedLines = lines.flatMap((line) => {
    const tier = event.tiers.find((candidate) => candidate.id === line.tierId);
    if (!tier) return [];

    const subtotalMinor = tier.priceMinor * line.quantity;
    return [{ tier, quantity: line.quantity, subtotalMinor }];
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link href={routes.event(event.slug)}>
            <ArrowLeft aria-hidden="true" />
            Back to {event.title}
          </Link>
        </Button>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          {formatDateTime(event.startsAt)} · {event.venue}, {event.city}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
          <CardDescription>
            {itemCount} {itemCount === 1 ? 'ticket' : 'tickets'} selected
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ul className="flex flex-col gap-3">
            {orderedLines.map(({ tier, quantity, subtotalMinor }) => (
              <li key={tier.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{tier.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(tier.priceMinor, tier.currency)} each
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      aria-label={`Remove one ${tier.name} ticket`}
                      onClick={() => updateQuantity(tier.id, quantity - 1)}
                    >
                      −
                    </Button>
                    <span className="w-8 text-center text-sm tabular-nums">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      aria-label={`Add one ${tier.name} ticket`}
                      onClick={() => updateQuantity(tier.id, quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <span className="w-24 text-right text-sm font-medium tabular-nums">
                    {formatCurrency(subtotalMinor, tier.currency)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(tier.id)}
                    aria-label={`Remove ${tier.name} from the order`}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Total</span>
            <span className="text-base font-semibold tabular-nums">
              {formatCurrency(totalMinor, currency)}
            </span>
          </div>

          <Button variant="ghost" size="sm" className="self-start" onClick={clear}>
            Clear cart
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your details</CardTitle>
          <CardDescription>The name and email the tickets are issued to.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="buyer-name" required>
              Full name
            </Label>
            <Input
              id="buyer-name"
              name="name"
              autoComplete="name"
              required
              value={buyer.name}
              onChange={(changeEvent) =>
                setBuyer((current) => ({ ...current, name: changeEvent.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="buyer-email" required>
              Email
            </Label>
            <Input
              id="buyer-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={buyer.email}
              onChange={(changeEvent) =>
                setBuyer((current) => ({ ...current, email: changeEvent.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
          <CardDescription>
            Ticket payments are held in escrow on Stellar until the event completes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">Settlement not wired up yet</Badge>
        </CardContent>
        <CardFooter className="justify-end">
          <Button disabled>
            <CreditCard aria-hidden="true" />
            Pay {formatCurrency(totalMinor, currency)}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
