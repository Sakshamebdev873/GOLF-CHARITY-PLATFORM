export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-pulse">
        <div className="w-12 h-12 bg-white/[0.06] rounded-2xl mx-auto mb-6" />
        <div className="h-8 w-48 bg-white/[0.06] rounded-xl mx-auto mb-3" />
        <div className="h-4 w-64 bg-white/[0.04] rounded-lg mx-auto mb-8" />
        <div className="glass rounded-3xl border border-white/[0.06] p-8 space-y-5">
          <div className="h-12 bg-white/[0.04] rounded-xl" />
          <div className="h-12 bg-white/[0.04] rounded-xl" />
          <div className="h-12 bg-white/[0.06] rounded-xl" />
        </div>
      </div>
    </div>
  );
}