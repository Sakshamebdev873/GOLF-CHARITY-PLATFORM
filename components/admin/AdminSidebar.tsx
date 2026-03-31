"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Trophy, LayoutDashboard, Users, Ticket, Heart, Gift, 
  BarChart3, Settings, LogOut, Shield, Menu, X 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { logout } from "@/store/slices/authSlice";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Draws", href: "/admin/draws", icon: Ticket },
  { name: "Charities", href: "/admin/charities", icon: Heart },
  { name: "Winners", href: "/admin/winners", icon: Gift },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Config", href: "/admin/config", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  
  // Mobile open state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-close mobile sidebar when navigating to a new route
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Hamburger Toggle Button */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-dark-900/80 backdrop-blur-md border border-white/[0.06] text-white hover:bg-white/[0.04] transition-colors"
        aria-label="Open Admin Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed left-0 top-0 h-screen w-64 bg-dark-900/95 md:bg-dark-900/50 backdrop-blur-xl border-r border-white/[0.06] z-50 flex flex-col transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        {/* Header / Logo */}
        <div className="p-6 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white block leading-tight">Admin</span>
              <span className="text-dark-500 text-xs">Control Panel</span>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          <button 
            onClick={() => setMobileOpen(false)} 
            className="md:hidden p-2 text-dark-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
            aria-label="Close Admin Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group 
                  ${isActive ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-dark-400 hover:text-white hover:bg-white/[0.04]"}`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-red-400" : "text-dark-500 group-hover:text-white"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-white/[0.06]">
          {user && (
            <div className="px-3 py-2 mb-3">
              <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-dark-500 truncate">{user.email}</p>
            </div>
          )}
          
          
          <button 
            onClick={() => { dispatch(logout()); router.push("/"); }} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full text-left"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" /> 
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}