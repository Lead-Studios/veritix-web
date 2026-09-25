import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/providers/app-providers';
import { themeInitScript } from '@/components/theme/theme-provider';
import { env } from '@/lib/env';
import './global.css';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});




export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  applicationName: 'Veritix',
  // public/manifest.json is what makes the app installable; the service worker
  // behind it is emitted by `npm run build:pwa` (ENABLE_PWA=true).
  manifest: '/manifest.json',
  title: {
    default: 'Veritix — on-chain ticketing',
    template: '%s · Veritix',
  },
  description:
    'Buy and sell event tickets with payment settled on-chain. Organizers get paid on time; buyers stay protected by escrow.',
  openGraph: {
    type: 'website',
    siteName: 'Veritix',
    title: 'Veritix — on-chain ticketing',
    description: 'Event ticketing with escrowed, on-chain settlement.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#101428' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans">
        {/*
          Applies the stored theme before paint so dark-mode users see no flash.
          It lives at the top of <body> rather than in a manual <head>, which the
          App Router owns and which breaks hydration when rendered by hand.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
