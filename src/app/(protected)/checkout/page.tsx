'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { LoadingState } from '@/components/feedback/loading-state';
import { PromoCode } from '@/components/checkout/promo-code';
import { OrderSummary } from '@/components/checkout/order-summary';
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
          <CardTitle as="h2">Order summary</CardTitle>
          <CardDescription>
            {itemCount} {itemCount === 1 ? 'ticket' : 'tickets'} selected
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <OrderSummary
            lines={orderedLines.map(({ tier, quantity }) => ({
              id: tier.id,
              name: tier.name,
              quantity,
              unitMinor: tier.priceMinor,
            }))}
            currency={currency}
            feeMinor={0}
            eventTitle={event?.title}
          />
          <Button variant="ghost" size="sm" className="self-start" onClick={clear}>
            Clear cart
          </Button>
          <PromoCode onApply={async (code) => ({ valid: true, discountMinor: 0 })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle as="h2">Your details</CardTitle>
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

      <PaymentStep
        eventId={event.id}
        lines={lines}
        amountStroops={BigInt(totalMinor)}
        onPaid={({ id }) => {
          clear();
          router.replace(routes.order(id));
        }}
      />
    </div>
  );
}
