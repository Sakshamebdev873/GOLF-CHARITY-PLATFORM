"use client";

import { motion } from "framer-motion";
import { BarChart3, Loader2, Heart, Trophy, TrendingUp } from "lucide-react";
import { useGetAdminReportsQuery } from "@/store/api/adminApi";

export default function AdminReportsPage() {
  const { data, isLoading } = useGetAdminReportsQuery();
  const revenue = data?.data?.revenue;
  const topCharities = data?.data?.topCharities || [];
  const winnerStats = data?.data?.winnerStats || [];

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-red-400" /></div>;

  const totalRevenue = revenue?._sum?.amountInCents || 0;
  const totalPrize = revenue?._sum?.prizePoolShare || 0;
  const totalCharity = revenue?._sum?.charityShare || 0;
  const totalPlatform = revenue?._sum?.platformShare || 0;

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display font-bold text-3xl text-white mb-2">Reports & Analytics</h1>
        <p className="text-dark-400">Financial breakdown and platform statistics.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Revenue", value: totalRevenue, icon: TrendingUp, color: "from-blue-500 to-cyan-400" },
          { label: "Prize Pool Total", value: totalPrize, icon: Trophy, color: "from-accent-500 to-amber-300" },
          { label: "Charity Total", value: totalCharity, icon: Heart, color: "from-rose-500 to-pink-400" },
          { label: "Platform Revenue", value: totalPlatform, icon: BarChart3, color: "from-brand-500 to-brand-300" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
            className="glass rounded-2xl p-5 border border-white/[0.06]">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}><stat.icon className="w-5 h-5 text-white" /></div>
            <p className="font-display font-bold text-2xl text-white">£{(stat.value / 100).toFixed(2)}</p>
            <p className="text-dark-500 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl border border-white/[0.06] p-6">
          <h2 className="font-display font-semibold text-lg text-white mb-6">Top Charities by Donations</h2>
          {topCharities.length === 0 ? <p className="text-dark-500 text-sm">No donation data yet.</p> : (
            <div className="space-y-4">
              {topCharities.map((tc: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-rose-500/10 flex items-center justify-center text-xs font-bold text-rose-400">{i + 1}</span>
                    <div><p className="text-sm font-medium text-white">{tc.charity?.name || "Unknown"}</p><p className="text-xs text-dark-500">{tc.count} donation{tc.count !== 1 ? "s" : ""}</p></div>
                  </div>
                  <span className="font-display font-bold text-rose-400">£{((tc.totalCents || 0) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass rounded-2xl border border-white/[0.06] p-6">
          <h2 className="font-display font-semibold text-lg text-white mb-6">Winner Statistics by Tier</h2>
          {winnerStats.length === 0 ? <p className="text-dark-500 text-sm">No winner data yet.</p> : (
            <div className="space-y-4">
              {winnerStats.map((ws: any) => {
                const tierColors: Record<string, string> = { FIVE_MATCH: "from-accent-500 to-yellow-300", FOUR_MATCH: "from-dark-200 to-dark-400", THREE_MATCH: "from-amber-700 to-amber-500" };
                return (
                  <div key={ws.matchTier} className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tierColors[ws.matchTier] || "from-dark-500 to-dark-400"} flex items-center justify-center`}><Trophy className="w-4 h-4 text-white" /></div>
                        <span className="text-sm font-medium text-white">{ws.matchTier.replace("_", " ")}</span>
                      </div>
                      <span className="text-sm text-dark-400">{ws._count} winner{ws._count !== 1 ? "s" : ""}</span>
                    </div>
                    <p className="text-dark-400 text-xs">Total paid: <span className="font-semibold text-brand-400">£{((ws._sum?.prizeAmountCents || 0) / 100).toFixed(2)}</span></p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}