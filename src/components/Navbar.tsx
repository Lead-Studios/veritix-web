"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "My Tickets", href: "/tickets" },
    { name: "Create Events", href: "/create-events" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full border-b border-white/10 bg-gradient-to-r from-[#020617] via-[#020617] to-[#0a1b3d]">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-wide text-white"
        >
          Veritix
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-10 text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative transition ${
                  isActive ? "text-blue-400" : "text-white/70 hover:text-white"
                }`}
              >
                {link.name}

                {isActive && (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-blue-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/10 transition">
            <span className="text-white/80">🔔</span>
          </button>

          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-semibold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
