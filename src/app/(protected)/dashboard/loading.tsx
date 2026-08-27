export default function DashboardLoading() {
  return (
    <div className="dark min-h-screen bg-surface-dark">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-center">
            <div className="h-8 w-48 animate-pulse rounded-full bg-white/10" />
          </div>
          <div className="text-center space-y-2">
            <div className="h-10 w-96 mx-auto animate-pulse rounded-lg bg-white/10" />
            <div className="h-5 w-64 mx-auto animate-pulse rounded bg-white/5" />
          </div>

          {/* Cards grid skeleton */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="h-24 animate-pulse rounded-xl bg-white/5" />
                <div className="h-48 animate-pulse rounded-xl bg-white/5" />
                <div className="h-20 animate-pulse rounded-xl bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
