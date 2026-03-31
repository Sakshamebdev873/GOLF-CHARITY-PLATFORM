"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Loader2, UserX, UserCheck } from "lucide-react";
import { useGetAdminUsersQuery, useToggleUserActiveMutation } from "@/store/api/adminApi";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetAdminUsersQuery({ page, limit: 20, search: search || undefined });
  const [toggleActive] = useToggleUserActiveMutation();

  const users = data?.data?.users || [];
  const totalPages = data?.data?.totalPages || 1;

  const handleToggle = async (id: string) => {
    try {
      const result = await toggleActive(id).unwrap();
      toast.success(result.message);
    } catch (error: any) { toast.error(error?.data?.message || "Failed"); }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1 sm:mb-2">Users</h1>
          <p className="text-dark-400 text-sm sm:text-base">Manage all platform users.</p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
        <input 
          type="text" 
          value={search} 
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
          placeholder="Search by name or email..."
          className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-red-500/50 transition-all" 
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-red-400" /></div>
      ) : (
        <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col">
          {/* Crucial Responsive Wrapper: 
            Allows the table to scroll horizontally on small screens instead of breaking the layout.
          */}
          <div className="overflow-x-auto custom-scrollbar w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {/* Added whitespace-nowrap to prevent column headers from stacking awkwardly */}
                  <th className="text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider whitespace-nowrap">User</th>
                  <th className="text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider whitespace-nowrap">Role</th>
                  <th className="text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider whitespace-nowrap">Subscription</th>
                  <th className="text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider whitespace-nowrap">Joined</th>
                  <th className="text-right text-xs text-dark-500 font-medium px-6 py-4 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-white">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-dark-500">{u.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded-md ${u.role === "ADMIN" ? "bg-red-500/10 text-red-400" : "bg-brand-500/10 text-brand-400"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-dark-400">{u.subscription?.plan || "None"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded-md ${u.isActive ? "bg-brand-500/10 text-brand-400" : "bg-red-500/10 text-red-400"}`}>
                        {u.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-dark-400 whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => handleToggle(u.id)} 
                        className={`p-2 rounded-lg transition-colors ${u.isActive ? "text-red-400 hover:bg-red-500/10" : "text-brand-400 hover:bg-brand-500/10"}`}
                        title={u.isActive ? "Disable User" : "Enable User"}
                      >
                        {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && (
              <div className="py-12 text-center text-dark-500 text-sm">
                No users found.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t border-white/[0.06] bg-dark-900/20">
              <button 
                onClick={() => setPage(Math.max(1, page - 1))} 
                disabled={page === 1} 
                className="px-3 py-1.5 text-xs text-dark-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                Prev
              </button>
              <span className="text-xs text-dark-500">Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(Math.min(totalPages, page + 1))} 
                disabled={page === totalPages} 
                className="px-3 py-1.5 text-xs text-dark-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}