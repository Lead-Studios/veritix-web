'use client';

import { motion } from 'framer-motion';
import { HiOutlineTicket } from 'react-icons/hi';

export default function AuthLoadingShell() {
  return (
    <div className="min-h-screen bg-[#101428] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-flex items-center justify-center w-16 h-16"
        >
          <HiOutlineTicket className="w-12 h-12 text-[#6B8CFF]" />
        </motion.div>
        
        <div className="space-y-2">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-32 bg-[#6B8CFF]/20 rounded-full overflow-hidden mx-auto"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="h-full w-1/2 bg-gradient-to-r from-[#6B8CFF] to-[#5AB9EA]"
            />
          </motion.div>
          <p className="text-gray-400 text-sm">Verifying your session...</p>
        </div>
      </motion.div>
    </div>
  );
}
