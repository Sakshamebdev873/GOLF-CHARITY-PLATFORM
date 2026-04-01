"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Trophy } from "lucide-react";
import { useVerifyEmailMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = searchParams.get("token");
  const [verifyEmail] = useVerifyEmailMutation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); setErrorMsg("No verification token found"); return; }

    verifyEmail({ token })
      .unwrap()
      .then((result) => {
        setStatus("success");
        // Auto-login after verification
        dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
        // Redirect to onboarding after 3 seconds
        setTimeout(() => router.push("/dashboard/onboarding"), 3000);
      })
      .catch((err) => {
        setStatus("error");
        setErrorMsg(err?.data?.message || "Verification failed");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 noise-bg">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-500/[0.05] rounded-full blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-brand-400 mx-auto mb-6" />
            <h1 className="font-display font-bold text-2xl text-white mb-2">Verifying Your Email...</h1>
            <p className="text-dark-400">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-3xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-brand-400" />
            </motion.div>
            <h1 className="font-display font-bold text-3xl text-white mb-3">Email Verified! 🎉</h1>
            <p className="text-dark-400 mb-6">Your account is now active. Redirecting you to choose a charity...</p>
            <div className="flex items-center justify-center gap-2 text-brand-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting to dashboard...</span>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-10 h-10 text-red-400" />
            </motion.div>
            <h1 className="font-display font-bold text-3xl text-white mb-3">Verification Failed</h1>
            <p className="text-dark-400 mb-6">{errorMsg}</p>
            <div className="flex flex-col gap-3 items-center">
              <Link href="/login" className="btn-primary inline-block">Go to Login</Link>
              <Link href="/register" className="text-dark-500 text-sm hover:text-white transition-colors">Create New Account</Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}