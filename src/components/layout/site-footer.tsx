import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
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
              <p className="text-sm font-medium text-foreground">{heading}</p>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-muted-foreground hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="my-8" />

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Veritix. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
