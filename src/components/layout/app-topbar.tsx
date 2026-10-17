'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { LogOut, Menu, Settings, UserRound } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { routes } from '@/lib/routes';
import { fetcher } from '@/lib/api-client';
import type { User } from '@/types';

export function AppTopbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useSWR<User>('/settings/profile', fetcher);
  const [lastPathname, setLastPathname] = React.useState(pathname);

  // Close the drawer whenever the route changes. Adjusting state during render is
  // the supported pattern here (as in `SiteHeader`); an effect would cost an extra
  // pass and trips `react-hooks/set-state-in-effect`.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const displayName = user?.name ?? user?.email ?? 'Account';

  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Sign out request failed');
      router.replace(routes.home);
      router.refresh();
    } catch {
      // Keep the session intact if it could not be cleared on the server.
      toast.error('Could not sign out. Please try again.');
    }
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`${displayName} account menu`}
              className="size-10 rounded-full border-0 bg-transparent p-0 hover:bg-secondary focus-visible:ring-offset-0"
            >
              <Avatar src={user?.avatarUrl} alt="" aria-hidden="true" fallback={displayName} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 w-48">
              <DropdownMenuItem onSelect={() => router.push(`${routes.settings}?tab=profile`)}>
                <UserRound className="size-4" aria-hidden="true" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push(routes.settings)}>
                <Settings className="size-4" aria-hidden="true" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => void signOut()}>
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
