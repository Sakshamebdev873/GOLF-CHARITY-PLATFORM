"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Loader2, Trash2, Image as ImageIcon, Upload, X } from "lucide-react";
import { useGetAdminCharitiesQuery, useCreateCharityMutation, useUpdateCharityMutation, useDeleteCharityMutation } from "@/store/api/adminApi";
import { useUpload } from "@/hooks/useUpload";
import toast from "react-hot-toast";

export default function AdminCharitiesPage() {
  const { data, isLoading } = useGetAdminCharitiesQuery();
  const [createCharity, { isLoading: creating }] = useCreateCharityMutation();
  const [updateCharity] = useUpdateCharityMutation();
  const [deleteCharity] = useDeleteCharityMutation();
  const { upload, uploading } = useUpload();

  const [showCreate, setShowCreate] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null); // NEW: Tracks which charity is updating
  const [form, setForm] = useState({
    name: "", slug: "", description: "", category: "",
    websiteUrl: "", isFeatured: false, logoUrl: "", coverImageUrl: "",
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const charities = data?.data?.charities || [];

  const handleImageUpload = async (file: File, field: "logoUrl" | "coverImageUrl") => {
    try {
      const url = await upload(file, "golf-charity/charities");
      setForm({ ...form, [field]: url });
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCharity(form).unwrap();
      toast.success("Charity created!");
      setShowCreate(false);
      setForm({ name: "", slug: "", description: "", category: "", websiteUrl: "", isFeatured: false, logoUrl: "", coverImageUrl: "" });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed");
    }
  };

  const handleUpdateImage = async (charityId: string, file: File, field: "logoUrl" | "coverImageUrl") => {
    setUpdatingId(charityId); // Start loading for this specific charity
    try {
      const url = await upload(file, "golf-charity/charities");
      await updateCharity({ id: charityId, data: { [field]: url } }).unwrap();
      toast.success("Image updated!");
    } catch {
      toast.error("Failed to update image");
    } finally {
      setUpdatingId(null); // Stop loading
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    setUpdatingId(id); // Start loading
    try {
      await updateCharity({ id, data: { isFeatured: !current } }).unwrap();
      toast.success("Featured status updated!");
    } catch { 
      toast.error("Failed to update status"); 
    } finally {
      setUpdatingId(null); // Stop loading
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this charity?")) return;
    setUpdatingId(id); // Start loading
    try { 
      await deleteCharity(id).unwrap(); 
      toast.success("Charity deactivated"); 
    } catch { 
      toast.error("Failed to deactivate"); 
    } finally {
      setUpdatingId(null); // Stop loading
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Charities</h1>
          <p className="text-dark-400">Manage charity listings, images, and content.</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Charity
        </button>
      </motion.div>

      {/* Create Form */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass rounded-2xl border border-white/[0.06] p-6 mb-8">
          <h2 className="font-display font-semibold text-lg text-white mb-4">New Charity</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-dark-400 mb-1.5">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-red-500/50 transition-all" placeholder="Charity Name" />
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1.5">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} required
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-red-500/50 transition-all" placeholder="charity-slug" />
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1.5">Category</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-red-500/50 transition-all" placeholder="e.g. Youth & Education" />
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1.5">Website URL</label>
                <input type="url" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-red-500/50 transition-all" placeholder="https://..." />
              </div>
            </div>

            <div>
              <label className="block text-xs text-dark-400 mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-red-500/50 transition-all resize-none" placeholder="Describe the charity..." />
            </div>

            {/* Image Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Logo Upload */}
              <div>
                <label className="block text-xs text-dark-400 mb-1.5">Logo Image</label>
                <input type="file" ref={logoInputRef} accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "logoUrl")} />
                {form.logoUrl ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/[0.06]">
                    <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm({ ...form, logoUrl: "" })}
                      className="absolute top-2 right-2 w-6 h-6 bg-dark-950/80 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => logoInputRef.current?.click()} disabled={uploading}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-white/[0.1] flex flex-col items-center justify-center gap-2 hover:border-white/[0.2] transition-colors text-dark-500 hover:text-white">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-5 h-5" /><span className="text-xs">Upload Logo</span></>}
                  </button>
                )}
              </div>

              {/* Cover Upload */}
              <div>
                <label className="block text-xs text-dark-400 mb-1.5">Cover Image</label>
                <input type="file" ref={coverInputRef} accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "coverImageUrl")} />
                {form.coverImageUrl ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/[0.06]">
                    <img src={form.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm({ ...form, coverImageUrl: "" })}
                      className="absolute top-2 right-2 w-6 h-6 bg-dark-950/80 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => coverInputRef.current?.click()} disabled={uploading}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-white/[0.1] flex flex-col items-center justify-center gap-2 hover:border-white/[0.2] transition-colors text-dark-500 hover:text-white">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ImageIcon className="w-5 h-5" /><span className="text-xs">Upload Cover</span></>}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-brand-500" />
                <span className="text-sm text-dark-300">Featured on homepage</span>
              </label>
              <div className="flex-1" />
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 text-dark-400 text-sm hover:text-white transition-colors">Cancel</button>
              <button type="submit" disabled={creating} className="btn-primary !py-2.5 !px-6 text-sm disabled:opacity-50">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Charity"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Charities Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-400" /></div>
      ) : (
        <div className="space-y-4">
          {charities.map((c: any) => (
            <div key={c.id} className="relative overflow-hidden glass rounded-2xl border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all">
              
              {/* NEW: Loading Overlay for individual row updates */}
              {updatingId === c.id && (
                <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="relative group">
                  <div className="w-16 h-16 rounded-xl bg-dark-800 border border-white/[0.06] overflow-hidden flex-shrink-0">
                    {c.logoUrl ? (
                      <img src={c.logoUrl} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Heart className="w-6 h-6 text-dark-600" /></div>
                    )}
                  </div>
                  <label className="absolute inset-0 bg-dark-950/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Upload className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpdateImage(c.id, e.target.files[0], "logoUrl")} />
                  </label>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-display font-semibold text-white">{c.name}</h3>
                    <span className="text-xs text-dark-500">/{c.slug}</span>
                    {c.isFeatured && <span className="text-xs px-2 py-0.5 rounded bg-accent-500/10 text-accent-400">★ Featured</span>}
                    <span className={`text-xs px-2 py-0.5 rounded ${c.isActive ? "bg-brand-500/10 text-brand-400" : "bg-red-500/10 text-red-400"}`}>
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {c.category && <span className="text-xs text-dark-500">{c.category}</span>}
                  <p className="text-dark-400 text-sm mt-1 line-clamp-1">{c.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-dark-500">
                    <span>{c._count?.userSelections || 0} supporters</span>
                    <span>{c._count?.donations || 0} donations</span>
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div className="relative group flex-shrink-0 hidden md:block">
                  <div className="w-32 h-16 rounded-lg bg-dark-800 border border-white/[0.06] overflow-hidden">
                    {c.coverImageUrl ? (
                      <img src={c.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-dark-600 text-xs">No Cover</div>
                    )}
                  </div>
                  <label className="absolute inset-0 bg-dark-950/60 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <ImageIcon className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpdateImage(c.id, e.target.files[0], "coverImageUrl")} />
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleToggleFeatured(c.id, c.isFeatured)}
                    className={`p-2 rounded-lg transition-colors ${c.isFeatured ? "text-accent-400 hover:bg-accent-500/10" : "text-dark-600 hover:bg-white/[0.04] hover:text-white"}`}>
                    {c.isFeatured ? "★" : "☆"}
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-dark-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}