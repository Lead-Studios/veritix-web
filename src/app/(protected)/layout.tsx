import * as React from 'react';
import { AppTopbar } from '@/components/layout/app-topbar';
import { AppSidebar } from '@/components/layout/app-sidebar';

/**
 * Authenticated app shell. Access is gated in src/middleware.ts before this
 * layout renders, so it can assume a session exists.
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppTopbar />
      <div className="flex flex-1">
        <AppSidebar />
        <main id="main" className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
