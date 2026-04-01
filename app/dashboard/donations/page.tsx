"use client";

import { motion } from "framer-motion";
import { CreditCard, Loader2, Heart } from "lucide-react";
import { useGetMyDonationsQuery } from "@/store/api/extrasApi";

export default function DonationsPage() {
  const { data, isLoading } = useGetMyDonationsQuery();
  const donations = data?.data?.donations || [];
  const totalDonated = data?.data?.totalDonatedCents || 0; // Stored in paise
  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1 sm:mb-2">My Donations</h1>
        <p className="text-dark-400 text-sm sm:text-base">Every subscription payment makes a difference. See your impact below.</p>
      </motion.div>

      {/* Total Impact Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl border border-rose-500/20 p-6 sm:p-8 mb-6 sm:mb-8 text-center"
      >
        <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-rose-400 mx-auto mb-3 sm:mb-4" />
        <p className="text-dark-400 text-xs sm:text-sm mb-1 sm:mb-2">Total Donated</p>
        <p className="font-display font-bold text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-pink-300">
          ₹{(totalDonated / 100).toFixed(2)}
        </p>
      </motion.div>

      {/* Donations List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-400" /></div>
      ) : donations.length === 0 ? (
        <div className="text-center py-12 sm:py-16 glass rounded-2xl border border-white/[0.06] p-6">
          <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 text-sm sm:text-base">No donations recorded yet.</p>
          <p className="text-dark-500 text-xs sm:text-sm mt-2">Subscribe and select a charity to start giving.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-xs text-dark-500 font-medium px-4 sm:px-6 py-4 uppercase tracking-wider whitespace-nowrap">Charity</th>
                  <th className="text-xs text-dark-500 font-medium px-4 sm:px-6 py-4 uppercase tracking-wider whitespace-nowrap">Amount</th>
                  <th className="text-xs text-dark-500 font-medium px-4 sm:px-6 py-4 uppercase tracking-wider whitespace-nowrap">Type</th>
                  <th className="text-xs text-dark-500 font-medium px-4 sm:px-6 py-4 uppercase tracking-wider whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d: any) => (
                  <tr key={d.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-sm text-white whitespace-nowrap">
                      {d.charity?.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-rose-400 whitespace-nowrap">
                      ₹{(d.amountInCents / 100).toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-md ${
                        d.isIndependent ? "bg-blue-500/10 text-blue-400" : "bg-brand-500/10 text-brand-400"
                      }`}>
                        {d.isIndependent ? "Direct" : "Subscription"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-dark-400 whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}