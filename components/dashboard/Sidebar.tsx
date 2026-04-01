"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Trophy, LayoutDashboard, BarChart3, Ticket, Heart, Gift, 
  CreditCard, Bell, Settings, LogOut, ChevronLeft, ChevronRight, Menu, X, 
  SubscriptIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Scores", href: "/dashboard/scores", icon: BarChart3 },
  { name: "Draws", href: "/dashboard/draws", icon: Ticket },
  { name: "Charities", href: "/dashboard/charities", icon: Heart },
  { name: "Winnings", href: "/dashboard/winnings", icon: Gift },
  { name: "Donations", href: "/dashboard/donations", icon: CreditCard },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell }, // Wait, Bell imported as Notifications? Fixing to Bell below.
  { name: "Subscription", href: "/dashboard/subscribe", icon: SubscriptIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const cleanNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Scores", href: "/dashboard/scores", icon: BarChart3 },
  { name: "Draws", href: "/dashboard/draws", icon: Ticket },
  { name: "Charities", href: "/dashboard/charities", icon: Heart },
  { name: "Winnings", href: "/dashboard/winnings", icon: Gift },
  { name: "Donations", href: "/dashboard/donations", icon: CreditCard },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Subscription", href: "/dashboard/subscribe", icon: SubscriptIcon }, // Add this line
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  
  // Desktop collapse state
  const [collapsed, setCollapsed] = useState(false);
  // Mobile open state
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Hamburger Toggle Button (Visible only on mobile when sidebar is closed) */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-dark-900/80 backdrop-blur-md border border-white/[0.06] text-white hover:bg-white/[0.04] transition-colors"
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

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-dark-900/95 md:bg-dark-900/50 backdrop-blur-xl border-r border-white/[0.06] z-50 transition-all duration-300 flex flex-col
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} 
          md:translate-x-0
          ${collapsed ? "md:w-20" : "md:w-64"}
          w-64
        `}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 text-dark-950" />
            </div>
            {/* Always show text on mobile, conditionally on desktop */}
            <span className={`font-display font-bold text-lg ${collapsed ? 'md:hidden' : 'block'}`}>
              Golf<span className="text-brand-400">Charity</span>
            </span>
          </div>
          
          {/* Mobile Close Button */}
          <button 
            onClick={() => setMobileOpen(false)} 
            className="md:hidden p-2 text-dark-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {cleanNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group 
                  ${isActive ? "bg-brand-500/10 text-brand-400 border border-brand-500/20" : "text-dark-400 hover:text-white hover:bg-white/[0.04]"}`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-brand-400" : "text-dark-500 group-hover:text-white"}`} />
                {/* Always show text on mobile, conditionally on desktop */}
                <span className={collapsed ? 'md:hidden' : 'block'}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/[0.06]">
          {user && (
            <div className={`px-3 py-2 mb-3 ${collapsed ? 'md:hidden' : 'block'}`}>
              <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-dark-500 truncate">{user.email}</p>
            </div>
          )}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full justify-center md:justify-start"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={collapsed ? 'md:hidden' : 'block'}>Log Out</span>
          </button>
        </div>

        {/* Desktop Collapse Toggle (Hidden on mobile) */}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-800 border border-white/10 items-center justify-center text-dark-400 hover:text-white transition-colors cursor-pointer z-50 hover:scale-110 shadow-lg"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  );
}