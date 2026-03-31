"use client";

import { motion } from "framer-motion";
import { CreditCard, Loader2, Heart } from "lucide-react";
import { useGetMyDonationsQuery } from "@/store/api/extrasApi";

export default function DonationsPage() {
  const { data, isLoading } = useGetMyDonationsQuery();
  const donations = data?.data?.donations || [];
  const totalDonated = data?.data?.totalDonatedCents || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl text-white mb-2">My Donations</h1>
        <p className="text-dark-400 mb-8">Every subscription payment makes a difference. See your impact below.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl border border-rose-500/20 p-8 mb-8 text-center">
        <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <p className="text-dark-400 text-sm mb-2">Total Donated</p>
        <p className="font-display font-bold text-5xl bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-pink-300">£{(totalDonated / 100).toFixed(2)}</p>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-400" /></div>
      ) : donations.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl border border-white/[0.06]">
          <CreditCard className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">No donations recorded yet.</p>
          <p className="text-dark-500 text-sm mt-2">Subscribe and select a charity to start giving.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider">Charity</th>
                <th className="text-left text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider">Amount</th>
                <th className="text-left text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider">Type</th>
                <th className="text-left text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d: any) => (
                <tr key={d.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm text-white">{d.charity?.name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-rose-400">£{(d.amountInCents / 100).toFixed(2)}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-md ${d.isIndependent ? "bg-blue-500/10 text-blue-400" : "bg-brand-500/10 text-brand-400"}`}>{d.isIndependent ? "Direct" : "Subscription"}</span></td>
                  <td className="px-6 py-4 text-sm text-dark-400">{new Date(d.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}