"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Plus, Loader2, Zap, Eye, Calendar, Pencil, Trash2, X, Check, ChevronDown } from "lucide-react";
import {
  useGetAdminDrawsQuery,
  useCreateDrawMutation,
  useSimulateDrawMutation,
  useExecuteDrawMutation,
  useDeleteDrawMutation,
} from "@/store/api/adminApi";
import { apiSlice } from "@/store/api/apiSlice";
import toast from "react-hot-toast";

// Update draw endpoint
const drawUpdateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateDraw: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/draws/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Draws"],
    }),
  }),
});
const { useUpdateDrawMutation } = drawUpdateApi;

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SIMULATED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PUBLISHED: "bg-brand-500/10 text-brand-400 border-brand-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

const typeColors: Record<string, string> = {
  RANDOM: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  ALGORITHMIC: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function AdminDrawsPage() {
  const { data, isLoading } = useGetAdminDrawsQuery();
  const [createDraw, { isLoading: creating }] = useCreateDrawMutation();
  const [simulateDraw, { isLoading: simulating }] = useSimulateDrawMutation();
  const [executeDraw, { isLoading: executing }] = useExecuteDrawMutation();
  const [deleteDraw, { isLoading: deleting }] = useDeleteDrawMutation();
  const [updateDraw, { isLoading: updating }] = useUpdateDrawMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [drawDate, setDrawDate] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [drawType, setDrawType] = useState<"RANDOM" | "ALGORITHMIC">("RANDOM");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editType, setEditType] = useState<"RANDOM" | "ALGORITHMIC">("RANDOM");
  const [editStatus, setEditStatus] = useState("");

  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const draws = data?.data || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDraw({ drawDate, monthYear, type: drawType }).unwrap();
      toast.success("Draw created!");
      setShowCreate(false);
      setDrawDate("");
      setMonthYear("");
      setDrawType("RANDOM");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create draw");
    }
  };

  const handleSimulate = async (id: string) => {
    try {
      const result = await simulateDraw(id).unwrap();
      toast.success(
        `Simulation complete!\n5-match: ${result.data.fiveMatchCount} | 4-match: ${result.data.fourMatchCount} | 3-match: ${result.data.threeMatchCount}`,
        { duration: 6000 }
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Simulation failed");
    }
  };

  const handleExecute = async (id: string) => {
    if (!confirm("⚠️ Are you sure?\n\nThis will:\n• Generate winning numbers\n• Calculate all winners\n• Publish results to subscribers\n\nThis action cannot be undone.")) return;
    try {
      await executeDraw(id).unwrap();
      toast.success("Draw executed and published!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Execution failed");
    }
  };

  const startEdit = (draw: any) => {
    setEditingId(draw.id);
    setEditDate(draw.drawDate.split("T")[0]);
    setEditType(draw.type);
    setEditStatus(draw.status);
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateDraw({
        id,
        data: {
          drawDate: editDate,
          type: editType,
          status: editStatus,
        },
      }).unwrap();
      toast.success("Draw updated!");
      setEditingId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDraw(id).unwrap();
      toast.success("Draw deleted");
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1 sm:mb-2">Draws</h1>
          <p className="text-dark-400 text-sm sm:text-base">Create, simulate, and publish monthly draws.</p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)} 
          className="btn-primary !py-2.5 !px-5 text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> New Draw
        </button>
      </motion.div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-6 mb-6 sm:mb-8"
          >
            <h2 className="font-display font-semibold text-lg text-white mb-4">Create New Draw</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-dark-400 mb-1.5 font-medium">Month (YYYY-MM)</label>
                  <input
                    type="text"
                    value={monthYear}
                    onChange={(e) => setMonthYear(e.target.value)}
                    required
                    placeholder="2026-04"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-red-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1.5 font-medium">Draw Date</label>
                  <input
                    type="date"
                    value={drawDate}
                    onChange={(e) => setDrawDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1.5 font-medium">Draw Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDrawType("RANDOM")}
                      className={`flex-1 px-3 sm:px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                        drawType === "RANDOM"
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                          : "bg-white/[0.04] text-dark-500 border-white/[0.08] hover:text-white hover:border-white/[0.15]"
                      }`}
                    >
                      🎲 Random
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawType("ALGORITHMIC")}
                      className={`flex-1 px-3 sm:px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                        drawType === "ALGORITHMIC"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          : "bg-white/[0.04] text-dark-500 border-white/[0.08] hover:text-white hover:border-white/[0.15]"
                      }`}
                    >
                      🧠 Algo
                    </button>
                  </div>
                </div>
              </div>

              {/* Type Description */}
              <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                drawType === "RANDOM"
                  ? "bg-cyan-500/5 text-cyan-300/70 border border-cyan-500/10"
                  : "bg-purple-500/5 text-purple-300/70 border border-purple-500/10"
              }`}>
                {drawType === "RANDOM"
                  ? "🎲 Random — Standard lottery-style draw. 5 numbers are picked completely at random from 1–45."
                  : "🧠 Algorithmic — Numbers are weighted by frequency. Less common user scores have a higher chance of being selected, making rare matches harder to achieve."}
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="w-full sm:w-auto px-5 py-2.5 text-dark-400 text-sm hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="w-full sm:w-auto btn-primary !py-2.5 !px-6 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create Draw
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draws List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-red-400" />
        </div>
      ) : draws.length === 0 ? (
        <div className="text-center py-12 sm:py-16 glass rounded-2xl border border-white/[0.06] p-6">
          <Ticket className="w-10 h-10 sm:w-12 sm:h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 text-base sm:text-lg">No draws created yet.</p>
          <p className="text-dark-500 text-xs sm:text-sm mt-2">Click &quot;New Draw&quot; above to create your first monthly draw.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {draws.map((draw: any, i: number) => (
            <motion.div
              key={draw.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-6 hover:border-white/[0.12] transition-all"
            >
              {/* Edit Mode */}
              {editingId === draw.id ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-semibold text-lg text-white truncate pr-2">{draw.monthYear} — Editing</h3>
                    <button onClick={() => setEditingId(null)} className="p-2 text-dark-400 hover:text-white transition-colors flex-shrink-0">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-dark-400 mb-1.5 font-medium">Draw Date</label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-dark-400 mb-1.5 font-medium">Draw Type</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditType("RANDOM")}
                          className={`flex-1 px-2 sm:px-3 py-3 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                            editType === "RANDOM"
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                              : "bg-white/[0.04] text-dark-500 border-white/[0.08] hover:text-white"
                          }`}
                        >
                          🎲 Random
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditType("ALGORITHMIC")}
                          className={`flex-1 px-2 sm:px-3 py-3 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                            editType === "ALGORITHMIC"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                              : "bg-white/[0.04] text-dark-500 border-white/[0.08] hover:text-white"
                          }`}
                        >
                          🧠 Algo
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-dark-400 mb-1.5 font-medium">Status</label>
                      <div className="relative">
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full px-4 py-3 bg-dark-800 border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all appearance-none cursor-pointer"
                          style={{ colorScheme: "dark" }}
                        >
                          <option value="SCHEDULED" className="bg-dark-800 text-white">Scheduled</option>
                          <option value="SIMULATED" className="bg-dark-800 text-white">Simulated</option>
                          <option value="CANCELLED" className="bg-dark-800 text-white">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                    <button onClick={() => setEditingId(null)} className="w-full sm:w-auto px-4 py-2.5 text-dark-400 text-sm hover:text-white transition-colors">
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(draw.id)}
                      disabled={updating}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 text-dark-950 text-sm font-semibold rounded-xl hover:bg-brand-400 transition-colors disabled:opacity-50"
                    >
                      {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                      <h3 className="font-display font-semibold text-lg sm:text-xl text-white">{draw.monthYear}</h3>
                      <span className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg border ${statusColors[draw.status]}`}>
                        {draw.status}
                      </span>
                      <span className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg border ${typeColors[draw.type] || "bg-white/[0.04] text-dark-400 border-white/[0.08]"}`}>
                        {draw.type === "RANDOM" ? "🎲 Random" : "🧠 Algo"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-4 text-dark-500 text-xs sm:text-sm flex-wrap">
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(draw.drawDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="whitespace-nowrap">{draw._count?.entries || 0} entries</span>
                      <span className="whitespace-nowrap">{draw._count?.winners || 0} winners</span>
                      {draw.rolloverCents > 0 && (
                        <span className="text-accent-400 whitespace-nowrap">+£{(draw.rolloverCents / 100).toFixed(2)} rollover</span>
                      )}
                    </div>

                    {draw.winningNumbers?.length > 0 && (
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="text-xs text-dark-500 mr-1 w-full sm:w-auto">Winning:</span>
                        {draw.winningNumbers.map((n: number) => (
                          <span key={n} className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-500/5 border border-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">
                            {n}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap md:flex-nowrap md:justify-end border-t md:border-t-0 border-white/[0.06] pt-4 md:pt-0">
                    
                    {/* Simulate — only for SCHEDULED draws */}
                    {draw.status === "SCHEDULED" && (
                      <button
                        onClick={() => handleSimulate(draw.id)}
                        disabled={simulating}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500/10 text-amber-400 text-sm font-medium rounded-xl border border-amber-500/20 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                      >
                        <Eye className="w-4 h-4" /> Simulate
                      </button>
                    )}

                    {/* Execute — for SCHEDULED or SIMULATED */}
                    {(draw.status === "SCHEDULED" || draw.status === "SIMULATED") && (
                      <button
                        onClick={() => handleExecute(draw.id)}
                        disabled={executing}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500/10 text-brand-400 text-sm font-medium rounded-xl border border-brand-500/20 hover:bg-brand-500/20 transition-colors disabled:opacity-50"
                      >
                        <Zap className="w-4 h-4" /> Execute & Publish
                      </button>
                    )}

                    {/* Published badge */}
                    {draw.status === "PUBLISHED" && (
                      <span className="w-full sm:w-auto px-4 py-2.5 text-sm text-brand-400 font-medium text-center bg-brand-500/5 border border-brand-500/10 rounded-xl">
                        ✓ Published
                      </span>
                    )}

                    {/* Edit & Delete Container */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                      {/* Edit — only for non-published */}
                      {draw.status !== "PUBLISHED" && (
                        <button
                          onClick={() => startEdit(draw)}
                          className="p-2.5 sm:p-3 text-dark-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] rounded-xl transition-colors"
                          title="Edit draw"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete — only for non-published */}
                      {draw.status !== "PUBLISHED" && (
                        <>
                          {deleteConfirmId === draw.id ? (
                            <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-xl px-2 py-1">
                              <span className="text-xs text-red-400 mr-1 hidden sm:inline">Delete?</span>
                              <button
                                onClick={() => handleDelete(draw.id)}
                                disabled={deleting}
                                className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-400 transition-colors disabled:opacity-50"
                              >
                                {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Yes"}
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-3 py-1.5 text-dark-400 text-xs hover:text-white bg-dark-800 rounded-lg transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(draw.id)}
                              className="p-2.5 sm:p-3 text-dark-400 hover:text-red-400 bg-white/[0.02] hover:bg-red-500/10 border border-white/[0.04] hover:border-red-500/20 rounded-xl transition-colors"
                              title="Delete draw"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}