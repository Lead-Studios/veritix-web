"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/events/manage", label: "My Events" },
  { href: "/events/create", label: "Create Event" },
  { href: "/verify", label: "Verify Tickets" },
  { href: "/tickets", label: "My Tickets" },
];

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        aria-hidden="true"
        onClick={onClose}
      />
      <nav
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0f24] border-r border-white/10 flex flex-col p-6 lg:hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <span className="text-xl font-semibold text-white">VeriTix</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-white/60 hover:text-white hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="space-y-1 flex-1">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={onClose}
                className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-[#4d21ff]/20 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
