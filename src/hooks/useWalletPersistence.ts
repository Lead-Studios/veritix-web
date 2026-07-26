"use client";

import { useState, useCallback, useEffect } from "react";

export interface PersistedWallet {
  address: string;
  network: string;
  walletType: string;
}

function isPersistedWallet(value: unknown): value is PersistedWallet {
  return (
    typeof value === "object" &&
    value !== null &&
    "address" in value &&
    "network" in value &&
    "walletType" in value
  );
}

const STORAGE_KEY = "veritix_wallet";

function readWallet(): PersistedWallet | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isPersistedWallet(parsed)) {
        return parsed;
      }
    }
    return null;
  } catch (e: unknown) {
    console.error("Failed to read wallet from session storage", e);
    return null;
  }
}

function writeWallet(wallet: PersistedWallet | null): void {
  if (typeof window === "undefined") return;
  try {
    if (wallet) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch (e: unknown) {
    console.error("Failed to write wallet to session storage", e);
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
