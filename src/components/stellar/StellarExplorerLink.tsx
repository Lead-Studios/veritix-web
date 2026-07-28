"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check } from "lucide-react";

interface StellarExplorerLinkProps {
  /** The Stellar transaction hash */
  txHash: string;
  /** The Stellar network — determines the explorer URL */
  network: "testnet" | "mainnet";
  /** Optional CSS class names for the wrapper */
  className?: string;
}

function truncateHash(hash: string, leading = 8, trailing = 8): string {
  if (hash.length <= leading + trailing + 3) return hash;
  return `${hash.slice(0, leading)}…${hash.slice(-trailing)}`;
}

/**
 * Renders a "View on Stellar Expert ↗" link for a transaction hash,
 * plus a copy-to-clipboard button showing the truncated hash.
 *
 * @see Issue #676
 */
export function StellarExplorerLink({
  txHash,
  network,
  className = "",
}: StellarExplorerLinkProps) {
  const [copied, setCopied] = useState(false);

  if (!txHash) return null;

  const explorerUrl = `https://stellar.expert/explorer/${network}/tx/${txHash}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-3 text-sm ${className}`}
      aria-label="Stellar transaction details"
    >
      {/* Truncated hash + copy button */}
      <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
        <span className="font-mono text-xs text-gray-300" title={txHash}>
          {truncateHash(txHash)}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="ml-1 text-gray-400 hover:text-white transition-colors"
          aria-label={copied ? "Hash copied" : "Copy transaction hash"}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Explorer link */}
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-[#21D4FF] hover:underline"
      >
        View on Stellar Expert
        <ExternalLink className="w-3 h-3" aria-hidden="true" />
      </a>
    </div>
  );
}
