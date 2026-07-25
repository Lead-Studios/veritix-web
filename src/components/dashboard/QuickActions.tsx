"use client";

import Link from "next/link";
import { PlusCircle, Ticket, BarChart2, Command } from "lucide-react";
import { CommandPalette } from "./CommandPalette";

const ACTIONS = [
  {
    href: "/events/create",
    label: "Create Event",
    Icon: PlusCircle,
    variant: "primary",
  },
  {
    href: "/events/manage",
    label: "Manage Tickets",
    Icon: Ticket,
    variant: "secondary",
  },
  {
    href: "/events",
    label: "View Analytics",
    Icon: BarChart2,
    variant: "secondary",
  },
] as const;

interface QuickActionsProps {
  /** Event names forwarded to the command palette for fuzzy searching */
  eventNames?: string[];
}

export const QuickActions = ({ eventNames = [] }: QuickActionsProps) => (
  <section
    aria-label="Quick actions"
    className="mx-auto mb-10 max-w-2xl rounded-xl border border-[#4D21FF]/40 bg-[#000625]/60 p-6"
  >
    <div className="mb-4 flex items-center justify-between">
      <p className="text-xs uppercase tracking-widest text-[#21D4FF]">
        Quick Actions
      </p>
      {/* Keyboard hint */}
      <p className="hidden sm:flex items-center gap-1.5 text-[10px] text-gray-500 select-none">
        <Command size={10} aria-hidden="true" />
        <kbd className="font-mono">/</kbd>
        <span>Open command palette</span>
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-3">
      {ACTIONS.map(({ href, label, Icon, variant }) => (
        <Link
          key={href}
          href={href}
          className={
            variant === "primary"
              ? "flex flex-1 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#4D21FF_0%,#21D4FF_100%)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D21FF]"
              : "flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#4D21FF] bg-transparent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D21FF]"
          }
        >
          <Icon size={16} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </div>

    {/* The palette mounts here; it renders as a portal-like overlay when open */}
    <CommandPalette eventNames={eventNames} />
  </section>
);
