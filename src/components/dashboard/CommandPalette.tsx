'use client';

import { useState, useEffect, useRef, useCallback, useId } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Ticket,
  BarChart2,
  LayoutDashboard,
  Calendar,
  ShieldCheck,
  Search,
  X,
} from 'lucide-react';

// ─── Static catalogue ─────────────────────────────────────────────────────────

interface PaletteItem {
  id: string;
  label: string;
  group: 'Quick Actions' | 'Navigation';
  href: string;
  icon: React.ReactNode;
  keywords: string[];
}

const PALETTE_ITEMS: PaletteItem[] = [
  // Quick Actions
  {
    id: 'create-event',
    label: 'Create Event',
    group: 'Quick Actions',
    href: '/events/create',
    icon: <PlusCircle size={15} aria-hidden="true" />,
    keywords: ['create', 'new', 'event', 'add'],
  },
  {
    id: 'manage-tickets',
    label: 'Manage Tickets',
    group: 'Quick Actions',
    href: '/events/manage',
    icon: <Ticket size={15} aria-hidden="true" />,
    keywords: ['manage', 'tickets', 'edit'],
  },
  {
    id: 'view-analytics',
    label: 'View Analytics',
    group: 'Quick Actions',
    href: '/events',
    icon: <BarChart2 size={15} aria-hidden="true" />,
    keywords: ['analytics', 'stats', 'reports', 'view'],
  },
  // Navigation
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    group: 'Navigation',
    href: '/dashboard',
    icon: <LayoutDashboard size={15} aria-hidden="true" />,
    keywords: ['dashboard', 'home', 'overview'],
  },
  {
    id: 'nav-events',
    label: 'Events',
    group: 'Navigation',
    href: '/events',
    icon: <Calendar size={15} aria-hidden="true" />,
    keywords: ['events', 'calendar', 'list'],
  },
  {
    id: 'nav-tickets',
    label: 'Tickets',
    group: 'Navigation',
    href: '/tickets',
    icon: <Ticket size={15} aria-hidden="true" />,
    keywords: ['tickets', 'my tickets'],
  },
  {
    id: 'nav-verify',
    label: 'Verification',
    group: 'Navigation',
    href: '/verify',
    icon: <ShieldCheck size={15} aria-hidden="true" />,
    keywords: ['verify', 'verification', 'scan', 'check-in', 'gate'],
  },
];

// ─── Fuzzy match ──────────────────────────────────────────────────────────────

function fuzzyMatch(item: PaletteItem, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return item.label.toLowerCase().includes(q) || item.keywords.some((k) => k.includes(q));
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CommandPaletteProps {
  /** Extra event names to include in results (pulled from organizer analytics) */
  eventNames?: string[];
}

export function CommandPalette({ eventNames = [] }: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const inputId = useId();

  // Build full item list (static + dynamic events)
  const allItems: PaletteItem[] = [
    ...PALETTE_ITEMS,
    ...eventNames.map((name, i) => ({
      id: `event-${i}`,
      label: name,
      group: 'Quick Actions' as const,
      href: `/events/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`,
      icon: <Calendar size={15} aria-hidden="true" />,
      keywords: name.toLowerCase().split(/\s+/),
    })),
  ];

  const filtered = allItems.filter((item) => fuzzyMatch(item, query));

  // Group the filtered results
  const groups = Array.from(new Set(filtered.map((i) => i.group)));

  // ── Open / close ───────────────────────────────────────────────────────────

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  // ── Global keyboard shortcut ───────────────────────────────────────────────

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) {
            closePalette();
            return false;
          }
          openPalette();
          return true;
        });
      }
      // Allow Escape to close from anywhere (useful when focus is not in input)
      if (e.key === 'Escape') {
        closePalette();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openPalette, closePalette]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      // Small delay so the modal finishes rendering
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // ── In-palette keyboard navigation ────────────────────────────────────────

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      closePalette();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? Math.max(filtered.length - 1, 0) : prev - 1,
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) {
        closePalette();
        router.push(item.href);
      }
    }
  }

  // ── Active item id for aria-activedescendant ──────────────────────────────

  const activeItemId =
    filtered.length > 0 ? `${listboxId}-${filtered[activeIndex]?.id}` : undefined;

  if (!open) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
      role="presentation"
      onClick={closePalette}
    >
      {/* Dim */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-brand-primary/50 bg-surface-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search size={15} className="shrink-0 text-gray-500" aria-hidden="true" />
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search actions, events, pages…"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
            // ARIA combobox
            role="combobox"
            aria-expanded={filtered.length > 0}
            aria-controls={listboxId}
            aria-activedescendant={activeItemId}
            aria-autocomplete="list"
            aria-label="Search command palette"
          />
          <button
            onClick={closePalette}
            className="shrink-0 text-gray-500 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary rounded"
            aria-label="Close command palette"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Results listbox */}
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Command palette results"
          className="max-h-[360px] overflow-y-auto py-2"
        >
          {filtered.length === 0 ? (
            <li
              className="px-4 py-6 text-center text-sm text-gray-500"
              role="option"
              aria-selected={false}
            >
              No results for &ldquo;{query}&rdquo;
            </li>
          ) : (
            groups.map((group) => {
              const groupItems = filtered.filter((i) => i.group === group);
              return (
                <li key={group} role="presentation">
                  <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                    {group}
                  </p>
                  <ul role="group" aria-label={group}>
                    {groupItems.map((item) => {
                      const itemIndex = filtered.indexOf(item);
                      const isActive = itemIndex === activeIndex;
                      return (
                        <li
                          key={item.id}
                          id={`${listboxId}-${item.id}`}
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => setActiveIndex(itemIndex)}
                          onClick={() => {
                            closePalette();
                            router.push(item.href);
                          }}
                          className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            isActive
                              ? 'bg-brand-primary/20 text-white'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span
                            className={isActive ? 'text-brand-accent' : 'text-gray-500'}
                          >
                            {item.icon}
                          </span>
                          {item.label}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })
          )}
        </ul>

        {/* Footer hint */}
        <div className="border-t border-white/5 px-4 py-2 flex items-center gap-4 text-[10px] text-gray-600">
          <span>
            <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[9px]">↑↓</kbd>{' '}
            Navigate
          </span>
          <span>
            <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[9px]">↵</kbd>{' '}
            Open
          </span>
          <span>
            <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[9px]">
              Esc
            </kbd>{' '}
            Close
          </span>
          <span className="ml-auto">
            <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-[9px]">⌘/</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
