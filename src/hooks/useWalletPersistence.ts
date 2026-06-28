"use client";

import { useCallback, useEffect, useState } from "react";

export interface PersistedWallet {
  address: string;
  network: string;
  walletType: string;
}

const STORAGE_KEY = "veritix_wallet";

function readWallet(): PersistedWallet | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedWallet) : null;
  } catch {
    return null;
  }
}

function writeWallet(wallet: PersistedWallet | null): void {
  if (typeof window === "undefined") return;
  if (wallet) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * FE-123: Persists wallet connection across page refreshes using sessionStorage.
 * sessionStorage is cleared when the browser tab is closed, which is the
 * expected behaviour for a wallet session.
 */
export function useWalletPersistence() {
  const [wallet, setWalletState] = useState<PersistedWallet | null>(null);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWalletState(readWallet());
  }, []);

  const setWallet = useCallback((w: PersistedWallet | null) => {
    writeWallet(w);
    setWalletState(w);
  }, []);

  const clearWallet = useCallback(() => setWallet(null), [setWallet]);

  return { wallet, setWallet, clearWallet };
}
