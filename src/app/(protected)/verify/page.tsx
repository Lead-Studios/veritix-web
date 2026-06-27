'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyStats } from '@/hooks/useVerifyStats';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiArrowLeft,
  HiCheck,
  HiX,
  HiTicket,
  HiRefresh,
  HiSearch,
} from 'react-icons/hi';
import QRScanner from '@/components/verification/QRScanner';
import { useVerifyStats } from '@/hooks/useVerifyStats';
import {
  getVerificationErrorMessage,
  type VerificationErrorType,
} from '@/lib/verificationErrors';
import { verifyTicket, type VerificationResult } from '@/features/verification/api';

type VerifyState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'failure'
  | 'already-used'
  | 'banned'
  | 'service-error'
  | 'network-error'
  | 'unknown-error';

const STATE_TO_ERROR_TYPE: Partial<Record<VerifyState, VerificationErrorType>> = {
  failure: 'invalid-ticket',
  'already-used': 'already-used',
  banned: 'banned',
  'service-error': 'service-failure',
  'network-error': 'network-error',
};

// ─── Scan Frame Animation ─────────────────────────────────────────────────────
function ScanFrame() {
  return (
    <div className="relative w-56 h-56 mx-auto">
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
        const isTop = corner.startsWith('top');
        const isLeft = corner.endsWith('left');
        return (
          <div
            key={corner}
            className={`absolute w-8 h-8 ${isTop ? 'top-0' : 'bottom-0'} ${
              isLeft ? 'left-0' : 'right-0'
            }`}
          >
            <div
              className={`absolute bg-[#4D21FF] ${isTop ? 'top-0' : 'bottom-0'} ${
                isLeft ? 'left-0' : 'right-0'
              } w-full h-0.5`}
            />
            <div
              className={`absolute bg-[#4D21FF] ${isTop ? 'top-0' : 'bottom-0'} ${
                isLeft ? 'left-0' : 'right-0'
              } w-0.5 h-full`}
            />
          </div>
        );
      })}

      <motion.div
        className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#21D4FF] to-transparent"
        animate={{ top: ['10%', '90%', '10%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

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
  ticketDetails,
  onReset,
  onRetry,
}: {
  state: VerifyState;
  ticketCode: string;
  ticketDetails: VerificationResult | null;
  onReset: () => void;
  onRetry?: () => void;
}) {
  const isSuccess = state === 'success';
  const isAlreadyUsed = state === 'already-used';
  const isBanned = state === 'banned';
  const isServiceError = state === 'service-error';
  const isNetworkError = state === 'network-error';

  const errorMessage = !isSuccess
    ? getVerificationErrorMessage(STATE_TO_ERROR_TYPE[state])
    : null;
  const showRetry = Boolean(errorMessage?.retryable && onRetry);

  const baseBorder = 'border-red-500/40 bg-red-900/20';
  const baseBg = 'bg-red-500';
  const icon = <HiX className="w-5 h-5 text-white" />;

  let borderColor, bgColor, statusIcon;

  if (isSuccess) {
    borderColor = 'border-emerald-500/40 bg-emerald-900/20';
    bgColor = 'bg-emerald-500';
    statusIcon = <HiCheck className="w-5 h-5 text-white" />;
  } else if (isAlreadyUsed) {
    borderColor = 'border-amber-500/40 bg-amber-900/20';
    bgColor = 'bg-amber-500';
    statusIcon = <HiRefresh className="w-5 h-5 text-white" />;
  } else if (isBanned) {
    borderColor = 'border-red-700/50 bg-red-950/40';
    bgColor = 'bg-red-800';
    statusIcon = (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
        />
      </svg>
    );
  } else if (isServiceError || isNetworkError) {
    borderColor = 'border-orange-500/40 bg-orange-900/20';
    bgColor = 'bg-orange-500';
    statusIcon = (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    );
  } else {
    borderColor = baseBorder;
    bgColor = baseBg;
    statusIcon = icon;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        role="status"
        aria-live="polite"
        data-state={state}
        className={`rounded-2xl border overflow-hidden ${borderColor}`}
      >
        {/* Status Banner */}
        <div className={`px-6 py-4 flex items-center gap-3 ${bgColor}`}>
          <div className="p-1 rounded-full bg-white/20">{statusIcon}</div>
          <span className="font-bold text-white text-lg">
            {isSuccess ? 'Valid Ticket \u2014 Entry Granted' : errorMessage?.title}
          </span>
        </div>

        {/* Ticket Details */}
        <div className="p-6 space-y-4">
          {isSuccess && ticketDetails ? (
            <div className="grid grid-cols-2 gap-4">
              {ticketDetails.holderName && (
                <Detail label="Holder" value={ticketDetails.holderName} />
              )}
              {ticketDetails.ticketType && (
                <Detail label="Ticket Type" value={ticketDetails.ticketType} />
              )}
              {ticketDetails.event && <Detail label="Event" value={ticketDetails.event} />}
              {ticketDetails.date && <Detail label="Date" value={ticketDetails.date} />}
              {ticketDetails.seat && (
                <Detail label="Zone / Seat" value={ticketDetails.seat} />
              )}
              <Detail label="Code" value={ticketCode.toUpperCase()} mono />
            </div>
          ) : (
            <div className="text-center py-4 space-y-2">
              <p className="text-gray-300 text-sm">{errorMessage?.description}</p>
              {isBanned && ticketDetails?.banReason && (
                <p className="text-red-300/80 text-xs italic">
                  Reason: {ticketDetails.banReason}
                </p>
              )}
              {!isServiceError && !isNetworkError && ticketCode && (
                <p className="text-gray-500 text-xs font-mono">
                  {ticketCode.toUpperCase()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          {showRetry ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetry}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] hover:opacity-90 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <HiRefresh className="w-4 h-4" />
              {errorMessage?.actionLabel ?? 'Retry verification'}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReset}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <HiRefresh className="w-4 h-4" />
              {isSuccess
                ? 'Verify Another Ticket'
                : errorMessage?.actionLabel ?? 'Verify another ticket'}
            </motion.button>
          )}
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
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const { stats, loading: statsLoading } = useVerifyStats(eventId);
  const [code, setCode] = useState('');
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');
  const [ticketDetails, setTicketDetails] = useState<VerificationResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const runVerify = async (ticketCode: string) => {
    setVerifyState('loading');
    setTicketDetails(null);

    try {
      const { ok, status, data } = await verifyTicket(ticketCode);

      if (!ok) {
        setVerifyState(status >= 500 ? 'service-error' : 'failure');
        return;
      }

      if (!data) {
        setVerifyState('service-error');
        return;
      }

      if (data.banned) {
        setTicketDetails(data);
        setVerifyState('banned');
        return;
      }

      switch (data.status) {
        case 'VALID':
          setTicketDetails(data);
          setVerifyState('success');
          break;
        case 'ALREADY_USED':
          setVerifyState('already-used');
          break;
        case 'INVALID':
        case 'CANCELLED':
          setVerifyState('failure');
          break;
        default:
          setVerifyState('failure');
      }
    } catch {
      // fetch() threw — network unreachable
      setVerifyState('network-error');
    }
  };

  const handleVerify = () => {
    if (!code.trim()) return;
    runVerify(code);
  };

  const handleReset = () => {
    setCode('');
    setVerifyState('idle');
    setTicketDetails(null);
    inputRef.current?.focus();
  };

  const handleRetry = () => runVerify(code);

  const isChecking = verifyState === 'loading';
  const hasResult = [
    'success',
    'failure',
    'already-used',
    'banned',
    'service-error',
    'network-error',
    'unknown-error',
  ].includes(verifyState);

  return (
    <div className="min-h-screen bg-primary-dark-blue">
      {/* Hero Header */}
      <section className="relative overflow-hidden">
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
              <p className="text-gray-400 text-sm mt-0.5">Staff Portal</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-2xl mx-auto space-y-6">

          <AnimatePresence>
            {!hasResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl bg-[#00062580]/50 border border-[#E0E0E033]/20 overflow-hidden"
              >
                <div className="bg-[#4D21FF] px-6 py-4">
                  <h2 className="text-base font-bold text-white">Scan QR Code</h2>
                  <p className="text-blue-200 text-xs mt-0.5">Use camera scanning or manual lookup</p>
                </div>
                <div className="p-8 space-y-4">
                  <QRScanner
                    mode={mode}
                    onModeChange={(nextMode) => {
                      setMode(nextMode);
                      setScannerError(null);
                    }}
                    onScan={handleScan}
                    onError={(message) => setScannerError(message)}
                  />
                  {scannerError && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-950/60 px-4 py-3 text-sm text-red-300">
                      {scannerError}
                    </div>
                  )}
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
                    autoFocus
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
              </div>
            </motion.div>
          )}

          {/* Result */}
          {hasResult && (
            <ResultCard
              state={verifyState}
              ticketCode={code}
              ticketDetails={ticketDetails}
              onReset={handleReset}
              onRetry={handleRetry}
            />
          )}

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-3"
          >
            {(() => {
              if (!eventId) {
                return (
                  ['Checked In', 'Capacity', 'Remaining'].map((label) => (
                    <div
                      key={label}
                      className="rounded-xl bg-[#00062580]/50 border border-[#E0E0E033]/20 p-4 text-center"
                      title="Select an event to see live stats"
                    >
                      <p className="text-xl font-bold text-gray-500">—</p>
                      <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                    </div>
                  ))
                );
              }

              if (statsLoading) {
                return (
                  ['Checked In', 'Capacity', 'Remaining'].map((label) => (
                    <div
                      key={label}
                      className="rounded-xl bg-[#00062580]/50 border border-[#E0E0E033]/20 p-4 text-center"
                    >
                      <div className="h-7 w-16 mx-auto rounded bg-white/10 animate-pulse" />
                      <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                    </div>
                  ))
                );
              }

              const statItems = [
                { label: 'Checked In', value: stats?.totalScanned?.toLocaleString() ?? '—', color: 'text-emerald-400' },
                { label: 'Capacity', value: stats?.capacity?.toLocaleString() ?? '—', color: 'text-[#21D4FF]' },
                { label: 'Remaining', value: stats?.remaining?.toLocaleString() ?? '—', color: 'text-gray-400' },
              ];

              return statItems.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-[#00062580]/50 border border-[#E0E0E033]/20 p-4 text-center"
                >
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                </div>
              ));
            })()}
          </motion.div>
        </div>
      </section>
    </div>
  );
}