'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { routes } from '@/lib/routes';

export function AppTopbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  React.useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 rounded-md hover:bg-secondary" aria-label="Open navigation menu">
                <Menu className="size-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0">
              <AppSidebar />
            </SheetContent>
          </Sheet>
          <Link href={routes.home} className="text-base font-semibold tracking-tight">
            Veritix
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Avatar alt="Account" />
        </div>
      </div>
    </header>
  );
}
