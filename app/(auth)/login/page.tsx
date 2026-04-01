"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Trophy, ArrowLeft } from "lucide-react";
import { useAppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";
import { useLoginMutation } from "@/store/api/authApi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
      toast.success("Welcome back!");
      router.push(result.data.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (error: any) {
      // Handle unverified email
      if (error?.data?.message === "EMAIL_NOT_VERIFIED") {
        toast.error("Please verify your email first");
        router.push(`/check-email?email=${encodeURIComponent(email)}`);
        return;
      }
      toast.error(error?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 relative noise-bg">
      {/* Background Effects */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-500/[0.06] rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-accent-500/[0.04] rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="glass rounded-3xl border border-white/[0.08] overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-dark-950" />
              </div>
            </Link>
            <h1 className="font-display font-bold text-3xl text-white mb-2">Welcome Back</h1>
            <p className="text-dark-400 text-sm">Log in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            <div>
              <label className="block text-xs text-dark-400 mb-2 font-medium">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
                placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-xs text-dark-400 mb-2 font-medium">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4}
                  className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all pr-12"
                  placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-primary flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
            </button>

            <p className="text-center text-dark-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">Sign up</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}