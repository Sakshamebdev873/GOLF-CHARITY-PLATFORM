"use client";

import { motion } from "framer-motion";
import { Users, CreditCard, Trophy, Heart, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { useGetAdminDashboardQuery } from "@/store/api/adminApi";

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetAdminDashboardQuery();
  const overview = data?.data?.overview;
  const recentUsers = data?.data?.recentUsers || [];
  const recentDraws = data?.data?.recentDraws || [];

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-red-400" /></div>;

  // Updated currency symbols to ₹
  const stats = [
    { label: "Total Users", value: overview?.totalUsers || 0, icon: Users, color: "from-blue-500 to-cyan-400" },
    { label: "Active Subs", value: overview?.activeSubscribers || 0, icon: CreditCard, color: "from-brand-500 to-brand-300" },
    { label: "Prize Pool", value: `₹${((overview?.totalPrizePoolCents || 0) / 100).toFixed(2)}`, icon: Trophy, color: "from-accent-500 to-amber-300" },
    { label: "Total Donated", value: `₹${((overview?.totalCharityDonationsCents || 0) / 100).toFixed(2)}`, icon: Heart, color: "from-rose-500 to-pink-400" },
    { label: "Pending Verifications", value: overview?.pendingVerifications || 0, icon: Clock, color: "from-amber-500 to-yellow-400" },
    { label: "Pending Payouts", value: overview?.pendingPayouts || 0, icon: AlertTriangle, color: "from-orange-500 to-red-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-10">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1 sm:mb-2">Admin Dashboard</h1>
        <p className="text-dark-400 text-sm sm:text-base">Platform overview and key metrics.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-4 sm:p-5 border border-white/[0.06]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="font-display font-bold text-xl sm:text-2xl text-white">{stat.value}</p>
            <p className="text-dark-500 text-xs sm:text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Recent Users */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-6"
        >
          <h2 className="font-display font-semibold text-base sm:text-lg text-white mb-4">Recent Users</h2>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-dark-500 text-sm">No recent users.</p>
            ) : (
              recentUsers.map((u: any) => (
                <div key={u.id} className="flex items-center justify-between p-3 sm:p-4 bg-white/[0.02] rounded-xl overflow-hidden">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-white truncate">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-dark-500 truncate">{u.email}</p>
                  </div>
                  <p className="text-xs text-dark-500 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Draws */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-6"
        >
          <h2 className="font-display font-semibold text-base sm:text-lg text-white mb-4">Recent Draws</h2>
          <div className="space-y-3">
            {recentDraws.length === 0 ? (
              <p className="text-dark-500 text-sm">No draws yet.</p>
            ) : (
              recentDraws.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between p-3 sm:p-4 bg-white/[0.02] rounded-xl overflow-hidden">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-white truncate">{d.monthYear}</p>
                    <p className="text-xs text-dark-500 truncate">{d._count?.entries || 0} entries · {d._count?.winners || 0} winners</p>
                  </div>
                  <p className="text-sm font-semibold text-brand-400 whitespace-nowrap">
                    ₹{((d.totalPoolCents || 0) / 100).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}