import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 noise-bg">
      <div className="text-center relative z-10">
        <p className="font-display font-bold text-[8rem] leading-none text-dark-800 mb-4">404</p>
        <h1 className="font-display font-bold text-3xl text-white mb-3">Page Not Found</h1>
        <p className="text-dark-400 mb-8 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="btn-primary">Back to Home</Link>
          <Link href="/dashboard" className="btn-secondary">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}