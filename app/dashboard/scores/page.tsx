"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Plus,
  Loader2,
  Pencil,
  Check,
  X,
  Ticket,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Info,
} from "lucide-react";
import { useGetMyScoresQuery, useAddScoreMutation, useUpdateScoreMutation } from "@/store/api/scoreApi";
import { useGetUpcomingDrawsQuery, useEnterDrawMutation, useGetMyEntriesQuery } from "@/store/api/drawerApi";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ScoresPage() {
  const { data, isLoading } = useGetMyScoresQuery();
  const [addScore, { isLoading: adding }] = useAddScoreMutation();
  const [updateScore, { isLoading: updating }] = useUpdateScoreMutation();

  // Draw data
  const { data: upcomingData } = useGetUpcomingDrawsQuery();
  const { data: entriesData } = useGetMyEntriesQuery();
  const [enterDraw, { isLoading: entering }] = useEnterDrawMutation();

  const [newScore, setNewScore] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState("");

  const scores = data?.data || [];
  const upcomingDraws = upcomingData?.data || [];
  const myEntries = entriesData?.data || [];
  const enteredDrawIds = new Set(myEntries.map((e: any) => e.drawId));
  const hasEnoughScores = scores.length >= 5;

  // Draws user hasn't entered yet
  const unentered = upcomingDraws.filter((d: any) => !enteredDrawIds.has(d.id));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newScore);
    if (val < 1 || val > 45) {
      toast.error("Score must be between 1 and 45");
      return;
    }
    try {
      await addScore({ score: val, playedOn: newDate }).unwrap();
      toast.success("Score added!");
      setNewScore("");
      setNewDate(new Date().toISOString().split("T")[0]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add score");
    }
  };

  const handleUpdate = async (id: string) => {
    const val = parseInt(editScore);
    if (val < 1 || val > 45) {
      toast.error("Score must be between 1 and 45");
      return;
    }
    try {
      await updateScore({ id, data: { score: val } }).unwrap();
      toast.success("Score updated!");
      setEditingId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update");
    }
  };

  const handleEnterDraw = async (drawId: string) => {
    if (!hasEnoughScores) {
      toast.error("You need 5 scores to enter a draw");
      return;
    }
    try {
      await enterDraw({ drawId }).unwrap();
      toast.success("You're in! Your scores have been submitted to the draw.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not enter draw");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl text-white mb-2">My Scores</h1>
        <p className="text-dark-400 mb-8">
          Enter your latest Stableford scores (1–45). Your 5 most recent scores are used as your draw entry numbers.
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════════════ */}
      {/* HOW IT WORKS BANNER                                */}
      {/* ══════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl border border-blue-500/20 p-5 mb-6"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-dark-300 leading-relaxed">
            <p className="font-semibold text-blue-400 mb-1">How it works</p>
            <p>
              1. Enter your <span className="text-white font-medium">5 latest golf scores</span> below
              → 2. Go to <Link href="/dashboard/draws" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">Draws</Link> and
              click <span className="text-white font-medium">&quot;Enter Draw&quot;</span>
              → 3. Your 5 scores become your entry numbers
              → 4. If they match the winning numbers, <span className="text-accent-400 font-medium">you win!</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════ */}
      {/* OPEN DRAWS — QUICK ENTRY                           */}
      {/* ══════════════════════════════════════════════════ */}
      {upcomingDraws.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <h2 className="font-display font-semibold text-sm text-accent-400 uppercase tracking-wider">
              Open Draws
            </h2>
          </div>

          <div className="space-y-3">
            {upcomingDraws.map((draw: any) => {
              const isEntered = enteredDrawIds.has(draw.id);
              const daysLeft = Math.ceil(
                (new Date(draw.drawDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={draw.id}
                  className={`glass rounded-2xl p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    isEntered
                      ? "border-brand-500/20 bg-brand-500/[0.02]"
                      : "border-accent-500/20 hover:border-accent-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isEntered ? "bg-brand-500/10" : "bg-accent-500/10"
                      }`}
                    >
                      <Ticket className={`w-5 h-5 ${isEntered ? "text-brand-400" : "text-accent-400"}`} />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-white">{draw.monthYear} Draw</p>
                      <p className="text-dark-500 text-xs">
                        {daysLeft > 0 ? `${daysLeft} days left` : "Closing soon"} · {draw._count?.entries || 0} entries
                      </p>
                    </div>
                  </div>

                  {isEntered ? (
                    <span className="flex items-center gap-2 px-4 py-2 bg-brand-500/10 text-brand-400 text-sm font-medium rounded-xl border border-brand-500/20">
                      <CheckCircle className="w-4 h-4" /> Entered with scores: {scores.map((s: any) => s.score).join(", ")}
                    </span>
                  ) : !hasEnoughScores ? (
                    <span className="text-amber-400 text-sm">
                      Need {5 - scores.length} more score{5 - scores.length > 1 ? "s" : ""} to enter ↓
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnterDraw(draw.id)}
                      disabled={entering}
                      className="btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      {entering ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Enter with [{scores.map((s: any) => s.score).join(", ")}]
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* ADD SCORE FORM                                     */}
      {/* ══════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl border border-white/[0.06] p-6 mb-8"
      >
        <h2 className="font-display font-semibold text-lg text-white mb-4">Add New Score</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs text-dark-400 mb-1.5">Score (1–45)</label>
            <input
              type="number"
              min="1"
              max="45"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all"
              placeholder="e.g. 36"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-dark-400 mb-1.5">Date Played</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-brand-500/50 transition-all [color-scheme:dark]"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={adding}
              className="btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Score
            </button>
          </div>
        </form>

        {scores.length >= 5 && (
          <p className="text-amber-400/80 text-xs mt-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            You already have 5 scores. Adding a new one will replace your oldest score.
          </p>
        )}
      </motion.div>

      {/* ══════════════════════════════════════════════════ */}
      {/* CURRENT SCORES LIST                                */}
      {/* ══════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl border border-white/[0.06] p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-lg text-white">
            Your Entry Numbers ({scores.length}/5)
          </h2>
          {hasEnoughScores && (
            <span className="px-3 py-1 text-xs font-semibold bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">
              ✓ Ready for draws
            </span>
          )}
        </div>

        {/* Visual Score Balls */}
        {scores.length > 0 && (
          <div className="flex items-center justify-center gap-3 mb-6 py-4">
            {scores.map((score: any, i: number) => (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.1, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-300 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.15)]"
              >
                <span className="font-display font-bold text-2xl text-dark-950">{score.score}</span>
              </motion.div>
            ))}
            {Array.from({ length: 5 - scores.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/[0.1] flex items-center justify-center"
              >
                <span className="text-dark-700 text-lg">?</span>
              </div>
            ))}
          </div>
        )}

        {hasEnoughScores && (
          <p className="text-center text-dark-400 text-xs mb-6">
            These 5 numbers — <span className="text-white font-semibold">[{scores.map((s: any) => s.score).join(", ")}]</span> — will be compared against the winning numbers in each draw you enter.
          </p>
        )}

        {/* Score List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-10">
            <BarChart3 className="w-10 h-10 text-dark-600 mx-auto mb-3" />
            <p className="text-dark-400 mb-2">No scores yet.</p>
            <p className="text-dark-500 text-sm">Add your 5 latest golf scores above to start entering draws.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scores.map((score: any, i: number) => (
              <div
                key={score.id}
                className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                    <span className="text-xs font-mono text-brand-400">#{i + 1}</span>
                  </div>
                  {editingId === score.id ? (
                    <input
                      type="number"
                      min="1"
                      max="45"
                      value={editScore}
                      onChange={(e) => setEditScore(e.target.value)}
                      className="w-20 px-3 py-1.5 bg-white/[0.06] border border-brand-500/30 rounded-lg text-sm text-white focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="font-display font-bold text-2xl text-white">{score.score}</span>
                  )}
                  <span className="text-dark-500 text-sm">
                    {new Date(score.playedOn).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {i === 0 && <span className="text-xs px-2 py-0.5 rounded bg-brand-500/10 text-brand-400">Latest</span>}
                </div>
                <div className="flex items-center gap-2">
                  {editingId === score.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(score.id)}
                        disabled={updating}
                        className="p-2 text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-dark-400 hover:bg-white/[0.04] rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(score.id);
                        setEditScore(String(score.score));
                      }}
                      className="p-2 text-dark-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {scores.length > 0 && scores.length < 5 && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-center">
            <p className="text-amber-400 text-sm font-medium">
              {5 - scores.length} more score{5 - scores.length > 1 ? "s" : ""} needed
            </p>
            <p className="text-dark-500 text-xs mt-1">
              You need exactly 5 scores to enter draws. Add {5 - scores.length} more above.
            </p>
          </div>
        )}
      </motion.div>

      {/* ══════════════════════════════════════════════════ */}
      {/* BOTTOM CTA — GO TO DRAWS                           */}
      {/* ══════════════════════════════════════════════════ */}
      {hasEnoughScores && unentered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Link
            href="/dashboard/draws"
            className="glass rounded-2xl border border-accent-500/20 p-5 flex items-center justify-between hover:border-accent-500/30 transition-all group block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ticket className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <p className="font-display font-semibold text-white">
                  {unentered.length} open draw{unentered.length > 1 ? "s" : ""} waiting for you!
                </p>
                <p className="text-dark-400 text-sm">
                  Your scores [{scores.map((s: any) => s.score).join(", ")}] are ready. Go enter now.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-accent-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}