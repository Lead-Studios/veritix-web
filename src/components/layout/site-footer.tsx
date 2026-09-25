import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { NewsletterForm } from '@/components/newsletter-form';
import { Separator } from '@/components/ui/separator';
import { routes } from '@/lib/routes';

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { href: routes.events, label: 'Events' },
      { href: routes.pricing, label: 'Pricing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: routes.blog, label: 'Blog' },
      { href: routes.contact, label: 'Contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: routes.terms, label: 'Terms' },
      { href: routes.privacy, label: 'Privacy' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <p className="text-base font-semibold tracking-tight">Veritix</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Ticketing settled on-chain, so organizers get paid and buyers stay protected.
            </p>
          </div>

          {COLUMNS.map(({ heading, links }) => (
            <nav key={heading} aria-label={heading} className="space-y-3">
              {/* A heading, not a styled paragraph: these three groups are
                  sections of the footer, and a screen reader user needs them in
                  the document outline to skip between them. */}
              {/* A heading, not a styled paragraph: the footer had no headings at
                  all, so a screen-reader user had no way to tell the three link
                  groups apart without reading every link in order. */}
              <h2 className="text-sm font-medium text-foreground">{heading}</h2>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="my-8" />

        {/*
          Signup sits above the legal line rather than inside the link columns:
          it is a form, not navigation, and burying it in a grid cell made the
          label too narrow to read on a phone.
        */}
        <section aria-labelledby="newsletter-heading" className="max-w-xl space-y-4">
          <h2 id="newsletter-heading" className="text-base font-semibold tracking-tight">
            Events worth knowing about
          </h2>
          <NewsletterForm />
          {/* A link to the privacy policy sits next to the signup. The list
              holds a real address, which is the one case where "see our privacy
              policy" is a requirement rather than boilerplate — so it is in the
              same block as the form, not only in the Legal column above. */}
          <p className="text-sm text-muted-foreground">
            We use your address to send this newsletter and nothing else.{' '}
            <Link
              href={routes.privacy}
              className="underline underline-offset-4 hover:text-foreground"
            >
              Read the privacy policy
            </Link>
            .
          </p>
        </section>

        <Separator className="my-8" />

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Veritix. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
