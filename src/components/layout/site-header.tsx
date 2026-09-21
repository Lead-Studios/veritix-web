'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: routes.events, label: 'Events' },
  { href: routes.pricing, label: 'Pricing' },
  { href: routes.blog, label: 'Blog' },
  { href: routes.contact, label: 'Contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [lastPathname, setLastPathname] = React.useState(pathname);

  // Close the mobile menu whenever the route changes. Adjusting state during
  // render is the supported pattern here — an effect would cause an extra pass.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href={routes.home} className="text-base font-semibold tracking-tight">
          Veritix
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-2 text-sm transition-colors',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href={routes.login}>Log in</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={routes.register}>Get started</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </Container>

      {open && (
        <div id="mobile-nav" className="border-t border-border md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 px-3">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={routes.login}>Log in</Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link href={routes.register}>Get started</Link>
              </Button>
            </div>
            <div className="px-3 pt-2">
              <ThemeToggle />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
