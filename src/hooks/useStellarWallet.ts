'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isConnected,
  getPublicKey,
  requestAccess,
} from '@stellar/freighter-api';

export function useStellarWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connect = useCallback(async () => {
    try {
      const wasConnected = await isConnected();
      if (wasConnected) {
        const key = await getPublicKey();
        setPublicKey(key);
        setIsWalletConnected(true);
        localStorage.setItem('stellar_public_key', key);
        return;
      }
      const key = await requestAccess();
      setPublicKey(key);
      setIsWalletConnected(true);
      localStorage.setItem('stellar_public_key', key);
    } catch (error) {
      console.error('Error connecting to Freighter:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setIsWalletConnected(false);
    localStorage.removeItem('stellar_public_key');
  }, []);

  useEffect(() => {
    const storedKey = localStorage.getItem('stellar_public_key');
    if (storedKey) {
      setPublicKey(storedKey);
      setIsWalletConnected(true);
    }
  }, []);

  return {
    publicKey,
    isConnected: isWalletConnected,
    connect,
    disconnect,
  };
}