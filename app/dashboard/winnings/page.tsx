"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Loader2, Trophy, Upload, Clock, CheckCircle, XCircle, Image as ImageIcon, ExternalLink } from "lucide-react";
import { useGetMyWinningsQuery, useUploadProofMutation } from "@/store/api/extrasApi";
import { useUpload } from "@/hooks/useUpload";
import toast from "react-hot-toast";

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
  const [uploadProof] = useUploadProofMutation();
  const { upload, uploading } = useUpload();

  const [updatingId, setUpdatingId] = useState<string | null>(null); // NEW: Track which row is updating

  const winners = data?.data?.winners || [];
  const totalWon = data?.data?.totalWonCents || 0;

  const handleProofUpload = async (winnerId: string, file: File) => {
    setUpdatingId(winnerId); // Start loading for this specific winner entry
    try {
      const url = await upload(file, "golf-charity/proofs");
      await uploadProof({ id: winnerId, proofImageUrl: url }).unwrap();
      toast.success("Proof uploaded! Awaiting admin verification.");
    } catch (error: any) {
      toast.error(error?.message || "Upload failed");
    } finally {
      setUpdatingId(null); // Stop loading
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl text-white mb-2">My Winnings</h1>
        <p className="text-dark-400 mb-8">Track your prizes, upload proof, and monitor payout status.</p>
      </motion.div>

      {/* Total Won */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl border border-accent-500/20 p-8 mb-8 text-center">
        <Trophy className="w-12 h-12 text-accent-400 mx-auto mb-4" />
        <p className="text-dark-400 text-sm mb-2">Total Winnings</p>
        <p className="font-display font-bold text-5xl text-gradient">₹{(totalWon / 100).toFixed(2)}</p>
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
                // NEW: Added relative and overflow-hidden here to contain the absolute loading overlay
                className="relative overflow-hidden glass rounded-2xl border border-white/[0.06] p-6">
                
                {/* NEW: Loading Overlay for individual row uploads */}
                {updatingId === winner.id && (
                  <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 relative z-0">
                  <div className="flex-1">
                    <p className="text-dark-400 text-xs mb-1">{winner.draw?.monthYear} Draw</p>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-display font-bold text-2xl text-white">₹{(winner.prizeAmountCents / 100).toFixed(2)}</span>
                      <span className="px-2 py-1 text-xs font-medium rounded-lg bg-accent-500/10 text-accent-400 border border-accent-500/20">
                        {winner.matchTier.replace("_", " ")}
                      </span>
                    </div>

                    {/* Matched Numbers */}
                    <div className="flex items-center gap-2 mt-2 mb-4">
                      {winner.matchedNumbers?.map((n: number) => (
                        <span key={n} className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center text-xs font-bold text-brand-400 border border-brand-500/20">{n}</span>
                      ))}
                    </div>

                    {/* Proof Image */}
                    <div className="mt-3">
                      {winner.proofImageUrl ? (
                        <>
                          <p className="text-dark-500 text-xs mb-2">Proof Submitted</p>
                          <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-white/[0.06] group">
                            <img src={winner.proofImageUrl} alt="Proof" className="w-full h-full object-cover" />
                            <a href={winner.proofImageUrl} target="_blank" rel="noopener noreferrer"
                              className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <ExternalLink className="w-5 h-5 text-white" />
                            </a>
                          </div>
                        </>
                      ) : winner.verificationStatus === "PENDING" && (
                        <>
                          <p className="text-amber-400 text-xs mb-2 font-medium">Upload proof to claim your prize</p>
                          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500/10 text-brand-400 text-sm font-medium rounded-xl border border-brand-500/20 hover:bg-brand-500/20 transition-colors cursor-pointer">
                            <Upload className="w-4 h-4" />
                            Upload Score Screenshot
                            <input type="file" accept="image/*" className="hidden"
                              onChange={(e) => e.target.files?.[0] && handleProofUpload(winner.id, e.target.files[0])} 
                              disabled={updatingId === winner.id} // Disable input if currently uploading
                            />
                          </label>
                          <p className="text-dark-600 text-xs mt-2">JPEG, PNG or WebP. Max 5MB.</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-end gap-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg ${status.color}`}>
                      <status.icon className="w-3.5 h-3.5" /> {status.label}
                    </span>
                    {winner.verificationStatus === "APPROVED" && (
                      <span className={`text-xs font-medium ${payout.color}`}>{payout.label}</span>
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