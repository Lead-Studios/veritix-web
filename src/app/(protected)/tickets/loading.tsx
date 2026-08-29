export default function TicketsLoading() {
  return (
    <div className="dark min-h-screen bg-[#101428]">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-white/10" />
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3"
              >
                <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/5" />
                <div className="h-32 animate-pulse rounded-lg bg-white/5" />
                <div className="flex gap-2">
                  <div className="h-8 w-20 animate-pulse rounded-full bg-white/10" />
                  <div className="h-8 w-20 animate-pulse rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
