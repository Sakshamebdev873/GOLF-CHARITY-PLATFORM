"use client";

import { useGetMySubscriptionQuery } from "@/store/api/subscriptionApi";
import { CreditCard, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useGetMySubscriptionQuery();
  const isActive = data?.data?.status === "ACTIVE";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
      </div>
    );
  }

  if (!isActive) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-3xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-dark-500" />
        </div>
        <h2 className="font-display font-bold text-2xl text-white mb-3">Subscription Required</h2>
        <p className="text-dark-400 mb-2">This feature requires an active subscription.</p>
        <p className="text-dark-500 text-sm mb-8">Subscribe to enter scores, join draws, and win prizes.</p>

        <Link href="/dashboard/subscribe" className="btn-primary inline-flex items-center gap-2 text-base">
          <CreditCard className="w-5 h-5" />
          Subscribe — ₹199/mo
        </Link>

        <p className="text-dark-600 text-xs mt-4">Cancel anytime. 10%+ goes to charity.</p>
      </motion.div>
    );
  }

  return <>{children}</>;
}