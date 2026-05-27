"use client";

import { useState, useEffect, useRef } from "react";

interface WalletNavDropdownProps {
  address: string;
  network: string;
  onDisconnect: () => void;
}

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/**
 * FE-125: Connected-wallet nav dropdown that shows the wallet address,
 * network, and XLM balance fetched from Horizon.
 */
export function WalletNavDropdown({ address, network, onDisconnect }: WalletNavDropdownProps) {
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch XLM balance from Horizon when dropdown opens
  useEffect(() => {
    if (!open || balance !== null) return;
    setLoadingBalance(true);
    const horizonBase =
      network.toLowerCase().includes("test")
        ? "https://horizon-testnet.stellar.org"
        : "https://horizon.stellar.org";

    fetch(`${horizonBase}/accounts/${address}`)
      .then((r) => r.json())
      .then((data) => {
        const xlm = (data.balances as { asset_type: string; balance: string }[])?.find(
          (b) => b.asset_type === "native"
        );
        setBalance(xlm ? `${parseFloat(xlm.balance).toFixed(2)} XLM` : "—");
      })
      .catch(() => setBalance("—"))
      .finally(() => setLoadingBalance(false));
  }, [open, address, network, balance]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4D21FF]/60 bg-[#4D21FF]/10 text-white text-sm hover:bg-[#4D21FF]/20 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="w-2 h-2 rounded-full bg-green-400" aria-hidden="true" />
        {truncate(address)}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-[#101428] shadow-xl z-50 p-4 space-y-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Address</p>
            <p className="text-xs font-mono text-gray-300 break-all mt-0.5">{address}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Network</p>
            <p className="text-sm text-gray-300 mt-0.5">{network}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Balance</p>
            <p className="text-sm text-gray-300 mt-0.5">
              {loadingBalance ? (
                <span className="inline-block w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                balance ?? "—"
              )}
            </p>
          </div>
          <button
            onClick={() => { setOpen(false); onDisconnect(); }}
            className="w-full py-2 rounded-lg border border-red-700/50 text-red-400 text-sm hover:bg-red-900/20 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
