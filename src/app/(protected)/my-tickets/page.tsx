"use client";
import { useState } from "react";

const TABS = ["All", "Upcoming", "Past"] as const;
type Tab = (typeof TABS)[number];

export default function MyTicketsPage() {
  const [tab, setTab] = useState<Tab>("All");
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === t ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <p className="text-gray-500 col-span-full text-center py-12">No tickets found for "{tab}".</p>
      </div>
    </main>
  );
}
