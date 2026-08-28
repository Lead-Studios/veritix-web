import React from 'react';
import { SWRConfig } from 'swr';
import { SentryErrorBoundary } from '@/components/shared/SentryErrorBoundary';
import { SWR_CONFIG } from '@/lib/swrConfig';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={SWR_CONFIG}>
      <SentryErrorBoundary
        title="Protected content unavailable"
        description="This section hit an unexpected error. Please refresh and try again."
      >
        {children}
      </SentryErrorBoundary>
    </SWRConfig>
  );
}
