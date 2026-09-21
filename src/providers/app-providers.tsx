'use client';

import * as React from 'react';
import { SWRConfig } from 'swr';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { fetcher, ApiError } from '@/lib/api-client';

/**
 * Single place to mount every client-side provider. Add new providers here
 * rather than nesting them into the root layout.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
          shouldRetryOnError: (error: unknown) => {
            // A 4xx will not succeed on retry — only retry transport/5xx failures.
            if (error instanceof ApiError) return !error.isClientError;
            return true;
          },
          errorRetryCount: 3,
        }}
      >
        {children}
      </SWRConfig>
    </ThemeProvider>
  );
}
