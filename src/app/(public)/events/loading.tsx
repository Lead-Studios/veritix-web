export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-[#0b1025]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10 mb-8" />
        <div className="flex gap-3 mb-8">
          <div className="h-10 flex-1 animate-pulse rounded-full bg-white/5" />
          <div className="h-10 w-32 animate-pulse rounded-full bg-white/5" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-white/5" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-3"
            >
              <div className="flex justify-between">
                <div className="h-6 w-16 animate-pulse rounded-lg bg-white/10" />
                <div className="flex gap-3">
                  <div className="h-4 w-4 rounded bg-white/10" />
                  <div className="h-4 w-4 rounded bg-white/10" />
                </div>
              </div>
              <div className="h-44 animate-pulse rounded-2xl bg-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
