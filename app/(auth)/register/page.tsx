"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Trophy, ArrowLeft } from "lucide-react";
import { useAppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";
import { useRegisterMutation } from "@/store/api/authApi";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password, firstName, lastName }).unwrap();
      // DON'T login — redirect to check email page
      toast.success("Account created! Check your email to verify.");
      router.push(`/check-email?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 relative noise-bg">
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-brand-500/[0.06] rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-rose-500/[0.04] rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="glass rounded-3xl border border-white/[0.08] overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center"><Trophy className="w-6 h-6 text-dark-950" /></div>
            </Link>
            <h1 className="font-display font-bold text-3xl text-white mb-2">Create Account</h1>
            <p className="text-dark-400 text-sm">Join thousands of golfers making a difference</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-dark-400 mb-2 font-medium">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                  className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all" placeholder="John" />
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-2 font-medium">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required
                  className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-dark-400 mb-2 font-medium">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-xs text-dark-400 mb-2 font-medium">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                  className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all pr-12" placeholder="Min 8 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-primary flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>

            <p className="text-center text-dark-500 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">Log in</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}