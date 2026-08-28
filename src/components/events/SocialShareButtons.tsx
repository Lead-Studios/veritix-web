'use client';

import { useState } from 'react';
import { FaTwitter, FaWhatsapp, FaLink } from 'react-icons/fa';

export default function SocialShareButtons({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 py-4">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Share:
      </span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
      >
        <FaTwitter className="w-4 h-4" />
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-emerald-400 transition-colors"
      >
        <FaWhatsapp className="w-4 h-4" />
      </a>
      <button
        onClick={copyLink}
        aria-label="Copy Link"
        className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-blue-400 transition-colors relative"
      >
        <FaLink className="w-4 h-4" />
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-0.5 rounded shadow">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
