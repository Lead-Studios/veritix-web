'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface WalletConnection {
  address: string;
  network: string;
  walletType: string;
}

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected?: (wallet: WalletConnection) => void;
}

type ConnectionStatus = 'idle' | 'pending' | 'success' | 'error' | 'not_installed';

interface FreighterApi {
  isConnected(): Promise<boolean>;
  getPublicKey(): Promise<string>;
  getNetwork(): Promise<string>;
  requestAccess(): Promise<string>;
}

interface XBullApi {
  connect(): Promise<{ publicKey: string }>;
  getNetwork(): Promise<string>;
}

function getFreighter(): FreighterApi | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).freighter as FreighterApi | null ?? null;
}

function getXBull(): XBullApi | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).xBullSDK as XBullApi | null ?? null;
}

const WALLETS = [
  {
    id: 'freighter',
    name: 'Freighter',
    description: 'Official Stellar browser extension',
    installUrl: 'https://www.freighter.app/',
    logo: '🔑',
  },
  {
    id: 'xbull',
    name: 'xBull',
    description: 'Multi-platform Stellar wallet',
    installUrl: 'https://xbull.app/',
    logo: '🐂',
  },
] as const;

type WalletId = (typeof WALLETS)[number]['id'];

export default function WalletConnectModal({
  isOpen,
  onClose,
  onConnected,
}: WalletConnectModalProps) {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<WalletId | null>(null);

  const handleClose = () => {
    setStatus('idle');
    setWallet(null);
    setErrorMsg('');
    setSelectedWallet(null);
    onClose();
  };

  const connectWallet = async (walletId: WalletId) => {
    setSelectedWallet(walletId);
    setStatus('pending');
    setErrorMsg('');

    try {
      let address: string;
      let network: string;

      if (walletId === 'freighter') {
        const freighter = getFreighter();
        if (!freighter) { setStatus('not_installed'); return; }
        await freighter.requestAccess();
        [address, network] = await Promise.all([freighter.getPublicKey(), freighter.getNetwork()]);
      } else {
        const xbull = getXBull();
        if (!xbull) { setStatus('not_installed'); return; }
        const result = await xbull.connect();
        address = result.publicKey;
        network = await xbull.getNetwork();
      }

      const connection: WalletConnection = { address, network, walletType: walletId };
      setWallet(connection);
      setStatus('success');
      onConnected?.(connection);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Connection cancelled or failed.');
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  const activeWalletInfo = WALLETS.find((w) => w.id === selectedWallet);

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
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <p className="text-gray-400 text-sm">Choose a Stellar wallet to connect:</p>
              {WALLETS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => connectWallet(w.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-[#4D21FF] hover:bg-[#4D21FF]/10 transition-colors text-left"
                >
                  <span className="text-2xl">{w.logo}</span>
                  <div>
                    <p className="text-white font-medium text-sm">{w.name}</p>
                    <p className="text-gray-500 text-xs">{w.description}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {status === 'pending' && (
            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 text-gray-300 text-sm">
              <div className="w-5 h-5 border-2 border-[#4D21FF] border-t-transparent rounded-full animate-spin flex-shrink-0" />
              Waiting for {activeWalletInfo?.name ?? 'wallet'} approval…
            </motion.div>
          )}

          {status === 'success' && wallet && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <p className="text-green-400 text-sm font-semibold">✓ {wallet.walletType} connected</p>
              <p className="text-gray-400 text-xs break-all">
                <span className="text-gray-300 font-medium">Address: </span>{wallet.address}
              </p>
              <p className="text-gray-400 text-xs">
                <span className="text-gray-300 font-medium">Network: </span>{wallet.network}
              </p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.p key="error" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400 text-sm">
              {errorMsg || 'Connection failed. Please try again.'}
            </motion.p>
          )}

          {status === 'not_installed' && (
            <motion.div key="not_installed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <p className="text-yellow-400 text-sm">{activeWalletInfo?.name} wallet not detected.</p>
              {activeWalletInfo && (
                <a href={activeWalletInfo.installUrl} target="_blank" rel="noopener noreferrer" className="text-[#6B8CFF] text-sm underline">
                  Install {activeWalletInfo.name} →
                </a>
              )}
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

          {(status === 'error' || status === 'not_installed') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatus('idle')}
              className="flex-1 py-3 bg-linear-to-r from-[#6B8CFF] to-[#5AB9EA] text-white rounded-xl"
            >
              Try Another
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
