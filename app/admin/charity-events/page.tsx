"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, Loader2, Trash2, MapPin } from "lucide-react";
import { apiSlice } from "@/store/api/apiSlice";
import toast from "react-hot-toast";

const eventsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUpcomingEvents: builder.query<any, void>({ query: () => "/charity-events/upcoming", providesTags: ["Charities"] }),
    createEvent: builder.mutation<any, any>({ query: (data) => ({ url: "/charity-events", method: "POST", body: data }), invalidatesTags: ["Charities"] }),
    deleteEvent: builder.mutation<any, string>({ query: (id) => ({ url: `/charity-events/${id}`, method: "DELETE" }), invalidatesTags: ["Charities"] }),
  }),
});

const { useGetUpcomingEventsQuery, useCreateEventMutation, useDeleteEventMutation } = eventsApi;

export default function AdminCharityEventsPage() {
  const { data, isLoading } = useGetUpcomingEventsQuery();
  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ charityId: "", title: "", description: "", eventDate: "", location: "" });

  const events = data?.data || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent(form).unwrap();
      toast.success("Event created!");
      setShowCreate(false);
      setForm({ charityId: "", title: "", description: "", eventDate: "", location: "" });
    } catch (error: any) { toast.error(error?.data?.message || "Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try { await deleteEvent(id).unwrap(); toast.success("Event deleted"); } catch { toast.error("Failed"); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div><h1 className="font-display font-bold text-3xl text-white mb-2">Charity Events</h1><p className="text-dark-400">Manage upcoming charity golf days and fundraisers.</p></div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> New Event</button>
      </motion.div>

      {showCreate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl border border-white/[0.06] p-6 mb-8">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs text-dark-400 mb-1.5">Charity ID</label><input type="text" value={form.charityId} onChange={(e) => setForm({ ...form, charityId: e.target.value })} required className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all" placeholder="Paste charity ID" /></div>
              <div><label className="block text-xs text-dark-400 mb-1.5">Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all" /></div>
              <div><label className="block text-xs text-dark-400 mb-1.5">Date</label><input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} required className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all [color-scheme:dark]" /></div>
              <div><label className="block text-xs text-dark-400 mb-1.5">Location</label><input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all" /></div>
            </div>
            <div><label className="block text-xs text-dark-400 mb-1.5">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all resize-none" /></div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 text-dark-400 text-sm">Cancel</button>
              <button type="submit" disabled={creating} className="btn-primary !py-2.5 !px-6 text-sm disabled:opacity-50">{creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}</button>
            </div>
          </form>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-red-400" /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl border border-white/[0.06]"><Calendar className="w-12 h-12 text-dark-600 mx-auto mb-4" /><p className="text-dark-400">No upcoming events.</p></div>
      ) : (
        <div className="space-y-3">
          {events.map((event: any) => (
            <div key={event.id} className="glass rounded-2xl border border-white/[0.06] p-5 flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-rose-500/10 flex flex-col items-center justify-center flex-shrink-0 border border-rose-500/20">
                  <span className="text-lg font-bold text-rose-400">{new Date(event.eventDate).getDate()}</span>
                  <span className="text-[10px] text-rose-400/70 uppercase">{new Date(event.eventDate).toLocaleDateString("en-IN", { month: "short" })}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{event.title}</h3>
                  <p className="text-dark-500 text-xs">{event.charity?.name}</p>
                  {event.description && <p className="text-dark-400 text-sm mt-1">{event.description}</p>}
                  {event.location && <p className="flex items-center gap-1 text-dark-500 text-xs mt-1"><MapPin className="w-3 h-3" />{event.location}</p>}
                </div>
              </div>
              <button onClick={() => handleDelete(event.id)} className="p-2 text-dark-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}