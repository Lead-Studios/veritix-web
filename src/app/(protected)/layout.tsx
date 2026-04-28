"use client";

import React from "react";
import { useAuthState } from "@/hooks/useAuthState";
import AuthLoadingShell from "@/components/auth/AuthLoadingShell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthState();

  if (isLoading) {
    return <AuthLoadingShell />;
  }

  return <>{children}</>;
}
