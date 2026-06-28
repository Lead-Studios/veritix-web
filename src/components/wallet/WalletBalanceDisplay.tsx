"use client";

import { useCallback, useEffect, useState } from "react";
import { isConnected, getPublicKey } from "@stellar/freighter-api";
import { HiOutlineRefresh } from "react-icons/hi";
import { StellarNetworkBadge } from "@/components/shared/StellarNetworkBadge";

interface WalletBalanceDisplayProps {
  onDisconnect?: () => void;
}

async function fetchXlmBalance(publicKey: string): Promise<string> {
  const res = await fetch(
    `https://horizon-testnet.stellar.org/accounts/${publicKey}`
  );
  if (!res.ok) throw new Error("Failed to fetch balance");
  const data = await res.json();
  const xlmBalance = data.balances?.find(
    (b: { asset_type: string }) => b.asset_type === "native"
  );
  return xlmBalance?.balance ?? "0";
}

export function WalletBalanceDisplay({ onDisconnect }: WalletBalanceDisplayProps) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    const connected = await isConnected();
    if (!connected) {
      setPublicKey(null);
      setBalance(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const key = await getPublicKey();
      setPublicKey(key);
      const bal = await fetchXlmBalance(key);
      setBalance(bal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load balance");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  const truncatedKey = publicKey
    ? `${publicKey.slice(0, 4)}…${publicKey.slice(-4)}`
    : null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#020718]/80 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4D21FF] to-[#21D4FF] text-white text-xs font-bold">
            S
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Stellar Wallet</p>
            {truncatedKey && (
              <p className="text-xs font-mono text-gray-500">{truncatedKey}</p>
            )}
          </div>
        </div>
        <StellarNetworkBadge />
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
            <span className="text-xs text-gray-500">Loading…</span>
          </div>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : balance !== null ? (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Balance</p>
            <p className="text-2xl font-bold text-white">
              {Number(balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-sm font-normal text-gray-400">XLM</span>
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Wallet not connected</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={refreshBalance}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:border-white/20 transition-colors disabled:opacity-50"
        >
          <HiOutlineRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
        {onDisconnect && (
          <button
            onClick={onDisconnect}
            className="px-4 py-2 rounded-lg border border-red-700/30 text-sm text-red-400 hover:bg-red-900/10 transition-colors"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}
