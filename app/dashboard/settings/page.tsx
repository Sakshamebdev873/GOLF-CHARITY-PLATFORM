"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, User, CreditCard, AlertTriangle } from "lucide-react";
import { useGetProfileQuery } from "@/store/api/authApi";
import { useGetMySubscriptionQuery, useCancelSubscriptionMutation } from "@/store/api/subscriptionApi";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: profile, isLoading } = useGetProfileQuery();
  const { data: subData } = useGetMySubscriptionQuery();
  const [cancelSub, { isLoading: cancelling }] = useCancelSubscriptionMutation();
  const [showCancel, setShowCancel] = useState(false);

  const user = profile?.data;
  const sub = subData?.data;

  const handleCancel = async () => {
    try {
      await cancelSub().unwrap();
      toast.success("Subscription cancelled");
      setShowCancel(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel");
    }
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-400" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl text-white mb-2">Settings</h1>
        <p className="text-dark-400 mb-8">Manage your profile and subscription.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl border border-white/[0.06] p-6 mb-6">
        <div className="flex items-center gap-3 mb-6"><User className="w-5 h-5 text-brand-400" /><h2 className="font-display font-semibold text-lg text-white">Profile</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-xs text-dark-400 mb-1.5 font-medium">First Name</label><div className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white">{user?.firstName}</div></div>
          <div><label className="block text-xs text-dark-400 mb-1.5 font-medium">Last Name</label><div className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white">{user?.lastName}</div></div>
          <div className="md:col-span-2"><label className="block text-xs text-dark-400 mb-1.5 font-medium">Email</label><div className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white">{user?.email}</div></div>
          <div><label className="block text-xs text-dark-400 mb-1.5 font-medium">Role</label><div className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white capitalize">{user?.role?.toLowerCase()}</div></div>
          <div><label className="block text-xs text-dark-400 mb-1.5 font-medium">Member Since</label><div className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB") : "—"}</div></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl border border-white/[0.06] p-6">
        <div className="flex items-center gap-3 mb-6"><CreditCard className="w-5 h-5 text-brand-400" /><h2 className="font-display font-semibold text-lg text-white">Subscription</h2></div>
        {sub ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/[0.03] rounded-xl p-4"><p className="text-dark-400 text-xs mb-1">Plan</p><p className="font-semibold text-white">{sub.plan}</p></div>
              <div className="bg-white/[0.03] rounded-xl p-4"><p className="text-dark-400 text-xs mb-1">Status</p><p className={`font-semibold ${sub.status === "ACTIVE" ? "text-brand-400" : "text-red-400"}`}>{sub.status}</p></div>
              <div className="bg-white/[0.03] rounded-xl p-4"><p className="text-dark-400 text-xs mb-1">Charity %</p><p className="font-semibold text-white">{sub.charityPercentage}%</p></div>
              <div className="bg-white/[0.03] rounded-xl p-4"><p className="text-dark-400 text-xs mb-1">Renews</p><p className="font-semibold text-white">{new Date(sub.currentPeriodEnd).toLocaleDateString("en-GB")}</p></div>
            </div>
            {sub.status === "ACTIVE" && (
              <div className="pt-4 border-t border-white/[0.06]">
                {showCancel ? (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-red-400" /><p className="text-sm text-red-400 font-medium">Are you sure?</p></div>
                    <p className="text-dark-400 text-sm mb-4">Your subscription will remain active until the end of the billing period but won&apos;t renew.</p>
                    <div className="flex gap-3">
                      <button onClick={handleCancel} disabled={cancelling} className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-400 transition-colors disabled:opacity-50">
                        {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Cancel"}
                      </button>
                      <button onClick={() => setShowCancel(false)} className="px-4 py-2 text-dark-400 text-sm hover:text-white transition-colors">Keep Subscription</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowCancel(true)} className="text-red-400 text-sm hover:text-red-300 transition-colors">Cancel Subscription</button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-dark-400 mb-3">No active subscription.</p>
            <a href="/#pricing" className="btn-primary inline-block text-sm">Subscribe Now</a>
          </div>
        )}
      </motion.div>
    </div>
  );
}