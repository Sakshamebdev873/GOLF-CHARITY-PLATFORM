"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useResendVerificationMutation } from "@/store/api/authApi";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [resend, { isLoading }] = useResendVerificationMutation();
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) { toast.error("No email found"); return; }
    try {
      await resend({ email }).unwrap();
      toast.success("Verification email sent!");
      setResent(true);
      setTimeout(() => setResent(false), 60000); // Cooldown 60s
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend");
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 relative noise-bg">
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-brand-500/[0.05] rounded-full blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10 text-center">
        {/* Animated Mail Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 rounded-3xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-8"
        >
          <Mail className="w-12 h-12 text-brand-400" />
        </motion.div>

        <h1 className="font-display font-bold text-3xl text-white mb-3">Check Your Email</h1>

        <p className="text-dark-400 text-base mb-2">
          We've sent a verification link to
        </p>
        <p className="text-white font-semibold text-lg mb-8">{email || "your email"}</p>

        <div className="glass rounded-2xl border border-white/[0.06] p-6 mb-8 text-left">
          <p className="text-dark-300 text-sm leading-relaxed">
            Click the link in the email to verify your account and get started. The link expires in <span className="text-brand-400 font-medium">24 hours</span>.
          </p>
          <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-2">
            <p className="text-dark-500 text-xs">Can't find it? Check your spam/junk folder.</p>
          </div>
        </div>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={isLoading || resent}
          className="btn-secondary flex items-center gap-2 mx-auto disabled:opacity-40"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {resent ? "Email Sent — Wait 60s" : "Resend Verification Email"}
        </button>

        <Link href="/login" className="inline-flex items-center gap-2 text-dark-500 hover:text-white text-sm mt-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </motion.div>
    </div>
  );
}