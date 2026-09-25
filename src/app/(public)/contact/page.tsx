import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Mail } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { Container } from '@/components/layout/container';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch about organizing an event, pricing, support, or anything else. ' +
    'A person reads every message.',
};

/**
 * Contact page.
 *
 * A server component, so the page can export `metadata`, rendering the form as
 * a client component. The split is not ceremony: the form needs state and the
 * page does not, and making the page itself a client component would cost the
 * document its title and its meta description for no benefit.
 */
export default function ContactPage() {
  return (
    <>
      <section className="border-b border-border">
        <Container className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Contact us
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A person reads every message that comes through this form, and it reaches the team
              rather than a queue. Tell us what happened and we will tell you what we think is
              going on.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="form-heading">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
              {/* The heading is visually hidden because the form is visibly
                  inside this section, but a landmark with no name is a landmark
                  you cannot jump to — and this is the primary content of the
                  page. */}
              <h2 id="form-heading" className="sr-only">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            <aside className="space-y-8 lg:pt-1">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  <Clock
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  How long it takes
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Usually two working days. If it is about money — a payment that did not settle, a
                  payout that did not arrive — a ticket in your dashboard reaches the people with
                  access to the ledger, which email does not.
                </p>
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  <Mail
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  What we need from you
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  The event or order reference, what you expected to happen, and what happened
                  instead. A screenshot helps more than a description of one.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please do not send a password, a wallet secret key, or a full card number. We
                  will never ask for them, and we cannot use them if you do.
                </p>
              </div>

              <div>
                <h2 className="text-base font-semibold tracking-tight">
                  Before you write
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  The <Link href={routes.terms} className="underline underline-offset-4">
                    terms
                  </Link>{' '}
                  and the{' '}
                  <Link href={routes.privacy} className="underline underline-offset-4">
                    privacy policy
                  </Link>{' '}
                  answer most of the questions this form is asked, and the{' '}
                  <Link href={routes.pricing} className="underline underline-offset-4">
                    pricing page
                  </Link>{' '}
                  has the numbers.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
