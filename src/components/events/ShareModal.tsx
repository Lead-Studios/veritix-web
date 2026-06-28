"use client";
import { useState } from "react";

interface Props { url: string; title: string; onClose: () => void; }

export default function ShareModal({ url, title, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const share = () => { if (navigator.share) navigator.share({ title, url }); };
  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-80 flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-semibold text-lg">Share Event</h2>
        <button onClick={copy} className="w-full border rounded-lg py-2 text-sm">{copied ? "Copied!" : "Copy Link"}</button>
        <a href={tweet} target="_blank" rel="noreferrer" className="w-full border rounded-lg py-2 text-sm text-center block">Share on Twitter</a>
        <a href={wa} target="_blank" rel="noreferrer" className="w-full border rounded-lg py-2 text-sm text-center block">Share on WhatsApp</a>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button onClick={share} className="w-full bg-primary text-white rounded-lg py-2 text-sm">More options</button>
        )}
        <button onClick={onClose} className="text-xs text-gray-400 mt-1">Close</button>
      </div>
    </div>
  );
}
