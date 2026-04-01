"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2, Trophy } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { closeAuthModal, setAuthModalView } from "@/store/slices/uiSlice";
import { setCredentials } from "@/store/slices/authSlice";
import { useLoginMutation, useRegisterMutation } from "@/store/api/authApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authModalOpen, authModalView } = useAppSelector((s) => s.ui);
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const isLoading = loginLoading || registerLoading;

  const resetForm = () => { 
    setEmail(""); setPassword(""); setFirstName(""); setLastName(""); setShowPassword(false); 
  };
  
  const handleClose = () => { 
    dispatch(closeAuthModal()); 
    resetForm(); 
  };
  
  const switchView = (view: "login" | "register") => { 
    dispatch(setAuthModalView(view)); 
    resetForm(); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authModalView === "login") {
        const result = await login({ email, password }).unwrap();
        dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
        toast.success("Welcome back!");
        handleClose();
        router.push(result.data.user.role === "ADMIN" ? "/admin" : "/dashboard");
      } else {
        if (!firstName || !lastName) { toast.error("Please fill in all fields"); return; }
        await register({ email, password, firstName, lastName }).unwrap();
        toast.success("Check your email to verify your account!");
        handleClose();
        router.push(`/check-email?email=${encodeURIComponent(email)}`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={handleClose} 
            className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-xl" 
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            transition={{ type: "spring", stiffness: 300, damping: 30 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            {/* Modal Body */}
            <div className="w-full max-w-md glass rounded-2xl sm:rounded-3xl border border-white/[0.08] relative pointer-events-auto flex flex-col max-h-[100dvh] sm:max-h-[90vh]">
              
              <button 
                onClick={handleClose} 
                className="absolute top-4 right-4 sm:top-5 sm:right-5 text-dark-500 hover:text-white transition-colors z-10 p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Scrollable Content Wrapper */}
              <div className="overflow-y-auto custom-scrollbar flex-1">
                <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-6 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-500 flex items-center justify-center mx-auto mb-4 sm:mb-5">
                    <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-dark-950" />
                  </div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-2">
                    {authModalView === "login" ? "Welcome Back" : "Join the Platform"}
                  </h2>
                  <p className="text-dark-400 text-xs sm:text-sm">
                    {authModalView === "login" ? "Log in to access your dashboard" : "Create your account and start winning"}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4">
                  {authModalView === "register" && (
                    /* Stacks on mobile, side-by-side on sm+ */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                      <div>
                        <label className="block text-xs text-dark-400 mb-1.5 font-medium">First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all" placeholder="John" />
                      </div>
                      <div>
                        <label className="block text-xs text-dark-400 mb-1.5 font-medium">Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all" placeholder="Doe" />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs text-dark-400 mb-1.5 font-medium">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all" placeholder="you@example.com" />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-dark-400 mb-1.5 font-medium">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all pr-12" placeholder="Min 8 characters" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition-colors p-1">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <button type="submit" disabled={isLoading} className="w-full btn-primary flex items-center justify-center gap-2 !mt-6 disabled:opacity-50 disabled:cursor-not-allowed py-3.5">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : authModalView === "login" ? "Log In" : "Create Account"}
                  </button>
                  
                  <p className="text-center text-dark-500 text-xs sm:text-sm pt-2">
                    {authModalView === "login" ? (
                      <>Don&apos;t have an account? <button type="button" onClick={() => switchView("register")} className="text-brand-400 font-medium hover:text-brand-300 transition-colors">Sign up</button></>
                    ) : (
                      <>Already have an account? <button type="button" onClick={() => switchView("login")} className="text-brand-400 font-medium hover:text-brand-300 transition-colors">Log in</button></>
                    )}
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}