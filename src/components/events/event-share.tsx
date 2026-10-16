'use client';

import { toast } from 'react-toastify';
import { HiShare, HiLink } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import { useMounted } from '@/hooks/useMounted';

/**
 * Sharing for an event.
 *
 * Prefers the native Web Share API, which on mobile opens the real system
 * sheet. Where that is unavailable — every desktop browser without it — the
 * same click copies the link instead, and the direct social URLs are always
 * there as an explicit alternative.
 */

export interface EventShareProps {
  /** Event title, used as the share text. */
  title: string;
  /** Defaults to the current page URL. */
  url?: string;
  className?: string;
}

interface ShareTarget {
  label: string;
  href: (url: string, text: string) => string;
}

const SHARE_TARGETS: ShareTarget[] = [
  {
    label: 'X',
    href: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    label: 'Facebook',
    href: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: 'LinkedIn',
    href: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    label: 'WhatsApp',
    href: (url, text) =>
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
];

const COPY_FAILED =
  'Could not copy the link — copy it from the address bar instead';

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function EventShare({ title, url, className }: EventShareProps) {
  // The URL is only knowable in the browser, so resolve it after hydration to
  // keep the server and client markup identical.
  const mounted = useMounted();
  const eventUrl =
    url ?? (mounted && typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `${title} on Veritix`;

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: eventUrl });
        return;
      } catch (error) {
        // Dismissing the sheet is not a failure worth reporting.
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    if (await copyToClipboard(eventUrl)) toast.success('Link copied to your clipboard');
    else toast.error(COPY_FAILED);
  };

  const handleCopy = async () => {
    if (await copyToClipboard(eventUrl)) toast.success('Link copied to your clipboard');
    else toast.error(COPY_FAILED);
  };

  return (
    <section
      aria-label="Share this event"
      className={cn('flex flex-col gap-3', className)}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void handleShare()}
          className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
        >
          <HiShare className="h-4 w-4" aria-hidden="true" />
          Share
        </button>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="inline-flex items-center gap-2 rounded-lg bg-transparent px-3 py-1.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          <HiLink className="h-4 w-4" aria-hidden="true" />
          Copy link
        </button>
      </div>

      <ul className="flex flex-wrap items-center gap-1">
        {SHARE_TARGETS.map((target) => (
          <li key={target.label}>
            <a
              href={target.href(eventUrl, shareText)}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              {target.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
