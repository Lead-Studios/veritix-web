export default function EventDetailLoading() {
  return (
    <div className="min-h-screen bg-[#0b1025]">
      {/* Hero skeleton */}
      <div className="relative h-64 w-full animate-pulse bg-white/5 sm:h-80 lg:h-96" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 -mt-16 relative">
        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-white/10" />
          <div className="flex gap-4">
            <div className="h-5 w-32 animate-pulse rounded bg-white/5" />
            <div className="h-5 w-40 animate-pulse rounded bg-white/5" />
          </div>
          <div className="h-5 w-48 animate-pulse rounded bg-white/5" />
        </div>

        {/* Ticket selector skeleton */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="h-6 w-36 animate-pulse rounded bg-white/10" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl border border-white/10"
            >
              <div className="space-y-2">
                <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-20 animate-pulse rounded bg-white/5" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
                <div className="h-5 w-8 animate-pulse rounded bg-white/10" />
                <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
          ))}
          <div className="h-12 w-full animate-pulse rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}
