"use client";

import { cn } from "@/lib/cn";
import { Check, Copy, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface WalletAddressDisplayProps {
  address?: string;
  onConnectClick?: () => void;
  className?: string;
}

/** Truncate a Stellar address: GABCD…WXYZ */
function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function WalletAddressDisplay({
  address,
  onConnectClick,
  className,
}: WalletAddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Wallet address copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy to clipboard.");
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
        Linked Wallet
      </label>

      {address ? (
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
          <Wallet className="h-4 w-4 flex-shrink-0 text-[#013237]" />

          {/* Full address visible on wide screens, truncated on small */}
          <span
            className="flex-1 font-mono text-sm text-gray-700 truncate"
            title={address}
          >
            <span className="hidden sm:inline">{address}</span>
            <span className="sm:hidden">{truncateAddress(address)}</span>
          </span>

          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy wallet address"
            className={cn(
              "flex-shrink-0 rounded-md p-1.5 transition-colors",
              copied
                ? "text-emerald-600 bg-emerald-50"
                : "text-gray-400 hover:text-[#013237] hover:bg-gray-100"
            )}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5">
          <span className="text-sm text-gray-400">No wallet connected</span>
          {onConnectClick && (
            <button
              type="button"
              onClick={onConnectClick}
              className="text-xs font-medium text-[#013237] underline underline-offset-2 hover:text-[#024a50] transition-colors"
            >
              Connect wallet →
            </button>
          )}
        </div>
      )}
    </div>
  );
}