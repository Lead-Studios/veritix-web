"use client";

import { Suspense } from "react";
import ProfileEditSection from "@/components/profile/ProfileEditSection";
import ChangePasswordSection from "@/components/profile/ChangePasswordSection";
import NotificationPrefsSection from "@/components/profile/NotificationPrefsSection";
import DangerZoneSection from "@/components/profile/DangerZoneSection";
import { getToken } from "@/lib/auth";

// We read the stored user email for the deletion confirmation.
// Falls back to empty string if not available (server render).
function getUserEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem("auth_user") ?? sessionStorage.getItem("auth_user");
    if (raw) return (JSON.parse(raw) as { email?: string }).email ?? "";
  } catch {
    // ignore
  }
  return "";
}

export default function ProfilePage() {
  const userEmail = getUserEmail();

  return (
    <main className="min-h-screen bg-[#060d1f] px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>

        <Suspense fallback={null}>
          <ProfileEditSection />
        </Suspense>

        <ChangePasswordSection />

        <NotificationPrefsSection />

        <DangerZoneSection userEmail={userEmail} />
      </div>
    </main>
  );
}
