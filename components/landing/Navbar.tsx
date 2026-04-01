"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Trophy, LogOut, LayoutDashboard } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { toggleMobileMenu, closeMobileMenu } from "@/store/slices/uiSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "How It Works", href: "#how-it-works" },
  { name: "Charities", href: "#charities" },
  { name: "Prizes", href: "#prizes" },
  { name: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { mobileMenuOpen } = useAppSelector((s) => s.ui);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? "bg-dark-950/90 backdrop-blur-2xl border-b border-white/[0.06] py-3 shadow-lg"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between relative">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-50" onClick={() => dispatch(closeMobileMenu())}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-500 flex items-center justify-center group-hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-300">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-dark-950" />
            </div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white">
              Golf<span className="text-brand-400">Charity</span>
            </span>
          </Link>

          {/* Desktop Nav (Perfectly Centered) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-dark-300 hover:text-white text-sm font-medium transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop CTA / User Controls */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm font-medium text-white hover:bg-white/[0.08] transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="flex items-center gap-2 p-2.5 rounded-xl text-dark-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  aria-label="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-dark-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-brand-500 text-dark-950 text-sm font-semibold rounded-xl hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="md:hidden relative z-50 p-2 text-dark-300 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-dark-950/98 backdrop-blur-3xl h-[100dvh] pt-24 px-6 md:hidden flex flex-col"
          >
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-6">
              {/* Mobile Links */}
              <div className="flex flex-col gap-4 mt-4">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => dispatch(closeMobileMenu())}
                    className="text-2xl font-display font-semibold text-dark-200 hover:text-brand-400 hover:pl-2 transition-all duration-200"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              {/* Mobile Auth/Dashboard Actions */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-auto pt-6 border-t border-white/[0.06] flex flex-col gap-3 pb-8"
              >
                {isAuthenticated ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="w-full py-3.5 bg-brand-500 text-dark-950 text-base font-semibold rounded-xl text-center hover:bg-brand-400 transition-all" 
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Go to Dashboard
                    </Link>
                    <button 
                      onClick={() => { dispatch(logout()); dispatch(closeMobileMenu()); }} 
                      className="w-full py-3.5 bg-white/[0.04] border border-white/[0.06] text-white text-base font-medium rounded-xl text-center hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => { router.push('/login'); dispatch(closeMobileMenu()); }} 
                      className="w-full py-3.5 bg-white/[0.04] border border-white/[0.06] text-white text-base font-medium rounded-xl text-center hover:bg-white/[0.08] transition-all"
                    >
                      Log In
                    </button>
                    <button 
                      onClick={() => { router.push('/register'); dispatch(closeMobileMenu()); }} 
                      className="w-full py-3.5 bg-brand-500 text-dark-950 text-base font-semibold rounded-xl text-center hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}