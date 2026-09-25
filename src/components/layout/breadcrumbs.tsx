"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Crumb {
  label: string;
  href: string;
}

function getCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = getCrumbs(pathname);
  if (crumbs.length <= 1) return null;
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {isLast ? (
              <span aria-current="page" className="text-foreground font-medium">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-foreground transition-colors">{crumb.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
