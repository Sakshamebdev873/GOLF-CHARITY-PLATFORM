export default function AdminLoading() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse">
      <div className="mb-10">
        <div className="h-8 w-56 bg-white/[0.06] rounded-xl mb-3" />
        <div className="h-4 w-72 bg-white/[0.04] rounded-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass rounded-2xl border border-white/[0.06] p-5">
            <div className="w-10 h-10 bg-white/[0.06] rounded-xl mb-3" />
            <div className="h-7 w-20 bg-white/[0.06] rounded-lg mb-2" />
            <div className="h-3 w-28 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="glass rounded-2xl border border-white/[0.06] p-6">
            <div className="h-5 w-32 bg-white/[0.06] rounded-lg mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl">
                  <div className="space-y-2"><div className="h-4 w-32 bg-white/[0.06] rounded" /><div className="h-3 w-48 bg-white/[0.04] rounded" /></div>
                  <div className="h-4 w-16 bg-white/[0.04] rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}