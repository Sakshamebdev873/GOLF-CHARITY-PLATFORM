"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/store";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
    else if (user?.role !== "ADMIN") router.push("/dashboard");
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen bg-dark-950">
      <AdminSidebar />
      {/* Responsive margin: md:ml-64 applies the 16rem margin only on desktop.
        On mobile, it defaults to ml-0 so content spans the full screen. 
      */}
      <main className="min-h-screen transition-all duration-300 md:ml-64">
        {/* Responsive padding: 
          - p-4 pt-20 on mobile: Smaller edges, big top gap for the hamburger menu.
          - md:p-8 md:pt-8 on desktop: Standard uniform padding.
        */}
        <div className="p-4 pt-20 md:p-8 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}