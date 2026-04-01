"use client";

import { motion } from "framer-motion";
import { BarChart3, Ticket, Heart, Gift, Trophy, ArrowUpRight, CreditCard } from "lucide-react";
import { useAppSelector } from "@/store/store";
import { useGetProfileQuery } from "@/store/api/authApi";
import { useGetMyScoresQuery } from "@/store/api/scoreApi";
import { useGetMyEntriesQuery } from "@/store/api/drawerApi";
import { useGetMyWinningsQuery } from "@/store/api/extrasApi";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAppSelector((s) => s.auth);
  const { data: profile } = useGetProfileQuery();
  const { data: scoresData } = useGetMyScoresQuery();
  const { data: entriesData } = useGetMyEntriesQuery();
  const { data: winningsData } = useGetMyWinningsQuery();

  const sub = profile?.data?.subscription;
  const scores = scoresData?.data || [];
  const totalWon = winningsData?.data?.totalWonCents || 0;

  const stats = [
    { label: "Subscription", value: sub?.status === "ACTIVE" ? sub.plan : "Inactive", icon: CreditCard, color: "brand", href: "/dashboard/settings" },
    { label: "Scores Entered", value: `${scores.length}/5`, icon: BarChart3, color: "blue", href: "/dashboard/scores" },
    { label: "Draw Entries", value: entriesData?.data?.length || 0, icon: Ticket, color: "amber", href: "/dashboard/draws" },
    { label: "Total Won", value: `₹${(totalWon/100).toFixed(2)}`, icon: Gift, color: "emerald", href: "/dashboard/winnings" },
  ];

  const colorMap: Record<string, string> = {
    brand: "from-brand-500 to-brand-300",
    blue: "from-blue-500 to-cyan-400",
    amber: "from-accent-500 to-amber-300",
    emerald: "from-emerald-500 to-green-300",
  };

  return (
    // Added px-4 sm:px-6 lg:px-8 for mobile padding so it doesn't touch screen edges, and py-6 for vertical spacing
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-10">
        <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-2">
          Welcome back, {user?.firstName || "Golfer"} <span className="inline-block animate-pulse">👋</span>
        </h1>
        <p className="text-sm sm:text-base text-dark-400">Here&apos;s your platform overview at a glance.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 sm:mb-10">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link href={stat.href} className="glass rounded-2xl p-4 sm:p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 block group h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[stat.color]} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-dark-600 group-hover:text-white transition-colors" />
              </div>
              <p className="font-display font-bold text-xl sm:text-2xl text-white">{stat.value}</p>
              <p className="text-dark-500 text-xs sm:text-sm mt-1">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Scores */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="font-display font-semibold text-lg text-white">Your Latest Scores</h2>
          <Link href="/dashboard/scores" className="text-brand-400 text-sm hover:text-brand-300 transition-colors">Manage Scores →</Link>
        </div>
        
        {scores.length === 0 ? (
          <div className="text-center py-8 sm:py-10">
            <BarChart3 className="w-10 h-10 text-dark-600 mx-auto mb-3" />
            <p className="text-dark-400 text-sm">No scores entered yet.</p>
            <Link href="/dashboard/scores" className="text-brand-400 text-sm mt-2 inline-block hover:text-brand-300">Enter your first score →</Link>
          </div>
        ) : (
          // Changed from flex to a responsive grid: 2 cols on mobile, 3 cols on small tablets, 5 cols on large desktop
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {scores.map((score: any) => (
              <div key={score.id} className="bg-white/[0.03] rounded-xl p-3 sm:p-4 text-center border border-white/[0.06]">
                <p className="font-display font-bold text-xl sm:text-2xl text-white">{score.score}</p>
                <p className="text-dark-500 text-[10px] sm:text-xs mt-1 truncate">
                  {new Date(score.playedOn).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
              </div>
            ))}
            {Array.from({ length: Math.max(0, 5 - scores.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-white/[0.02] rounded-xl p-3 sm:p-4 text-center border border-dashed border-white/[0.06]">
                <p className="font-display font-bold text-xl sm:text-2xl text-dark-700">—</p>
                <p className="text-dark-700 text-[10px] sm:text-xs mt-1">Empty</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/scores" className="glass rounded-2xl p-5 sm:p-6 border border-white/[0.06] hover:border-brand-500/30 transition-all group">
          <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-brand-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-display font-semibold text-white mb-1">Enter Score</h3>
          <p className="text-dark-500 text-xs sm:text-sm">Log your latest round</p>
        </Link>
        <Link href="/dashboard/draws" className="glass rounded-2xl p-5 sm:p-6 border border-white/[0.06] hover:border-accent-500/30 transition-all group">
          <Ticket className="w-7 h-7 sm:w-8 sm:h-8 text-accent-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-display font-semibold text-white mb-1">Join Draw</h3>
          <p className="text-dark-500 text-xs sm:text-sm">Enter this month&apos;s draw</p>
        </Link>
        <Link href="/dashboard/charities" className="glass rounded-2xl p-5 sm:p-6 border border-white/[0.06] hover:border-rose-500/30 transition-all group">
          <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-rose-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-display font-semibold text-white mb-1">My Charity</h3>
          <p className="text-dark-500 text-xs sm:text-sm">View or change your charity</p>
        </Link>
      </motion.div>
    </div>
  );
}