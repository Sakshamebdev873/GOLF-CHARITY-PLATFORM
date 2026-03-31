"use client";

import { motion } from "framer-motion";
import { Bell, Loader2, CheckCheck } from "lucide-react";
import { useGetMyNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from "@/store/api/extrasApi";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const { data, isLoading } = useGetMyNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: markingAll }] = useMarkAllAsReadMutation();

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  const handleMarkAll = async () => {
    try { await markAllAsRead().unwrap(); toast.success("All marked as read"); } catch { toast.error("Failed"); }
  };

  const handleMarkOne = async (id: string) => {
    try { await markAsRead(id).unwrap(); } catch {}
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Notifications</h1>
          <p className="text-dark-400">{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAll} disabled={markingAll} className="btn-secondary !py-2.5 !px-4 text-sm flex items-center gap-2">
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-400" /></div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl border border-white/[0.06]">
          <Bell className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n: any, i: number) => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => !n.isRead && handleMarkOne(n.id)}
              className={`glass rounded-2xl p-5 border cursor-pointer transition-all ${n.isRead ? "border-white/[0.04] opacity-60" : "border-brand-500/20 hover:border-brand-500/30"}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.isRead ? "bg-dark-800" : "bg-brand-500/10"}`}>
                  <Bell className={`w-5 h-5 ${n.isRead ? "text-dark-600" : "text-brand-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-white">{n.title}</h3>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-brand-400" />}
                  </div>
                  <p className="text-dark-400 text-sm">{n.body}</p>
                  <p className="text-dark-600 text-xs mt-2">{new Date(n.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}