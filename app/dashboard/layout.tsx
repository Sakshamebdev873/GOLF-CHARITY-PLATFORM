"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/store";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-dark-950">
      <Sidebar />
      {/* Responsive margin: 0 on mobile, 64 (16rem) on desktop.
        Added transition-all so if you lift the collapse state later, it animates smoothly.
      */}
      <main className="min-h-screen transition-all duration-300 md:ml-64">
        {/* Responsive padding: smaller padding and extra top space on mobile for the hamburger button */}
        <div className="p-4 pt-20 md:p-8 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}