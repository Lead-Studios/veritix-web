'use client';

import { useState } from 'react';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { motion } from 'framer-motion';

export function WalletButton() {
  const { publicKey, isConnected, connect, disconnect } = useStellarWallet();
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(true);

  const handleConnect = async () => {
    if (typeof window.freighter === 'undefined') {
      setIsFreighterInstalled(false);
      return;
    }
    await connect();
  };

  const truncatedKey = publicKey
    ? `${publicKey.substring(0, 4)}...${publicKey.substring(publicKey.length - 4)}`
    : '';

  if (!isConnected) {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConnect}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Connect Wallet
        </motion.button>
        {!isFreighterInstalled && (
          <div className="absolute top-full mt-2 w-48 p-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
            <p>
              Freighter not installed.
              <a
                href="https://www.freighter.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Install Freighter
              </a>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <button className="px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-lg">
        {truncatedKey}
      </button>
      <div className="absolute top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => navigator.clipboard.writeText(publicKey || '')}
          className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
        >
          Copy Address
        </button>
        <button
          onClick={disconnect}
          className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}