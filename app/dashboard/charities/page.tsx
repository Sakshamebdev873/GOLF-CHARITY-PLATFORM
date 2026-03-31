"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Search, Loader2, CheckCircle, Users, ArrowRight } from "lucide-react";
import { useGetCharitiesQuery } from "@/store/api/charitiesApi";
import { useGetMyCharitySelectionQuery, useSelectCharityMutation } from "@/store/api/extrasApi";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CharitiesPage() {
  const [search, setSearch] = useState("");
  const { data: charitiesData, isLoading } = useGetCharitiesQuery({ search: search || undefined });
  const { data: selectionData } = useGetMyCharitySelectionQuery();
  const [selectCharity, { isLoading: selecting }] = useSelectCharityMutation();
  const [contribution, setContribution] = useState(10);

  const charities = charitiesData?.data || [];
  const currentCharityId = selectionData?.data?.charityId;

  const handleSelect = async (charityId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await selectCharity({ charityId, contributionPercent: contribution }).unwrap();
      toast.success("Charity selected!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to select charity");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl text-white mb-2">Charities</h1>
        <p className="text-dark-400 mb-8">Choose the charity you&apos;d like your subscription to support. Click any charity to view their full profile and events.</p>
      </motion.div>

      {selectionData?.data && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl border border-rose-500/20 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center"><Heart className="w-6 h-6 text-rose-400" /></div>
            <div className="flex-1">
              <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">Your Selected Charity</p>
              <p className="font-display font-semibold text-white text-lg">{selectionData.data.charity?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-dark-400 text-xs">Contribution</p>
              <p className="font-display font-bold text-xl text-rose-400">{selectionData.data.contributionPercent}%</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-2xl border border-white/[0.06] p-6 mb-8">
        <h2 className="font-display font-semibold text-white mb-4">Contribution Percentage</h2>
        <div className="flex items-center gap-4">
          <input type="range" min="10" max="100" value={contribution} onChange={(e) => setContribution(+e.target.value)} className="flex-1 accent-brand-500 h-2 rounded-full" />
          <span className="font-display font-bold text-2xl text-brand-400 min-w-[4rem] text-right">{contribution}%</span>
        </div>
        <p className="text-dark-500 text-xs mt-2">Minimum 10%. This portion of your subscription goes to your chosen charity.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search charities..."
            className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all" />
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-400" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {charities.map((charity: any, i: number) => {
            const isSelected = charity.id === currentCharityId;
            return (
              <motion.div key={charity.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }}>
                <Link href={`/dashboard/charities/${charity.slug}`}
                  className={`glass rounded-2xl p-6 border transition-all block group ${isSelected ? "border-rose-500/30 bg-rose-500/5" : "border-white/[0.06] hover:border-white/[0.12]"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                      <Heart className={`w-5 h-5 ${isSelected ? "text-rose-400 fill-rose-400" : "text-rose-400"}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      {isSelected && <CheckCircle className="w-5 h-5 text-rose-400" />}
                      <ArrowRight className="w-4 h-4 text-dark-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-white mb-2 group-hover:text-rose-300 transition-colors">{charity.name}</h3>
                  {charity.category && <span className="inline-block text-xs text-dark-400 bg-white/[0.04] px-2 py-1 rounded-md mb-3">{charity.category}</span>}
                  <p className="text-dark-400 text-sm line-clamp-2 mb-4">{charity.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                    <div className="flex items-center gap-1.5 text-dark-500 text-xs"><Users className="w-3.5 h-3.5" /> {charity._count?.userSelections || 0} supporters</div>
                    {!isSelected && (
                      <button onClick={(e) => handleSelect(charity.id, e)} disabled={selecting} className="text-xs text-brand-400 font-medium hover:text-brand-300 transition-colors">
                        Select Charity
                      </button>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}