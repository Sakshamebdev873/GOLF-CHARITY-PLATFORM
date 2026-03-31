"use client";

import { motion } from "framer-motion";
import { Gift, Loader2, Trophy, Upload, Clock, CheckCircle, XCircle } from "lucide-react";
import { useGetMyWinningsQuery } from "@/store/api/extrasApi";

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  PENDING: { icon: Clock, color: "text-amber-400 bg-amber-500/10", label: "Pending Verification" },
  APPROVED: { icon: CheckCircle, color: "text-brand-400 bg-brand-500/10", label: "Approved" },
  REJECTED: { icon: XCircle, color: "text-red-400 bg-red-500/10", label: "Rejected" },
};

const payoutConfig: Record<string, { color: string; label: string }> = {
  PENDING: { color: "text-amber-400", label: "Payout Pending" },
  PAID: { color: "text-brand-400", label: "Paid" },
  FAILED: { color: "text-red-400", label: "Payout Failed" },
};

export default function WinningsPage() {
  const { data, isLoading } = useGetMyWinningsQuery();
  const winners = data?.data?.winners || [];
  const totalWon = data?.data?.totalWonCents || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl text-white mb-2">My Winnings</h1>
        <p className="text-dark-400 mb-8">Track your prizes and verification status.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl border border-accent-500/20 p-8 mb-8 text-center">
        <Trophy className="w-12 h-12 text-accent-400 mx-auto mb-4" />
        <p className="text-dark-400 text-sm mb-2">Total Winnings</p>
        <p className="font-display font-bold text-5xl text-gradient">£{(totalWon / 100).toFixed(2)}</p>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-400" /></div>
      ) : winners.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl border border-white/[0.06]">
          <Gift className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 text-lg">No winnings yet.</p>
          <p className="text-dark-500 text-sm mt-2">Keep entering draws — your lucky day is coming!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {winners.map((winner: any, i: number) => {
            const status = statusConfig[winner.verificationStatus] || statusConfig.PENDING;
            const payout = payoutConfig[winner.payoutStatus] || payoutConfig.PENDING;
            return (
              <motion.div key={winner.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                className="glass rounded-2xl border border-white/[0.06] p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-dark-400 text-xs mb-1">{winner.draw?.monthYear} Draw</p>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-2xl text-white">£{(winner.prizeAmountCents / 100).toFixed(2)}</span>
                      <span className="px-2 py-1 text-xs font-medium rounded-lg bg-accent-500/10 text-accent-400 border border-accent-500/20">{winner.matchTier.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {winner.matchedNumbers?.map((n: number) => (
                        <span key={n} className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-xs font-bold text-brand-400">{n}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg ${status.color}`}>
                      <status.icon className="w-3.5 h-3.5" /> {status.label}
                    </span>
                    {winner.verificationStatus === "APPROVED" && (
                      <span className={`text-xs font-medium ${payout.color}`}>{payout.label}</span>
                    )}
                    {winner.verificationStatus === "PENDING" && !winner.proofImageUrl && (
                      <button className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                        <Upload className="w-3.5 h-3.5" /> Upload Proof
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}