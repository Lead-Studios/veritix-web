"use client";

import React from "react";
import { SWRConfig } from "swr";
import { useAuthState } from "@/hooks/useAuthState";
import AuthLoadingShell from "@/components/auth/AuthLoadingShell";
import { OrganizerNavbar } from "@/components/shared/OrganizerNavbar";
import { SentryErrorBoundary } from "@/components/shared/SentryErrorBoundary";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthState();

  if (isLoading) {
    return <AuthLoadingShell />;
  }

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
