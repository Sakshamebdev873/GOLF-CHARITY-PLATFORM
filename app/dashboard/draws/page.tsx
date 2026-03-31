"use client";

import { motion } from "framer-motion";
import {
  Ticket,
  Loader2,
  Trophy,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  useGetPublishedDrawsQuery,
  useGetUpcomingDrawsQuery,
  useEnterDrawMutation,
  useGetMyEntriesQuery,
} from "@/store/api/drawerApi";
import { useGetMyScoresQuery } from "@/store/api/scoreApi";
import toast from "react-hot-toast";

export default function DrawsPage() {
  const { data: upcomingData, isLoading: loadingUpcoming } = useGetUpcomingDrawsQuery();
  const { data: publishedData, isLoading: loadingPublished } = useGetPublishedDrawsQuery();
  const { data: entriesData } = useGetMyEntriesQuery();
  const { data: scoresData } = useGetMyScoresQuery();
  const [enterDraw, { isLoading: entering }] = useEnterDrawMutation();

  const upcomingDraws = upcomingData?.data || [];
  const publishedDraws = publishedData?.data || [];
  console.log(upcomingDraws);
  
  const myEntries = entriesData?.data || [];
  const scores = scoresData?.data || [];
  const enteredDrawIds = new Set(myEntries.map((e: any) => e.drawId));
  const hasEnoughScores = scores.length >= 5;
  const isLoading = loadingUpcoming || loadingPublished;

  const handleEnter = async (drawId: string) => {
    if (!hasEnoughScores) {
      toast.error("You need 5 scores to enter a draw. Go to My Scores and add them first.");
      return;
    }
    try {
      await enterDraw({ drawId }).unwrap();
      toast.success("Successfully entered the draw!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not enter draw");
    }
  };

  // Find matched numbers for the user
  const getMatchedNumbers = (winningNumbers: number[]) => {
    if (!winningNumbers || winningNumbers.length === 0) return [];
    const userScoreValues = scores.map((s: any) => s.score);
    return winningNumbers.filter((n) => userScoreValues.includes(n));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl text-white mb-2">Draws</h1>
        <p className="text-dark-400 mb-8">Enter upcoming draws and view past results.</p>
      </motion.div>

      {/* Score Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`glass rounded-2xl p-5 mb-8 border ${
          hasEnoughScores
            ? "border-brand-500/20"
            : "border-amber-500/20"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            hasEnoughScores ? "bg-brand-500/10" : "bg-amber-500/10"
          }`}>
            <Ticket className={`w-6 h-6 ${hasEnoughScores ? "text-brand-400" : "text-amber-400"}`} />
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-white">
              {hasEnoughScores
                ? `Ready to enter! You have ${scores.length}/5 scores.`
                : `You need ${5 - scores.length} more score${5 - scores.length > 1 ? "s" : ""} to enter draws.`}
            </p>
            <p className="text-dark-400 text-sm">
              {hasEnoughScores
                ? `You've entered ${myEntries.length} draw${myEntries.length !== 1 ? "s" : ""} so far.`
                : "Go to My Scores to add your latest golf rounds."}
            </p>
          </div>
          {!hasEnoughScores && (
            <a href="/dashboard/scores" className="btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2">
              Add Scores <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
        </div>
      ) : (
        <>
          {/* ══════════════════════════════════════════════ */}
          {/* UPCOMING / OPEN DRAWS                         */}
          {/* ══════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent-400" />
              </div>
              <h2 className="font-display font-semibold text-xl text-white">
                Open Draws
              </h2>
              {upcomingDraws.length > 0 && (
                <span className="px-2.5 py-1 text-xs font-bold bg-accent-500/10 text-accent-400 rounded-full border border-accent-500/20">
                  {upcomingDraws.length} OPEN
                </span>
              )}
            </div>

            {upcomingDraws.length === 0 ? (
              <div className="glass rounded-2xl border border-white/[0.06] p-8 text-center">
                <Clock className="w-10 h-10 text-dark-600 mx-auto mb-3" />
                <p className="text-dark-400">No draws are currently open for entries.</p>
                <p className="text-dark-500 text-sm mt-2">Check back soon — new draws are created monthly.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingDraws.map((draw: any, i: number) => {
                  const isEntered = enteredDrawIds.has(draw.id);
                  const daysUntil = Math.ceil(
                    (new Date(draw.drawDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <motion.div
                      key={draw.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.1 }}
                      className={`glass rounded-2xl p-6 border transition-all ${
                        isEntered
                          ? "border-brand-500/20 bg-brand-500/[0.02]"
                          : "border-accent-500/20 hover:border-accent-500/30"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="px-2.5 py-1 text-xs font-bold bg-accent-500/10 text-accent-400 rounded-lg border border-accent-500/20 uppercase tracking-wider">
                              Open for Entry
                            </span>
                            <span className="text-xs text-dark-500 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Draws on {new Date(draw.drawDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                            </span>
                            {daysUntil > 0 && (
                              <span className="text-xs text-dark-500">
                                ({daysUntil} day{daysUntil !== 1 ? "s" : ""} left)
                              </span>
                            )}
                          </div>

                          <h3 className="font-display font-semibold text-2xl text-white mb-1">
                            {draw.monthYear} Draw
                          </h3>

                          <div className="flex items-center gap-3 text-dark-500 text-sm">
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5" />
                              {draw._count?.entries || 0} entries so far
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              draw.type === "RANDOM"
                                ? "bg-cyan-500/10 text-cyan-400"
                                : "bg-purple-500/10 text-purple-400"
                            }`}>
                              {draw.type === "RANDOM" ? "🎲 Random" : "🧠 Algorithmic"}
                            </span>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          {isEntered ? (
                            <div className="flex items-center gap-2 px-5 py-3 bg-brand-500/10 text-brand-400 font-medium rounded-xl border border-brand-500/20">
                              <CheckCircle className="w-5 h-5" />
                              <div>
                                <p className="text-sm font-semibold">You&apos;re In!</p>
                                <p className="text-xs text-brand-400/70">Entry confirmed</p>
                              </div>
                            </div>
                          ) : hasEnoughScores ? (
                            <button
                              onClick={() => handleEnter(draw.id)}
                              disabled={entering}
                              className="btn-primary !py-3 !px-6 text-base flex items-center gap-2 disabled:opacity-50"
                            >
                              {entering ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <>
                                  <Ticket className="w-5 h-5" />
                                  Enter Draw
                                </>
                              )}
                            </button>
                          ) : (
                            <div className="text-right">
                              <p className="text-amber-400 text-sm font-medium">Need {5 - scores.length} more score{5 - scores.length > 1 ? "s" : ""}</p>
                              <a href="/dashboard/scores" className="text-amber-400/70 text-xs hover:text-amber-300 transition-colors">
                                Add scores →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* ══════════════════════════════════════════════ */}
          {/* PAST / PUBLISHED DRAWS                        */}
          {/* ══════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-brand-400" />
              </div>
              <h2 className="font-display font-semibold text-xl text-white">
                Past Results
              </h2>
            </div>

            {publishedDraws.length === 0 ? (
              <div className="glass rounded-2xl border border-white/[0.06] p-8 text-center">
                <Trophy className="w-10 h-10 text-dark-600 mx-auto mb-3" />
                <p className="text-dark-400">No draw results published yet.</p>
                <p className="text-dark-500 text-sm mt-2">Results will appear here after each monthly draw.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {publishedDraws.map((draw: any, i: number) => {
                  const isEntered = enteredDrawIds.has(draw.id);
                  const matched = getMatchedNumbers(draw.winningNumbers || []);
                  const matchCount = matched.length;

                  return (
                    <motion.div
                      key={draw.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 + i * 0.1 }}
                      className="glass rounded-2xl border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-dark-500" />
                            <span className="text-dark-400 text-sm">{draw.monthYear} Draw</span>
                            <span className="px-2 py-0.5 text-xs rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                              Completed
                            </span>
                          </div>
                          <h3 className="font-display font-semibold text-xl text-white">
                            {new Date(draw.drawDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-dark-400 text-xs">Prize Pool</p>
                          <p className="font-display font-bold text-xl text-brand-400">
                            £{((draw.totalPoolCents || 0) / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Winning Numbers */}
                      {draw.winningNumbers?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-dark-500 text-xs mb-3 font-mono uppercase tracking-wider">
                            Winning Numbers
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {draw.winningNumbers.map((num: number) => {
                              const isMatched = matched.includes(num);
                              return (
                                <div
                                  key={num}
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                    isMatched
                                      ? "bg-gradient-to-br from-brand-500 to-brand-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                                      : "bg-white/[0.06] border border-white/[0.08]"
                                  }`}
                                >
                                  <span
                                    className={`font-display font-bold text-lg ${
                                      isMatched ? "text-dark-950" : "text-dark-400"
                                    }`}
                                  >
                                    {num}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* User's Result */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                        <div className="flex items-center gap-4 text-xs text-dark-500">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {draw._count?.winners || 0} winners
                          </span>
                        </div>

                        {isEntered ? (
                          <div>
                            {matchCount >= 3 ? (
                              <span className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-accent-500/10 text-accent-400 border border-accent-500/20">
                                🎉 You matched {matchCount} number{matchCount !== 1 ? "s" : ""}!
                              </span>
                            ) : matchCount > 0 ? (
                              <span className="text-xs text-dark-400">
                                You matched {matchCount} number{matchCount !== 1 ? "s" : ""} — need 3+ to win
                              </span>
                            ) : (
                              <span className="text-xs text-dark-500">No matches this time</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-dark-600 italic">You didn&apos;t enter this draw</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}