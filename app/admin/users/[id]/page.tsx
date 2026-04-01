"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, BarChart3, Pencil, Check, X, User } from "lucide-react";
import { apiSlice } from "@/store/api/apiSlice";
import Link from "next/link";
import toast from "react-hot-toast";

// Inline API for admin user detail
const userDetailApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUser: builder.query<any, string>({
      query: (id) => `/users/${id}`,
      providesTags: ["Admin"],
    }),
    getAdminUserScores: builder.query<any, string>({
      query: (userId) => `/scores/user/${userId}`,
      providesTags: ["Scores"],
    }),
    adminUpdateScore: builder.mutation<any, { id: string; score: number }>({
      query: ({ id, score }) => ({ url: `/scores/admin/${id}`, method: "PATCH", body: { score } }),
      invalidatesTags: ["Scores"],
    }),
    adminUpdateSub: builder.mutation<any, { userId: string; data: any }>({
      query: ({ userId, data }) => ({ url: `/subscriptions/admin/${userId}`, method: "PATCH", body: data }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

const { useGetAdminUserQuery, useGetAdminUserScoresQuery, useAdminUpdateScoreMutation } = userDetailApi;

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const { data: userData, isLoading: loadingUser } = useGetAdminUserQuery(userId);
  const { data: scoresData, isLoading: loadingScores } = useGetAdminUserScoresQuery(userId);
  const [updateScore, { isLoading: updating }] = useAdminUpdateScoreMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const user = userData?.data;
  const scores = scoresData?.data || [];

  const handleUpdate = async (id: string) => {
    const val = parseInt(editValue);
    if (val < 1 || val > 45) { toast.error("Score must be 1–45"); return; }
    try {
      await updateScore({ id, score: val }).unwrap();
      toast.success("Score updated");
      setEditingId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed");
    }
  };

  if (loadingUser) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-red-400" /></div>;
  if (!user) return <div className="text-center py-20 text-dark-400 px-4">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-6 sm:mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </Link>

      {/* User Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-white/[0.06] p-5 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 sm:w-7 sm:h-7 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-xl sm:text-2xl text-white truncate">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-dark-400 text-xs sm:text-sm truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto pt-4 sm:pt-0 border-t border-white/[0.06] sm:border-0 sm:ml-auto">
            <span className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-lg ${user.isActive ? "bg-brand-500/10 text-brand-400" : "bg-red-500/10 text-red-400"}`}>
              {user.isActive ? "Active" : "Disabled"}
            </span>
            <p className="text-dark-500 text-[10px] sm:text-xs sm:mt-1.5">
              {user.subscription?.plan || "No subscription"} — {user.subscription?.status || "N/A"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Scores */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl border border-white/[0.06] p-5 sm:p-6 mb-6 sm:mb-8">
        <h2 className="font-display font-semibold text-lg text-white mb-4 sm:mb-6">Golf Scores ({scores.length}/5)</h2>

        {loadingScores ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-red-400" /></div>
        ) : scores.length === 0 ? (
          <div className="text-center py-10">
            <BarChart3 className="w-10 h-10 text-dark-600 mx-auto mb-3" />
            <p className="text-dark-400 text-sm">No scores entered</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scores.map((score: any, i: number) => (
              <div key={score.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white/[0.02] rounded-xl border border-white/[0.04] gap-3 sm:gap-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-xs font-mono text-dark-500 w-5 sm:w-6">#{i + 1}</span>
                  {editingId === score.id ? (
                    <input type="number" min="1" max="45" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                      className="w-16 sm:w-20 px-2 sm:px-3 py-1.5 bg-white/[0.06] border border-red-500/30 rounded-lg text-sm text-white focus:outline-none" autoFocus />
                  ) : (
                    <span className="font-display font-bold text-xl sm:text-2xl text-white min-w-[2.5rem]">{score.score}</span>
                  )}
                  <span className="text-dark-500 text-xs sm:text-sm whitespace-nowrap">
                    {new Date(score.playedOn).toLocaleDateString("en-IN")}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto">
                  {editingId === score.id ? (
                    <>
                      <button onClick={() => handleUpdate(score.id)} disabled={updating} className="p-2 text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-2 text-dark-400 hover:bg-white/[0.04] hover:text-white rounded-lg transition-colors">
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => { setEditingId(score.id); setEditValue(String(score.score)); }} className="p-2 text-dark-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors">
                      <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Subscription */}
      {user.subscription && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl border border-white/[0.06] p-5 sm:p-6">
          <h2 className="font-display font-semibold text-lg text-white mb-4">Subscription</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/[0.03] border border-white/[0.04] rounded-xl p-3 sm:p-4">
              <p className="text-dark-400 text-[10px] sm:text-xs mb-1 uppercase tracking-wider">Plan</p>
              <p className="font-semibold text-white text-sm sm:text-base">{user.subscription.plan}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.04] rounded-xl p-3 sm:p-4">
              <p className="text-dark-400 text-[10px] sm:text-xs mb-1 uppercase tracking-wider">Status</p>
              <p className={`font-semibold text-sm sm:text-base ${user.subscription.status === "ACTIVE" ? "text-brand-400" : "text-red-400"}`}>
                {user.subscription.status}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}