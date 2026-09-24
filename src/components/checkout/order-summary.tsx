import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * Breakdown of an order before the buyer pays.
 *
 * Every amount is an integer in minor units and is rendered through
 * `formatCurrency`, so the numbers here match the receipt and the checkout
 * button exactly — no float creeping in on the way to the total.
 */

export interface OrderSummaryLine {
  /** Tier id, used as the list key. */
  id: string;
  name: string;
  quantity: number;
  /** Price per ticket, in integer minor units. */
  unitMinor: number;
}

export interface OrderSummaryProps {
  lines: OrderSummaryLine[];
  currency?: string;
  /** Service fee for the whole order, in integer minor units. */
  feeMinor?: number;
  /** Shown above the lines when the checkout is for a known event. */
  eventTitle?: string;
  className?: string;
}

export function OrderSummary({
  lines,
  currency = 'USD',
  feeMinor = 0,
  eventTitle,
  className,
}: OrderSummaryProps) {
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotalMinor = lines.reduce(
    (total, line) => total + line.unitMinor * line.quantity,
    0,
  );
  const totalMinor = subtotalMinor + feeMinor;

  return (
    <section
      aria-label="Order summary"
      className={cn(
        'rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm',
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold leading-tight tracking-tight">
          Order summary
        </h2>
        <p className="text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'ticket' : 'tickets'}
        </p>
      </div>

      {eventTitle && <p className="mt-1 text-sm text-muted-foreground">{eventTitle}</p>}

      {lines.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Nothing selected yet — pick your tickets to see the total.
        </p>
      ) : (
        <>
          <ul className="mt-4 flex flex-col gap-3">
            {lines.map((line) => (
              <li
                key={line.id}
                className="flex items-start justify-between gap-4 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{line.name}</p>
                  <p className="text-muted-foreground">
                    {line.quantity} × {formatCurrency(line.unitMinor, currency)}
                  </p>
                </div>
                <span className="shrink-0 tabular-nums">
                  {formatCurrency(line.unitMinor * line.quantity, currency)}
                </span>
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums">{formatCurrency(subtotalMinor, currency)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Fees</dt>
              <dd className="tabular-nums">{formatCurrency(feeMinor, currency)}</dd>
            </div>
          </dl>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-base font-semibold tabular-nums">
              {formatCurrency(totalMinor, currency)}
            </span>
          </div>
        </>
      )}
    </section>
  );
}
