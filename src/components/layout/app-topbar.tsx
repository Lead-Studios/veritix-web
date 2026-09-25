'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { routes } from '@/lib/routes';

export interface AppTopbarProps {
  /** Display name of the signed-in user, when it is known. */
  userName?: string;
}

export function AppTopbar({ userName }: AppTopbarProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              {/* The `Button` primitive rather than a bare <button>: the hand-rolled
                  classes here skipped the focus ring that every other control in
                  the app gets from `ui/button`. */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            {/* `title` is the accessible name. Without it this rendered
                role="dialog" aria-modal="true" with nothing to announce. */}
            <SheetContent side="left" title="Navigation" className="w-60 p-0">
              <AppSidebar />
            </SheetContent>
          </Sheet>
          <Link href={routes.home} className="text-base font-semibold tracking-tight">
            Veritix
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle distinguishingLabel="app" />
          {/* A constant alt="Account" was announced literally by every screen
              reader, and is misleading when an image is present. With no name
              known the avatar is decorative; the sidebar carries the account
              link instead. */}
          {userName ? (
            <Avatar alt={`${userName}’s avatar`} />
          ) : (
            <Avatar alt="" aria-hidden="true" />
          )}
        </div>
      </div>
    </header>
  );
}
