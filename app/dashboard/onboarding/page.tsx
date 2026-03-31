"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Loader2, CheckCircle, Users, ArrowRight, Sparkles } from "lucide-react";
import { useGetCharitiesQuery } from "@/store/api/charitiesApi";
import { useSelectCharityMutation } from "@/store/api/extrasApi";
import toast from "react-hot-toast";

export default function OnboardingPage() {
  const router = useRouter();
  const { data, isLoading } = useGetCharitiesQuery();
  const [selectCharity, { isLoading: selecting }] = useSelectCharityMutation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contribution, setContribution] = useState(10);

  const charities = data?.data || [];

  const handleContinue = async () => {
    if (!selectedId) { toast.error("Please select a charity"); return; }
    try {
      await selectCharity({ charityId: selectedId, contributionPercent: contribution }).unwrap();
      toast.success("Charity selected! Welcome aboard.");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed");
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center py-16 relative noise-bg">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-rose-500/[0.05] rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-brand-500/[0.04] rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-rose-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span className="text-sm text-rose-300 font-medium">One Last Step</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-3">Choose Your Charity</h1>
          <p className="text-dark-400 text-lg max-w-lg mx-auto">
            At least 10% of your subscription goes to your chosen charity. Pick the cause closest to your heart.
          </p>
        </div>

        {/* Contribution Slider */}
        <div className="glass rounded-2xl border border-white/[0.06] p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-300 font-medium">Your Contribution</span>
            <span className="font-display font-bold text-2xl text-brand-400">{contribution}%</span>
          </div>
          <input type="range" min="10" max="100" value={contribution} onChange={(e) => setContribution(+e.target.value)}
            className="w-full accent-brand-500 h-2 rounded-full" />
          <p className="text-dark-500 text-xs mt-2">Min 10%. Slide right to give more.</p>
        </div>

        {/* Charities Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-rose-400" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {charities.map((charity: any, i: number) => {
              const isSelected = charity.id === selectedId;
              return (
                <motion.div key={charity.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <button
                    onClick={() => setSelectedId(charity.id)}
                    className={`w-full text-left glass rounded-2xl p-5 border transition-all ${
                      isSelected
                        ? "border-rose-500/40 bg-rose-500/5 shadow-[0_0_30px_rgba(244,63,94,0.1)]"
                        : "border-white/[0.06] hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                        <Heart className={`w-5 h-5 ${isSelected ? "text-rose-400 fill-rose-400" : "text-rose-400"}`} />
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5 text-rose-400" />}
                    </div>
                    <h3 className="font-display font-semibold text-white mb-1">{charity.name}</h3>
                    {charity.category && (
                      <span className="inline-block text-xs text-dark-400 bg-white/[0.04] px-2 py-0.5 rounded mb-2">{charity.category}</span>
                    )}
                    <p className="text-dark-400 text-sm line-clamp-2">{charity.description}</p>
                    <div className="flex items-center gap-1.5 text-dark-500 text-xs mt-3">
                      <Users className="w-3.5 h-3.5" /> {charity._count?.userSelections || 0} supporters
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Continue Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleContinue}
            disabled={!selectedId || selecting}
            className="btn-primary text-lg flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {selecting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Continue to Dashboard
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-dark-500 text-sm hover:text-white transition-colors"
          >
            Skip for now
          </button>
        </div>
      </motion.div>
    </div>
  );
}