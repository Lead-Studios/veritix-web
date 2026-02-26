'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiArrowLeft,
  HiQrcode,
  HiCheck,
  HiX,
  HiTicket,
  HiRefresh,
  HiSearch,
} from 'react-icons/hi';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const VALID_TICKETS: Record<string, {
  holderName: string;
  ticketType: string;
  event: string;
  date: string;
  seat?: string;
}> = {
  'TKT-2024-ALPHA-001': {
    holderName: 'Jordan Rivera',
    ticketType: 'VIP Pass',
    event: 'Summer Dance Festival',
    date: 'Aug 15, 2025',
    seat: 'VIP Zone A',
  },
  'TKT-2024-BETA-042': {
    holderName: 'Morgan Chen',
    ticketType: 'General Admission',
    event: 'Summer Dance Festival',
    date: 'Aug 15, 2025',
  },
  'TKT-2024-GAMMA-199': {
    holderName: 'Alex Morales',
    ticketType: 'Early Bird',
    event: 'Summer Dance Festival',
    date: 'Aug 15, 2025',
  },
};

type VerifyState = 'idle' | 'loading' | 'success' | 'failure' | 'already-used';

// ─── Scan Frame Animation ─────────────────────────────────────────────────────
function ScanFrame() {
  return (
    <div className="relative w-56 h-56 mx-auto">
      {/* Corner brackets */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
        const isTop = corner.startsWith('top');
        const isLeft = corner.endsWith('left');
        return (
          <div
            key={corner}
            className={`absolute w-8 h-8 ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'}`}
          >
            <div
              className={`absolute bg-[#4D21FF] ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} w-full h-0.5`}
            />
            <div
              className={`absolute bg-[#4D21FF] ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} w-0.5 h-full`}
            />
          </div>
        );
      })}

      {/* Scan line */}
      <motion.div
        className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#21D4FF] to-transparent"
        animate={{ top: ['10%', '90%', '10%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inner grid pattern (decorative) */}
      <div className="absolute inset-4 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 20px), repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 20px)',
          }}
        />
      </div>

      <HiQrcode className="absolute inset-0 m-auto w-20 h-20 text-white/10" />
    </div>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────
function ResultCard({
  state,
  ticketCode,
  onReset,
}: {
  state: VerifyState;
  ticketCode: string;
  onReset: () => void;
}) {
  const ticket = VALID_TICKETS[ticketCode.toUpperCase()];
  const isSuccess = state === 'success';
  const isAlreadyUsed = state === 'already-used';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`rounded-2xl border overflow-hidden ${
          isSuccess
            ? 'border-emerald-500/40 bg-emerald-900/20'
            : isAlreadyUsed
            ? 'border-amber-500/40 bg-amber-900/20'
            : 'border-red-500/40 bg-red-900/20'
        }`}
      >
        {/* Status Banner */}
        <div
          className={`px-6 py-4 flex items-center gap-3 ${
            isSuccess
              ? 'bg-emerald-500'
              : isAlreadyUsed
              ? 'bg-amber-500'
              : 'bg-red-500'
          }`}
        >
          <div className="p-1 rounded-full bg-white/20">
            {isSuccess ? (
              <HiCheck className="w-5 h-5 text-white" />
            ) : isAlreadyUsed ? (
              <HiRefresh className="w-5 h-5 text-white" />
            ) : (
              <HiX className="w-5 h-5 text-white" />
            )}
          </div>
          <span className="font-bold text-white text-lg">
            {isSuccess
              ? 'Valid Ticket — Entry Granted'
              : isAlreadyUsed
              ? 'Already Used'
              : 'Invalid Ticket'}
          </span>
        </div>

        {/* Ticket Details */}
        <div className="p-6 space-y-4">
          {isSuccess && ticket ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Detail label="Holder" value={ticket.holderName} />
                <Detail label="Ticket Type" value={ticket.ticketType} />
                <Detail label="Event" value={ticket.event} />
                <Detail label="Date" value={ticket.date} />
                {ticket.seat && <Detail label="Zone / Seat" value={ticket.seat} />}
                <Detail label="Code" value={ticketCode.toUpperCase()} mono />
              </div>
            </>
          ) : (
            <div className="text-center py-4 space-y-2">
              <p className="text-gray-300 text-sm">
                {isAlreadyUsed
                  ? 'This ticket has already been scanned. Please check with your supervisor.'
                  : 'No ticket found matching this code. Verify the code and try again.'}
              </p>
              <p className="text-gray-500 text-xs font-mono">{ticketCode.toUpperCase()}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <HiRefresh className="w-4 h-4" />
            Verify Another Ticket
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-white font-semibold text-sm ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');
  const [usedCodes] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const handleVerify = () => {
    if (!code.trim()) return;
    setVerifyState('loading');

    // Simulate async check
    setTimeout(() => {
      const upper = code.trim().toUpperCase();
      if (usedCodes.has(upper)) {
        setVerifyState('already-used');
      } else if (VALID_TICKETS[upper]) {
        usedCodes.add(upper);
        setVerifyState('success');
      } else {
        setVerifyState('failure');
      }
    }, 900);
  };

  const handleReset = () => {
    setCode('');
    setVerifyState('idle');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const isChecking = verifyState === 'loading';
  const hasResult = ['success', 'failure', 'already-used'].includes(verifyState);

  return (
    <div className="min-h-screen bg-primary-dark-blue">
      {/* Hero Header */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#4D21FF]/10 blur-3xl" />
          <div className="absolute -top-10 right-0 w-64 h-64 rounded-full bg-[#21D4FF]/10 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors mb-6"
          >
            <HiArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#4D21FF] to-[#21D4FF]">
              <HiTicket className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Ticket Verification</h1>
              <p className="text-gray-400 text-sm mt-0.5">Summer Dance Festival · Staff Portal</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Scanner Placeholder Card */}
          <AnimatePresence>
            {verifyState === 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl bg-[#00062580]/50 border border-[#E0E0E033]/20 overflow-hidden"
              >
                <div className="bg-[#4D21FF] px-6 py-4">
                  <h2 className="text-base font-bold text-white">Scan QR Code</h2>
                  <p className="text-blue-200 text-xs mt-0.5">Point camera at attendee's ticket QR</p>
                </div>
                <div className="p-8">
                  <ScanFrame />
                  <p className="text-center text-gray-500 text-xs mt-6">
                    Camera scanning not required — enter code manually below
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Manual Entry Card */}
          {!hasResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-[#00062580]/50 border border-[#E0E0E033]/20 overflow-hidden"
            >
              <div className="bg-[#4D21FF] px-6 py-4">
                <h2 className="text-base font-bold text-white">Manual Entry</h2>
                <p className="text-blue-200 text-xs mt-0.5">Type or paste the ticket code</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="relative">
                  <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    placeholder="e.g. TKT-2024-ALPHA-001"
                    disabled={isChecking}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-[#4D21FF] transition-colors disabled:opacity-50"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleVerify}
                  disabled={!code.trim() || isChecking}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] text-white font-bold hover:opacity-90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChecking ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Verifying…
                    </>
                  ) : (
                    <>
                      <HiCheck className="w-4 h-4" />
                      Verify Ticket
                    </>
                  )}
                </motion.button>

                {/* Test hints */}
                <div className="pt-2 border-t border-white/5">
                  <p className="text-gray-600 text-xs mb-2">Try these demo codes:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(VALID_TICKETS).map((k) => (
                      <button
                        key={k}
                        onClick={() => setCode(k)}
                        className="text-xs font-mono px-2 py-1 rounded-md bg-white/5 text-gray-400 hover:bg-[#4D21FF]/20 hover:text-white transition-colors"
                      >
                        {k}
                      </button>
                    ))}
                    <button
                      onClick={() => setCode('TKT-INVALID-000')}
                      className="text-xs font-mono px-2 py-1 rounded-md bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    >
                      TKT-INVALID-000
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Result */}
          {hasResult && (
            <ResultCard
              state={verifyState}
              ticketCode={code}
              onReset={handleReset}
            />
          )}

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { label: 'Checked In', value: '1,284', color: 'text-emerald-400' },
              { label: 'Capacity', value: '5,000', color: 'text-[#21D4FF]' },
              { label: 'Remaining', value: '3,716', color: 'text-gray-400' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-[#00062580]/50 border border-[#E0E0E033]/20 p-4 text-center"
              >
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}