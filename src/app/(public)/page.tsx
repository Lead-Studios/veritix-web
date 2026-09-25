import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Wallet, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/container';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'On-chain ticketing',
};

const FEATURES = [
  {
    Icon: ShieldCheck,
    title: 'Escrowed by default',
    description:
      'Funds sit in an on-chain escrow until the event completes. Buyers are protected and organizers are paid on settlement.',
  },
  {
    Icon: Wallet,
    title: 'Paid out automatically',
    description:
      'Revenue splits between organizer, artist, and venue are defined up front and distributed the moment an event settles.',
  },
  {
    Icon: Ticket,
    title: 'Verifiable at the door',
    description:
      'Every ticket is backed by a record anyone can check, so duplicates and forgeries fail verification on the spot.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Each <section> is named by the heading it contains. Unnamed sections
          are not exposed as landmark regions, so the page offered screen-reader
          users a single undifferentiated block. */}
      <section className="border-b border-border" aria-labelledby="home-hero-heading">
        <Container className="flex flex-col items-start gap-6 py-20 sm:py-28">
          <Badge variant="secondary">Built on Stellar</Badge>
          <h1
            id="home-hero-heading"
            className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            Ticketing that settles on-chain
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Veritix holds ticket payments in escrow until the event happens, then splits the revenue
            automatically. No chargebacks, no waiting on a payout, no forged tickets at the door.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={routes.events}>
                Browse events
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={routes.pricing}>See pricing</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section aria-labelledby="home-features-heading">
        <Container className="py-16 sm:py-20">
          {/* `CardTitle` renders an <h3>. Without an <h2> above it the outline
              jumped from h1 straight to h3, and there was no heading at all
              introducing the three features. */}
          <h2 id="home-features-heading" className="sr-only">
            Why Veritix
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map(({ Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section
        className="border-t border-border bg-secondary/30"
        aria-labelledby="home-organizer-heading"
      >
        <Container className="py-16 sm:py-20">
          <Card className="border-none bg-transparent shadow-none">
            <CardContent className="flex flex-col items-start gap-4 p-0">
              <h2
                id="home-organizer-heading"
                className="text-2xl font-semibold tracking-tight"
              >
                Running an event?
              </h2>
              <p className="max-w-xl text-muted-foreground">
                Set your ticket tiers, define how revenue splits, and let settlement happen on its own.
              </p>
              <Button asChild>
                <Link href={routes.register}>
                  Get started
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </section>
    </>
  );
}
