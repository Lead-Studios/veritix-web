// FE-099: Organizer navigation shell link definitions
// Provides the navigation items for the protected organizer app shell.

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const ORGANIZER_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",    href: "/dashboard",       icon: "dashboard" },
  { label: "Events",       href: "/events",          icon: "calendar" },
  { label: "Tickets",      href: "/tickets",         icon: "ticket" },
  { label: "Verification", href: "/verify",          icon: "shield-check" },
];

export function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}