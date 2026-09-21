'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, LayoutDashboard, Settings, Ticket, ScanLine } from 'lucide-react';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: routes.dashboard, label: 'Dashboard', Icon: LayoutDashboard },
  { href: routes.events, label: 'Events', Icon: CalendarDays },
  { href: routes.myTickets, label: 'My tickets', Icon: Ticket },
  { href: routes.verify, label: 'Verify', Icon: ScanLine },
  { href: routes.settings, label: 'Settings', Icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border md:block">
      <nav aria-label="Dashboard" className="sticky top-16 flex flex-col gap-1 p-4">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-secondary font-medium text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
