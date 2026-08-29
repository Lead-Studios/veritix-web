'use client';

export type VerifyState =
  'verified' | 'pending' | 'expired' | 'invalid' | 'duplicate' | 'cancelled' | 'scanned';

type ResultCardProps = {
  state: VerifyState;
  title?: string;
  description?: string;
};

const VARIANT_STYLES: Record<VerifyState, string> = {
  verified: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
  pending: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
  expired: 'border-slate-400/30 bg-slate-500/10 text-slate-300',
  invalid: 'border-rose-400/30 bg-rose-500/10 text-rose-300',
  duplicate: 'border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-300',
  cancelled: 'border-orange-400/30 bg-orange-500/10 text-orange-300',
  scanned: 'border-sky-400/30 bg-sky-500/10 text-sky-300',
};

const VARIANT_LABELS: Record<VerifyState, string> = {
  verified: 'Verified',
  pending: 'Pending',
  expired: 'Expired',
  invalid: 'Invalid',
  duplicate: 'Duplicate',
  cancelled: 'Cancelled',
  scanned: 'Scanned',
};

export default function ResultCard({ state, title, description }: ResultCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${VARIANT_STYLES[state]}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title ?? VARIANT_LABELS[state]}</p>
          <p className="mt-1 text-sm opacity-80">
            {description ??
              `The ticket is currently ${VARIANT_LABELS[state].toLowerCase()}.`}
          </p>
        </div>
        <span className="rounded-full border border-current/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide">
          {VARIANT_LABELS[state]}
        </span>
      </div>
    </div>
  );
}
