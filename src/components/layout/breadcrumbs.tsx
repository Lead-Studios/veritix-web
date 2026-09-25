'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Crumb {
  label: string;
  href: string;
}

function getCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }));
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = getCrumbs(pathname);
  if (crumbs.length <= 1) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex items-center gap-1 text-sm text-muted-foreground"
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1">
            {/* The separator is punctuation, not content: announcing "slash"
                between every crumb adds noise to every navigation. */}
            {i > 0 && <span aria-hidden="true">/</span>}
            {isLast ? (
              <span aria-current="page" className="font-medium text-foreground">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
