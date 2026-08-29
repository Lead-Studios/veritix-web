'use client';

import { useState, useEffect } from 'react';
import { FaTwitter, FaWhatsapp, FaLink, FaCheck } from 'react-icons/fa';

export default function SocialShareButtons({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
export interface SocialShareButtonsProps {
  title?: string;
  url?: string;
  className?: string;
}

export function SocialShareButtons({
  title = 'Check out this event on VeriTix',
  url,
  className = '',
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url ?? '');

  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    } else if (url) {
      setCurrentUrl(url);
    }
  }, [url]);

  const activeUrl = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(activeUrl);
  const encodedTitle = encodeURIComponent(title);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

  const copyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(activeUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = activeUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback or permission error
    }
  };

  return (
    <div className="flex items-center gap-3 py-4">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Share:
      </span>
    <div className={`flex items-center gap-3 py-2 ${className}`} aria-label="Social share buttons">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Share:</span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 hover:text-[#1DA1F2] text-white border border-white/10 hover:border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B8CFF]"
      >
        <FaTwitter className="w-4 h-4" />
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 border border-white/10 hover:border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B8CFF]"
      >
        <FaWhatsapp className="w-4 h-4" />
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? "Link copied!" : "Copy link"}
        className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-blue-400 hover:text-blue-300 border border-white/10 hover:border-white/20 transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-[#6B8CFF]"
      >
        {copied ? <FaCheck className="w-4 h-4 text-green-400" /> : <FaLink className="w-4 h-4" />}
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap border border-white/10">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}

export default SocialShareButtons;
