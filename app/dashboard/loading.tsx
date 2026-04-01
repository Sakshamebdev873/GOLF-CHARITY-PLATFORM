export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="h-8 w-64 bg-white/[0.06] rounded-xl mb-3" />
        <div className="h-4 w-96 bg-white/[0.04] rounded-lg" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-2xl border border-white/[0.06] p-5">
            <div className="w-10 h-10 bg-white/[0.06] rounded-xl mb-4" />
            <div className="h-7 w-20 bg-white/[0.06] rounded-lg mb-2" />
            <div className="h-3 w-28 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="glass rounded-2xl border border-white/[0.06] p-6">
        <div className="h-5 w-40 bg-white/[0.06] rounded-lg mb-6" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl">
              <div className="w-8 h-8 bg-white/[0.06] rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-white/[0.06] rounded" />
                <div className="h-3 w-1/2 bg-white/[0.04] rounded" />
              </div>
              <div className="w-16 h-4 bg-white/[0.04] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}