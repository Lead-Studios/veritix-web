"use client";

import { HiExternalLink } from "react-icons/hi";

interface NFTBadgeProps {
  txHash: string;
  network?: "testnet" | "mainnet";
}

const NETWORK_EXPLORER: Record<string, string> = {
  testnet: "https://stellar.expert/explorer/testnet",
  mainnet: "https://stellar.expert/explorer/public",
};

export function NFTBadge({ txHash, network = "testnet" }: NFTBadgeProps) {
  const explorerUrl = `${NETWORK_EXPLORER[network]}/tx/${txHash}`;

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-900/60 to-blue-900/60 px-3.5 py-1.5 border border-purple-500/30">
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
      </span>
      <span className="text-xs font-medium text-purple-200">NFT Ticket</span>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 underline transition-colors"
        aria-label="View on Stellar Explorer"
      >
        View on Explorer
        <HiExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
