import * as React from 'react';
import Link from 'next/link';
import { routes } from '@/lib/routes';

/** Centred, distraction-free shell for sign-in and registration flows. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-secondary/30 px-4 py-12">
      <Link href={routes.home} className="mb-8 text-lg font-semibold tracking-tight">
        Veritix
      </Link>
      <main id="main" className="w-full max-w-sm">
        {children}
      </main>
    </div>
  );
}
