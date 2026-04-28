import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

"use client";

import { useSession } from "@/hooks/useSession";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  useSession();
  return <>{children}</>;
}
