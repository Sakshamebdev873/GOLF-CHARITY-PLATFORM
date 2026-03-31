"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Loader2, Trash2 } from "lucide-react";
import { 
  useGetAdminCharitiesQuery, 
  useCreateCharityMutation, 
  useUpdateCharityMutation, 
  useDeleteCharityMutation 
} from "@/store/api/adminApi";
import toast from "react-hot-toast";

export default function AdminCharitiesPage() {
  const { data, isLoading } = useGetAdminCharitiesQuery();
  const [createCharity, { isLoading: creating }] = useCreateCharityMutation();
  const [updateCharity] = useUpdateCharityMutation();
  const [deleteCharity] = useDeleteCharityMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ 
    name: "", slug: "", description: "", category: "", websiteUrl: "", isFeatured: false 
  });

  const charities = data?.data?.charities || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCharity(form).unwrap();
      toast.success("Charity created!");
      setShowCreate(false);
      setForm({ name: "", slug: "", description: "", category: "", websiteUrl: "", isFeatured: false });
    } catch (error: any) { 
      toast.error(error?.data?.message || "Failed"); 
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try { 
      await updateCharity({ id, data: { isFeatured: !current } }).unwrap(); 
      toast.success("Updated!"); 
    } catch { 
      toast.error("Failed"); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this charity?")) return;
    try { 
      await deleteCharity(id).unwrap(); 
      toast.success("Charity deactivated"); 
    } catch { 
      toast.error("Failed"); 
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1 sm:mb-2">Charities</h1>
          <p className="text-dark-400 text-sm sm:text-base">Manage charity listings and content.</p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)} 
          className="btn-primary !py-2.5 !px-5 text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Charity
        </button>
      </motion.div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="font-display font-semibold text-lg text-white mb-4">New Charity</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-dark-400 mb-1.5 font-medium">Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-red-500/50 transition-all" placeholder="Charity Name" />
                  </div>
                  <div>
                    <label className="block text-xs text-dark-400 mb-1.5 font-medium">Slug</label>
                    <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} required className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-red-500/50 transition-all" placeholder="charity-slug" />
                  </div>
                  <div>
                    <label className="block text-xs text-dark-400 mb-1.5 font-medium">Category</label>
                    <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-red-500/50 transition-all" placeholder="e.g. Youth & Education" />
                  </div>
                  <div>
                    <label className="block text-xs text-dark-400 mb-1.5 font-medium">Website URL</label>
                    <input type="url" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-red-500/50 transition-all" placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1.5 font-medium">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-red-500/50 transition-all resize-none" placeholder="Describe the charity..." />
                </div>
                
                {/* Form Actions (Responsive) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-brand-500 w-4 h-4" />
                    <span className="text-sm text-dark-300">Featured on homepage</span>
                  </label>
                  
                  <div className="flex-1 hidden sm:block" />
                  
                  <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
                    <button type="button" onClick={() => setShowCreate(false)} className="w-full sm:w-auto px-4 py-2.5 text-dark-400 text-sm hover:text-white transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={creating} className="w-full sm:w-auto btn-primary !py-2.5 !px-6 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                      {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Charity"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charities Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-red-400" /></div>
      ) : (
        <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col">
          {/* Horizontal Scroll Wrapper */}
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider whitespace-nowrap">Charity</th>
                  <th className="text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider whitespace-nowrap">Category</th>
                  <th className="text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider whitespace-nowrap">Supporters</th>
                  <th className="text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider whitespace-nowrap">Featured</th>
                  <th className="text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="text-right text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {charities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-dark-500 text-sm">
                      No charities found.
                    </td>
                  </tr>
                ) : (
                  charities.map((c: any) => (
                    <tr key={c.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-white">{c.name}</p>
                        <p className="text-xs text-dark-500">/{c.slug}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-400 whitespace-nowrap">{c.category || "—"}</td>
                      <td className="px-6 py-4 text-sm text-dark-400 whitespace-nowrap">{c._count?.userSelections || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleToggleFeatured(c.id, c.isFeatured)} 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${c.isFeatured ? "bg-accent-500/10 text-accent-400" : "bg-white/[0.04] text-dark-600 hover:bg-white/[0.08]"}`}
                          title={c.isFeatured ? "Remove Featured" : "Mark as Featured"}
                        >
                          {c.isFeatured ? "★" : "☆"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-md ${c.isActive ? "bg-brand-500/10 text-brand-400" : "bg-red-500/10 text-red-400"}`}>
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => handleDelete(c.id)} 
                          className="p-2 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Deactivate Charity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}