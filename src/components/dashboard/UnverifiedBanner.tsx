'use client';

import { useState } from 'react';
import { HiExclamation, HiX } from 'react-icons/hi';

export default function UnverifiedBanner({ isVerified }: { isVerified: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isVerified || dismissed) return null;

  const handleResend = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/resend-verification', { method: 'POST' });
      setSent(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between text-amber-200 text-sm">
      <div className="flex items-center gap-3">
        <HiExclamation className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          {sent
            ? 'Verification email sent! Please check your inbox.'
            : 'Your account email is unverified. Please verify your email to unlock all feature access.'}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {!sent && (
          <button
            onClick={handleResend}
            disabled={loading}
            className="px-3 py-1 text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400 rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Resend Email'}
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <HiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
