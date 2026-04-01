"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { apiSlice } from "@/store/api/apiSlice";
import toast from "react-hot-toast";

const configApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConfigs: builder.query<any, void>({ query: () => "/platform-config", providesTags: ["Config"] }),
    upsertConfig: builder.mutation<any, { key: string; value: string }>({
      query: (data) => ({ url: "/platform-config", method: "PUT", body: data }),
      invalidatesTags: ["Config"],
    }),
    deleteConfig: builder.mutation<any, string>({
      query: (key) => ({ url: `/platform-config/${key}`, method: "DELETE" }),
      invalidatesTags: ["Config"],
    }),
  }),
});

const { useGetConfigsQuery, useUpsertConfigMutation, useDeleteConfigMutation } = configApi;

export default function AdminConfigPage() {
  const { data, isLoading } = useGetConfigsQuery();
  const [upsertConfig, { isLoading: savingNew }] = useUpsertConfigMutation();
  const [deleteConfig] = useDeleteConfigMutation();

  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  
  // NEW: State to track which specific row is loading
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const configs = data?.data || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newValue) return;
    try { 
      await upsertConfig({ key: newKey, value: newValue }).unwrap(); 
      setNewKey(""); 
      setNewValue(""); 
      toast.success("Config added successfully!");
    } catch {
      toast.error("Failed to add config");
    }
  };

  const handleSave = async (key: string) => {
    const value = editValues[key];
    if (value === undefined) return;
    
    setUpdatingKey(key); // Start loading for this row
    try { 
      await upsertConfig({ key, value }).unwrap(); 
      setEditValues((prev) => { const n = { ...prev }; delete n[key]; return n; }); 
      toast.success("Config updated!");
    } catch {
      toast.error("Failed to update config");
    } finally {
      setUpdatingKey(null); // Stop loading
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete config "${key}"?`)) return;
    
    setDeletingKey(key); // Start loading for this row
    try { 
      await deleteConfig(key).unwrap(); 
      toast.success("Config deleted");
    } catch {
      toast.error("Failed to delete config");
    } finally {
      setDeletingKey(null); // Stop loading
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1 sm:mb-2">Platform Config</h1>
        <p className="text-dark-400 text-sm sm:text-base">Manage platform-wide settings and configuration values.</p>
      </motion.div>

      {/* Add Config Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }} 
        className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-6 mb-6 sm:mb-8"
      >
        <h2 className="font-display font-semibold text-lg text-white mb-4">Add Config</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="w-full sm:flex-1">
            <input 
              type="text" 
              value={newKey} 
              onChange={(e) => setNewKey(e.target.value)} 
              required 
              placeholder="config_key" 
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all" 
            />
          </div>
          <div className="w-full sm:flex-1">
            <input 
              type="text" 
              value={newValue} 
              onChange={(e) => setNewValue(e.target.value)} 
              required 
              placeholder="value" 
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all" 
            />
          </div>
          <button 
            type="submit" 
            disabled={savingNew} 
            className="w-full sm:w-auto btn-primary !py-3 !px-5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {savingNew ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
          </button>
        </form>
      </motion.div>

      {/* Configs Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-400" /></div>
      ) : configs.length === 0 ? (
        <div className="text-center py-12 sm:py-16 glass rounded-2xl border border-white/[0.06] p-6">
          <Settings className="w-10 h-10 sm:w-12 sm:h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 text-sm sm:text-base">No config entries. Add one above.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-xs text-dark-500 font-medium px-4 sm:px-6 py-4 uppercase tracking-wider whitespace-nowrap">Key</th>
                  <th className="text-xs text-dark-500 font-medium px-4 sm:px-6 py-4 uppercase tracking-wider">Value</th>
                  <th className="text-right text-xs text-dark-500 font-medium px-4 sm:px-6 py-4 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((c: any) => (
                  <tr key={c.key} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <code className="text-xs sm:text-sm text-brand-400 bg-brand-500/5 px-2 py-1 rounded">{c.key}</code>
                    </td>
                    <td className="px-4 sm:px-6 py-4 min-w-[200px]">
                      <input 
                        type="text" 
                        value={editValues[c.key] !== undefined ? editValues[c.key] : c.value}
                        onChange={(e) => setEditValues({ ...editValues, [c.key]: e.target.value })}
                        disabled={updatingKey === c.key || deletingKey === c.key}
                        className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-sm text-white focus:outline-none focus:border-brand-500/50 transition-all disabled:opacity-50" 
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* Save Button */}
                        {editValues[c.key] !== undefined && editValues[c.key] !== c.value && (
                          <button 
                            onClick={() => handleSave(c.key)} 
                            disabled={updatingKey === c.key || deletingKey === c.key}
                            className="p-2 text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Save changes"
                          >
                            {updatingKey === c.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          </button>
                        )}
                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDelete(c.key)} 
                          disabled={updatingKey === c.key || deletingKey === c.key}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete config"
                        >
                          {deletingKey === c.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}