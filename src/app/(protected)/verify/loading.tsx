export default function VerifyLoading() {
  return (
    <div className="min-h-screen bg-primary-dark-blue">
      <section className="relative overflow-hidden">
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="h-6 w-24 animate-pulse rounded bg-white/10 mb-6" />
          <div className="flex items-center gap-4">
            <div className="h-13 w-13 animate-pulse rounded-2xl bg-white/10" />
            <div className="space-y-2">
              <div className="h-8 w-64 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Scan frame skeleton */}
          <div className="rounded-2xl bg-[#00062580]/50 border border-[#E0E0E033]/20 overflow-hidden">
            <div className="bg-[#4D21FF] px-6 py-4">
              <div className="h-5 w-32 animate-pulse rounded bg-white/20" />
            </div>
            <div className="p-8 flex items-center justify-center">
              <div className="w-56 h-56 animate-pulse rounded-xl bg-white/5" />
            </div>
          </div>

          {/* Manual entry skeleton */}
          <div className="rounded-2xl bg-[#00062580]/50 border border-[#E0E0E033]/20 overflow-hidden">
            <div className="bg-[#4D21FF] px-6 py-4">
              <div className="h-5 w-28 animate-pulse rounded bg-white/20" />
            </div>
            <div className="p-6 space-y-4">
              <div className="h-12 w-full animate-pulse rounded-xl bg-white/5" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-white/10" />
            </div>
          </div>

          {/* Stats bar skeleton */}
          <div className="grid grid-cols-3 gap-3">
            {['Checked In', 'Capacity', 'Remaining'].map((label) => (
              <div
                key={label}
                className="rounded-xl bg-[#00062580]/50 border border-[#E0E0E033]/20 p-4 text-center"
              >
                <div className="h-7 w-16 mx-auto rounded animate-pulse bg-white/10" />
                <p className="text-gray-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
