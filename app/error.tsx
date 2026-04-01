"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-display font-bold text-6xl text-dark-800 mb-4">Oops</p>
        <h1 className="font-display font-bold text-2xl text-white mb-3">Something Went Wrong</h1>
        <p className="text-dark-400 mb-8">{error.message || "An unexpected error occurred."}</p>
        <button onClick={reset} className="btn-primary">Try Again</button>
      </div>
    </div>
  );
}