"use client";
import { useState } from "react";

const TABS = ["Profile", "Password", "Email"] as const;
type Tab = (typeof TABS)[number];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Profile");
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="flex gap-1 mb-6 border-b">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-gray-500"}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="rounded-xl border p-6">
        {tab === "Profile" && <p className="text-gray-500 text-sm">Profile settings coming soon.</p>}
        {tab === "Password" && <p className="text-gray-500 text-sm">Password change coming soon.</p>}
        {tab === "Email" && <p className="text-gray-500 text-sm">Email change coming soon.</p>}
      </div>
    </main>
  );
}
