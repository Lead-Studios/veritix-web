"use client";

import { useSession } from "@/hooks/useSession";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  useSession();
  return <>{children}</>;
}
