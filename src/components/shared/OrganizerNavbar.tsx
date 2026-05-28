"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function OrganizerNavbar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/events?search=${encodeURIComponent(q)}`);
    setQuery("");
    setOpen(false);
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0a0f24]/95 px-6 py-4 backdrop-blur">
      <Link href="/dashboard" className="text-xl font-semibold text-white">
        VeriTix
      </Link>

      <form onSubmit={handleSearch} role="search" className="relative w-full max-w-sm mx-6">
        <label htmlFor="organizer-search" className="sr-only">Search events</label>
        <Search
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          ref={inputRef}
          id="organizer-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search events…"
          className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/40 focus:border-[#4d21ff] focus:outline-none"
        />
        {open && query.trim() && (
          <div className="absolute top-full mt-1 w-full rounded-xl border border-white/10 bg-[#0b1025] py-2 shadow-xl">
            <button
              type="submit"
              className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/5"
            >
              Search for &ldquo;{query}&rdquo;
            </button>
          </div>
        )}
      </form>

      <nav aria-label="Organizer navigation" className="hidden items-center gap-6 text-sm text-white/70 lg:flex">
        <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
        <Link href="/events/manage" className="hover:text-white transition">Events</Link>
        <Link href="/events/create" className="rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-4 py-1.5 text-sm font-semibold text-white">
          + Create
        </Link>
      </nav>
    </header>
  );
}
