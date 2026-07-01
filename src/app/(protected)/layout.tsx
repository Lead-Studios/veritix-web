"use client";

import React from "react";
import { SWRConfig } from "swr";
import { useAuthState } from "@/hooks/useAuthState";
import AuthLoadingShell from "@/components/auth/AuthLoadingShell";
import { OrganizerNavbar } from "@/components/shared/OrganizerNavbar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthState();

  if (isLoading) {
    return <AuthLoadingShell />;
  }

  return (
    <SWRConfig value={{ revalidateOnFocus: false, dedupingInterval: 60_000 }}>
      {children}
    </SWRConfig>
  );
}
