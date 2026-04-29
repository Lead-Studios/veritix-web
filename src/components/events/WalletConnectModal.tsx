'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface WalletConnection {
  address: string;
  network: string;
}

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected?: (wallet: WalletConnection) => void;
}

type ConnectionStatus = 'idle' | 'pending' | 'success' | 'error' | 'not_installed';

// Freighter injects itself into window — typed minimally to avoid a package dep
interface FreighterApi {
  isConnected(): Promise<boolean>;
  getPublicKey(): Promise<string>;
  getNetwork(): Promise<string>;
  requestAccess(): Promise<string>;
}

function getFreighter(): FreighterApi | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).freighter as FreighterApi | null ?? null;
}

export default function WalletConnectModal({
  isOpen,
  onClose,
  onConnected,
}: WalletConnectModalProps) {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    setStatus('idle');
    setWallet(null);
    setErrorMsg('');
    onClose();
  };

  const connectFreighter = async () => {
    const freighter = getFreighter();
    if (!freighter) {
      setStatus('not_installed');
      return;
    }

    setStatus('pending');
    setErrorMsg('');
    try {
      await freighter.requestAccess();
      const [address, network] = await Promise.all([
        freighter.getPublicKey(),
        freighter.getNetwork(),
      ]);
      const connection: WalletConnection = { address, network };
      setWallet(connection);
      setStatus('success');
      onConnected?.(connection);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection cancelled or failed.';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-primary-dark-blue rounded-2xl border border-[#E0E0E033]/20 p-6 max-w-md w-full mx-4 flex flex-col gap-4"
      >
        <h3 id="wallet-modal-title" className="text-xl font-bold text-white">
          Connect Wallet
        </h3>

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400 text-sm"
            >
              Connect your Freighter wallet to purchase tickets on the Stellar network.
            </motion.p>
          )}

          {status === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 text-gray-300 text-sm"
            >
              <div className="w-5 h-5 border-2 border-[#4D21FF] border-t-transparent rounded-full animate-spin flex-shrink-0" />
              Waiting for Freighter approval…
            </motion.div>
          )}

          {status === 'success' && wallet && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <p className="text-green-400 text-sm font-semibold">✓ Wallet connected</p>
              <p className="text-gray-400 text-xs break-all">
                <span className="text-gray-300 font-medium">Address: </span>
                {wallet.address}
              </p>
              <p className="text-gray-400 text-xs">
                <span className="text-gray-300 font-medium">Network: </span>
                {wallet.network}
              </p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.p
              key="error"
              role="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-sm"
            >
              {errorMsg || 'Connection failed. Please try again.'}
            </motion.p>
          )}

          {status === 'not_installed' && (
            <motion.div
              key="not_installed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <p className="text-yellow-400 text-sm">Freighter wallet not detected.</p>
              <a
                href="https://www.freighter.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B8CFF] text-sm underline"
              >
                Install Freighter →
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 mt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClose}
            className="flex-1 py-3 bg-gray-600 text-white rounded-xl"
          >
            {status === 'success' ? 'Close' : 'Cancel'}
          </motion.button>

          {status !== 'success' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectFreighter}
              disabled={status === 'pending'}
              className="flex-1 py-3 bg-linear-to-r from-[#6B8CFF] to-[#5AB9EA] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'pending' ? 'Connecting…' : status === 'not_installed' ? 'Retry' : 'Connect'}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
