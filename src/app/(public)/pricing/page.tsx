import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Minus } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Container } from '@/components/layout/container';
import { formatCurrency } from '@/lib/format';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Veritix takes a percentage plus a fixed fee per ticket. Compare the Starter, ' +
    'Growth, and Enterprise plans.',
};

/**
 * Prices are illustrative until the first event settles through escrow; the
 * numbers below are what the page is designed around, not a live quote.
 */
const FEE_PER_TICKET_MINOR = 99;
const FEE_PER_TICKET_GROWTH_MINOR = 49;

interface Tier {
  id: string;
  name: string;
  /** Rendered as the headline figure. Null means "talk to us". */
  headline: string;
  rate: string;
  cadence: string;
  summary: string;
  includes: readonly string[];
  cta: { href: string; label: string };
  recommended?: boolean;
}

const TIERS: readonly Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    headline: '2.5% + ' + formatCurrency(FEE_PER_TICKET_MINOR),
    rate: '2.5%',
    cadence: 'per ticket sold, plus a fixed fee',
    summary: 'For a first event, a small room, or a single night at a venue.',
    includes: [
      'Up to 500 tickets per event',
      'On-chain escrow and automatic settlement',
      'Up to two revenue splits per event',
      'Door verification with the buyer’s QR code',
    ],
    cta: { href: routes.register, label: 'Create an account' },
  },
  {
    id: 'growth',
    name: 'Growth',
    headline: '1.9% + ' + formatCurrency(FEE_PER_TICKET_GROWTH_MINOR),
    rate: '1.9%',
    cadence: 'per ticket sold, plus a fixed fee',
    summary: 'For organizers running a season, a festival, or a recurring series.',
    includes: [
      'Unlimited tickets and unlimited events',
      'Unlimited revenue splits, including artists and venues',
      'Refunds and ticket transfers with on-chain settlement',
      'Payout reporting and reconciliation exports',
    ],
    cta: { href: routes.register, label: 'Start with Growth' },
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    headline: 'Custom',
    rate: 'Volume',
    cadence: 'negotiated per settlement volume',
    summary: 'For platforms, multi-city promoters, and anyone invoicing on terms.',
    includes: [
      'Everything in Growth',
      'Migrated event history and a settlement ledger you can audit',
      'A named contact for settlement and refund escalations',
      'Custom escrow terms, including delayed release windows',
    ],
    cta: { href: routes.contact, label: 'Talk to us' },
  },
];

type Cell = boolean | string;

interface ComparisonRow {
  feature: string;
  /** `null` means the row is a group heading, not a comparable feature. */
  cells: readonly (Cell | null)[];
}

const COMPARISON: readonly ComparisonRow[] = [
  { feature: 'Tickets per event', cells: ['Up to 500', 'Unlimited', 'Unlimited'] },
  { feature: 'Live events', cells: ['1', 'Unlimited', 'Unlimited'] },
  { feature: 'On-chain escrow', cells: [true, true, true] },
  { feature: 'Automatic settlement', cells: [true, true, true] },
  { feature: 'QR verification at the door', cells: [true, true, true] },
  { feature: 'Revenue splits', cells: ['Up to 2', 'Unlimited', 'Unlimited'] },
  { feature: 'Refunds from escrow', cells: [false, true, true] },
  { feature: 'Buyer-initiated transfers', cells: [false, true, true] },
  { feature: 'Settlement and payout exports', cells: [false, true, true] },
  { feature: 'Settlement ledger audit', cells: [false, false, true] },
  { feature: 'Named settlement contact', cells: [false, false, true] },
];

const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: 'When do I actually get paid?',
    answer:
      'When you publish an event, the money from its ticket sales sits in an on-chain escrow account rather than in a Veritix balance. Once the event completes and the settlement window closes, the escrow releases the shares you defined up front — to you, to any artists, and to the venue — in the same transaction. There is no invoice to send and no payout to request.',
  },
  {
    question: 'What happens if an event is cancelled?',
    answer:
      'Every ticket is refundable from the escrow account for as long as the escrow is open, and the refund is made to the original payment method rather than as platform credit. After settlement, a refund is a new on-chain transfer out of your settled share, and it shows up in your report as a refund rather than as a reduction in ticket revenue.',
  },
  {
    question: 'Are there payment fees on top?',
    answer:
      'No. The percentage and the fixed per-ticket fee are the whole cost of a ticket. Stellar network fees are paid from the escrow account and are drawn from the fixed fee, not added to it, so a buyer never sees a line item they did not expect.',
  },
  {
    question: 'Do you hold my money?',
    answer:
      'Not as a matter of policy — the escrow account is a Stellar account whose transfers are public and verifiable, and neither Veritix nor you can move funds out of it without the signature the release terms require. The escrow rules are part of the settlement, not a setting inside a dashboard.',
  },
  {
    question: 'Can I change tiers after I sign up?',
    answer:
      'Yes, and it is prorated per event rather than per month. Each event is priced with the tier that was active when it was published, so changing tiers never retroactively reprices a sale that has already settled.',
  },
  {
    question: 'What does it cost to switch away?',
    answer:
      'Nothing. Your ticket records and your settlement history are yours, and the event export contains everything needed to reconstruct them elsewhere. That is a deliberate constraint on us rather than a courtesy.',
  },
];

/**
 * A tick, a cross, or a short phrase. The glyph is decorative — the state is
 * always also present as text, because a column of coloured marks tells a
 * screen reader nothing.
 */
function CellValue({ value }: { value: Cell }) {
  if (typeof value === 'string') return <>{value}</>;

  return value ? (
    <span className="inline-flex items-center gap-2">
      <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
      <span className="sr-only">Included</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 text-muted-foreground">
      <Minus className="size-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">Not included</span>
    </span>
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-border">
        <Container className="flex flex-col items-start gap-4 py-16 sm:py-20">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Pricing</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            One number per plan, charged when a ticket sells. Escrow, settlement, and
            verification are included in all three — there is no add-on that makes a
            ticket verifiable.
          </p>
        </Container>
      </section>

      <section aria-labelledby="plans-heading">
        <Container className="py-16 sm:py-20">
          <h2 id="plans-heading" className="sr-only">
            Plans
          </h2>
          <ul className="grid gap-6 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <li key={tier.id} className="flex">
                <Card
                  // The recommendation is carried by the badge text and the
                  // screen-reader text in the heading, not by this border. The
                  // ring is a third, redundant signal rather than the only one.
                  data-recommended={tier.recommended ? 'true' : undefined}
                  className={
                    tier.recommended
                      ? 'flex w-full flex-col border-2 border-primary shadow-md'
                      : 'flex w-full flex-col'
                  }
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle>
                        {tier.name}
                        {tier.recommended && (
                          <span className="sr-only">, our recommended plan</span>
                        )}
                      </CardTitle>
                      {tier.recommended && <Badge>Most popular</Badge>}
                    </div>
                    <p className="text-3xl font-semibold tracking-tight">
                      {tier.headline}
                    </p>
                    <CardDescription>
                      {tier.rate} {tier.cadence}. {tier.summary}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <ul className="space-y-2.5">
                      {tier.includes.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm">
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-success"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      asChild
                      className="w-full"
                      variant={tier.recommended ? 'default' : 'outline'}
                    >
                      <Link href={tier.cta.href}>
                        {tier.cta.label}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="compare-heading" className="border-t border-border">
        <Container className="py-16 sm:py-20">
          <h2 id="compare-heading" className="text-2xl font-semibold tracking-tight">
            Compare plans
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Every difference between the three plans, so the headline rate is not the only
            thing to compare.
          </p>

          <div className="mt-8">
            <Table>
              {/* A table this size needs a name that is not just its position
                  on the page, for anyone arriving by a fragment link. */}
              <TableCaption className="sr-only">
                Feature comparison across the Starter, Growth, and Enterprise plans
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Feature</TableHead>
                  {TIERS.map((tier) => (
                    <TableHead key={tier.id} scope="col">
                      {tier.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARISON.map((row) => (
                  <TableRow key={row.feature}>
                    {/* Row headers, not cells: this is the axis a screen reader
                        user reads a value against. */}
                    <TableHead scope="row" className="font-normal text-foreground">
                      {row.feature}
                    </TableHead>
                    {row.cells.map((value, index) => (
                      <TableCell key={TIERS[index].id}>
                        <CellValue value={value ?? false} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Container>
      </section>

      <section aria-labelledby="faq-heading" className="border-t border-border">
        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
              Questions
            </h2>

            {/* Native `details`/`summary`, so each question is a real disclosure
                with keyboard support and a state the browser exposes, rather
                than a div that only responds to clicks. */}
            <div className="mt-8 divide-y divide-border border-y border-border">
              {FAQ.map(({ question, answer }) => (
                <details key={question} className="group py-4">
                  <summary
                    className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-medium [&::-webkit-details-marker]:hidden"
                  >
                    {question}
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-xl leading-none text-muted-foreground transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
