export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/[0.06] rounded-xl ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl border border-white/[0.06] p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass rounded-2xl border border-white/[0.06] p-6 space-y-3">
      <Skeleton className="h-4 w-1/4 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl border border-white/[0.06] p-5 space-y-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}