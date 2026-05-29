"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { ORGANIZER_NAV_ITEMS, isActiveRoute } from "@/lib/organizerNav";

// ─── Search ───────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  label: string;
  category: "Events" | "Tickets" | "Attendees";
  href: string;
}

// Stub: replace with real API calls
function useGlobalSearch(query: string): SearchResult[] {
  return useMemo(() => {
    if (!query.trim()) return [];
    // Simulated grouped results — swap for real fetch
    return [
      { id: "e1", label: `Event: "${query}"`, category: "Events", href: "/events" },
      { id: "t1", label: `Ticket: "${query}"`, category: "Tickets", href: "/tickets" },
      { id: "a1", label: `Attendee: "${query}"`, category: "Attendees", href: "/verify" },
    ];
  }, [query]);
}

const CATEGORIES: SearchResult["category"][] = ["Events", "Tickets", "Attendees"];

function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const results = useGlobalSearch(query);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        aria-label="Open search (Ctrl+K)"
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50 transition hover:border-white/20 hover:text-white/80"
      >
        <Search size={14} />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="hidden sm:inline rounded bg-white/10 px-1.5 py-0.5 text-xs">⌘K</kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Global search"
          className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0b1025] shadow-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <Search size={14} className="shrink-0 text-white/40" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, tickets, attendees…"
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              aria-label="Search"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X size={14} className="text-white/40 hover:text-white" />
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto py-2">
            {query.trim() === "" ? (
              <p className="px-4 py-6 text-center text-xs text-white/30">
                Type to search across events, tickets, and attendees
              </p>
            ) : results.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-white/30">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              CATEGORIES.map((cat) => {
                const group = results.filter((r) => r.category === cat);
                if (!group.length) return null;
                return (
                  <div key={cat}>
                    <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white/30">
                      {cat}
                    </p>
                    {group.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.href)}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

function MobileDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        role="navigation"
        aria-label="Mobile navigation"
        className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0b1025] border-r border-white/10 p-6"
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="text-lg font-bold text-white">VeriTix</span>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-full bg-white/10 p-1.5 text-white/60 transition hover:bg-white/20 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <ul className="flex flex-col gap-1">
          {ORGANIZER_NAV_ITEMS.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#4D21FF]/20 text-[#21D4FF]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function OrganizerNavbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1025]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav"
          >
            <Menu size={20} />
          </button>

          {/* Desktop nav links */}
          <nav
            aria-label="Organizer navigation"
            className="hidden md:flex items-center gap-1"
          >
            {ORGANIZER_NAV_ITEMS.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[#4D21FF]/20 text-[#21D4FF]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logo / brand (mobile center) */}
          <span className="md:hidden absolute left-1/2 -translate-x-1/2 text-sm font-bold text-white">
            VeriTix
          </span>

          {/* Search */}
          <GlobalSearch />
        </div>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
