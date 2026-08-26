import React from 'react';
import { SWRConfig } from 'swr';
import { OrganizerNavbar } from '@/components/shared/OrganizerNavbar';
import { SentryErrorBoundary } from '@/components/shared/SentryErrorBoundary';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ revalidateOnFocus: false, dedupingInterval: 60_000 }}>
      <SentryErrorBoundary
        title="Protected content unavailable"
        description="This section hit an unexpected error. Please refresh and try again."
      >
        {children}
      </SentryErrorBoundary>
    </SWRConfig>
  );
}
