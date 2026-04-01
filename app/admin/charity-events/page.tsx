"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Loader2, Trash2, MapPin } from "lucide-react";
import { apiSlice } from "@/store/api/apiSlice";
import toast from "react-hot-toast";

const eventsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUpcomingEvents: builder.query<any, void>({ query: () => "/charity-events/upcoming", providesTags: ["Charities"] }),
    deleteEvent: builder.mutation<any, string>({ query: (id) => ({ url: `/charity-events/${id}`, method: "DELETE" }), invalidatesTags: ["Charities"] }),
  }),
});

const { useGetUpcomingEventsQuery, useDeleteEventMutation } = eventsApi;

export default function AdminCharityEventsPage() {
  const { data, isLoading } = useGetUpcomingEventsQuery();
  const [deleteEvent] = useDeleteEventMutation();
  
  // State to track which specific event is being deleted
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const events = data?.data || [];

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    
    setDeletingId(id); // Set loading state for this specific event
    
    try { 
      await deleteEvent(id).unwrap(); 
      toast.success("Event deleted"); 
    } catch { 
      toast.error("Failed to delete event"); 
    } finally {
      setDeletingId(null); // Clear loading state
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Charity Events</h1>
          <p className="text-dark-400">Manage upcoming charity golf days and fundraisers.</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-400" /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl border border-white/[0.06]">
          <Calendar className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">No upcoming events.</p>
        </div>
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
              <button 
                onClick={() => handleDelete(event.id)} 
                disabled={deletingId === event.id}
                className="p-2 text-dark-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === event.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}