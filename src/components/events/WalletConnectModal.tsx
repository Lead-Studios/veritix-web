'use client';

import { motion } from 'framer-motion';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-primary-dark-blue rounded-2xl border border-[#E0E0E033]/20 p-6 max-w-md w-full mx-4 h-80 flex flex-col justify-center"
      >
        <h3 className="text-xl font-bold text-white mb-4">Connect Wallet</h3>
        <p className="text-gray-400 mb-6">Please connect your wallet to purchase tickets.</p>
        <div className="flex gap-4 mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 py-3 bg-gray-600 text-white rounded-xl"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 py-3 bg-linear-to-r from-[#6B8CFF] to-[#5AB9EA] text-white rounded-xl"
          >
            Connect
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}