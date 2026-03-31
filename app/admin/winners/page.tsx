"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Loader2, CheckCircle, XCircle, DollarSign, Filter } from "lucide-react";
import { useGetAdminWinnersQuery, useVerifyWinnerMutation, useUpdatePayoutMutation } from "@/store/api/adminApi";
import toast from "react-hot-toast";

const filterOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function AdminWinnersPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading } = useGetAdminWinnersQuery({ status: statusFilter || undefined });
  const [verifyWinner] = useVerifyWinnerMutation();
  const [updatePayout] = useUpdatePayoutMutation();

  const winners = data?.data?.winners || [];

  const handleVerify = async (id: string, status: "APPROVED" | "REJECTED") => {
    try { 
      await verifyWinner({ id, verificationStatus: status }).unwrap(); 
      toast.success(`Winner ${status.toLowerCase()}`); 
    } catch (error: any) { 
      toast.error(error?.data?.message || "Failed"); 
    }
  };

  const handlePayout = async (id: string) => {
    try { 
      await updatePayout({ id, payoutStatus: "PAID" }).unwrap(); 
      toast.success("Payout marked as paid"); 
    } catch (error: any) { 
      toast.error(error?.data?.message || "Failed"); 
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1 sm:mb-2">Winners</h1>
        <p className="text-dark-400 text-sm sm:text-base">Verify winner submissions and manage payouts.</p>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-4 h-4 text-dark-500 hidden sm:block" />
        {filterOptions.map((f) => (
          <button 
            key={f.value} 
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl transition-all flex-1 sm:flex-none text-center ${
              statusFilter === f.value 
                ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                : "text-dark-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Winners List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-red-400" /></div>
      ) : winners.length === 0 ? (
        <div className="text-center py-12 sm:py-16 glass rounded-2xl border border-white/[0.06] p-6">
          <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 text-sm sm:text-base">No winners found{statusFilter ? ` with status "${statusFilter}"` : ""}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {winners.map((w: any, i: number) => (
            <motion.div 
              key={w.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left Side: Winner Details */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-3 sm:mb-2">
                    <p className="font-semibold text-white text-base sm:text-lg">{w.user?.firstName} {w.user?.lastName}</p>
                    <span className="text-xs sm:text-sm text-dark-500 truncate">{w.user?.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg bg-accent-500/10 text-accent-400 border border-accent-500/20">
                      {w.matchTier.replace("_", " ")}
                    </span>
                    <span className="font-display font-bold text-lg sm:text-xl text-white">
                      £{(w.prizeAmountCents / 100).toFixed(2)}
                    </span>
                    <span className="text-xs text-dark-500">{w.draw?.monthYear} Draw</span>
                  </div>
                  
                  {w.matchedNumbers?.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      <span className="text-xs text-dark-500 mr-1 w-full sm:w-auto">Matched:</span>
                      {w.matchedNumbers.map((n: number) => (
                        <span key={n} className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-brand-500/10 flex items-center justify-center text-xs font-bold text-brand-400">
                          {n}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {w.proofImageUrl && (
                    <a href={w.proofImageUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 mt-3 inline-block">
                      View Proof Screenshot →
                    </a>
                  )}
                </div>

                {/* Right Side: Actions & Status */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 lg:gap-2 w-full lg:w-auto pt-4 lg:pt-0 mt-2 lg:mt-0 border-t lg:border-t-0 border-white/[0.06]">
                  
                  {/* Verification Status/Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {w.verificationStatus === "PENDING" ? (
                      <>
                        <button 
                          onClick={() => handleVerify(w.id, "APPROVED")} 
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 bg-brand-500/10 text-brand-400 text-xs font-medium rounded-lg border border-brand-500/20 hover:bg-brand-500/20 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button 
                          onClick={() => handleVerify(w.id, "REJECTED")} 
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 bg-red-500/10 text-red-400 text-xs font-medium rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border ${
                        w.verificationStatus === "APPROVED" 
                          ? "bg-brand-500/5 text-brand-400 border-brand-500/10" 
                          : "bg-red-500/5 text-red-400 border-red-500/10"
                      }`}>
                        {w.verificationStatus === "APPROVED" ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} 
                        {w.verificationStatus}
                      </span>
                    )}
                  </div>

                  {/* Payout Status/Actions */}
                  {w.verificationStatus === "APPROVED" && (
                    <div className="w-full sm:w-auto">
                      {w.payoutStatus === "PENDING" ? (
                        <button 
                          onClick={() => handlePayout(w.id)} 
                          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 bg-accent-500/10 text-accent-400 text-xs font-medium rounded-lg border border-accent-500/20 hover:bg-accent-500/20 transition-colors"
                        >
                          <DollarSign className="w-3.5 h-3.5" /> Mark as Paid
                        </button>
                      ) : (
                        <span className={`w-full sm:w-auto flex items-center justify-center sm:justify-end gap-1.5 text-xs font-medium py-1 ${
                          w.payoutStatus === "PAID" ? "text-brand-400" : "text-red-400"
                        }`}>
                          {w.payoutStatus === "PAID" ? "✓ Paid" : "✗ Failed"}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}