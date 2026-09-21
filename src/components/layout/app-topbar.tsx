import * as React from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { routes } from '@/lib/routes';

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={routes.home} className="text-base font-semibold tracking-tight">
          Veritix
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Replaced with the signed-in user once the auth session lands. */}
          <Avatar alt="Account" />
        </div>
      </div>
    </header>
  );
}
