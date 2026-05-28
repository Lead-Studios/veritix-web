"use client";

/**
 * FE-121: Shows the active Stellar network (testnet/mainnet) as a small badge.
 * Renders nothing on mainnet to avoid cluttering production UI.
 */
export function StellarNetworkBadge() {
  const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet";

  if (network === "mainnet") return null;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-900/60 text-yellow-300 border border-yellow-700"
      title="Connected to Stellar Testnet"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" aria-hidden="true" />
      Testnet
    </span>
  );
}
