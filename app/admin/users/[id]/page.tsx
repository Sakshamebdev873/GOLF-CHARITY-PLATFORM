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
  if (!user) return <div className="text-center py-20 text-dark-400">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </Link>

      {/* User Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-white/[0.06] p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center"><User className="w-7 h-7 text-red-400" /></div>
          <div>
            <h1 className="font-display font-bold text-2xl text-white">{user.firstName} {user.lastName}</h1>
            <p className="text-dark-400 text-sm">{user.email}</p>
          </div>
          <div className="ml-auto text-right">
            <span className={`text-xs px-2.5 py-1 rounded-lg ${user.isActive ? "bg-brand-500/10 text-brand-400" : "bg-red-500/10 text-red-400"}`}>{user.isActive ? "Active" : "Disabled"}</span>
            <p className="text-dark-500 text-xs mt-1">{user.subscription?.plan || "No subscription"} — {user.subscription?.status || "N/A"}</p>
          </div>
        </div>
      </motion.div>

      {/* Scores */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl border border-white/[0.06] p-6">
        <h2 className="font-display font-semibold text-lg text-white mb-6">Golf Scores ({scores.length}/5)</h2>

        {loadingScores ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-red-400" /></div>
        ) : scores.length === 0 ? (
          <div className="text-center py-10"><BarChart3 className="w-10 h-10 text-dark-600 mx-auto mb-3" /><p className="text-dark-400">No scores entered</p></div>
        ) : (
          <div className="space-y-3">
            {scores.map((score: any, i: number) => (
              <div key={score.id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-dark-500 w-6">#{i + 1}</span>
                  {editingId === score.id ? (
                    <input type="number" min="1" max="45" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                      className="w-20 px-3 py-1.5 bg-white/[0.06] border border-red-500/30 rounded-lg text-sm text-white focus:outline-none" autoFocus />
                  ) : (
                    <span className="font-display font-bold text-2xl text-white">{score.score}</span>
                  )}
                  <span className="text-dark-500 text-sm">{new Date(score.playedOn).toLocaleDateString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-2">
                  {editingId === score.id ? (
                    <>
                      <button onClick={() => handleUpdate(score.id)} disabled={updating} className="p-2 text-brand-400 hover:bg-brand-500/10 rounded-lg"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditingId(null)} className="p-2 text-dark-400 hover:bg-white/[0.04] rounded-lg"><X className="w-4 h-4" /></button>
                    </>
                  ) : (
                    <button onClick={() => { setEditingId(score.id); setEditValue(String(score.score)); }} className="p-2 text-dark-400 hover:text-white hover:bg-white/[0.04] rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
       {user.subscription && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl border border-white/[0.06] p-6 mt-6">
          <h2 className="font-display font-semibold text-lg text-white mb-4">Subscription</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="text-dark-400 text-xs mb-1">Plan</p>
              <p className="font-semibold text-white">{user.subscription.plan}</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <p className="text-dark-400 text-xs mb-1">Status</p>
              <p className={`font-semibold ${user.subscription.status === "ACTIVE" ? "text-brand-400" : "text-red-400"}`}>{user.subscription.status}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}