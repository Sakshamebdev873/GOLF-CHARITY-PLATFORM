"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Loader2, CreditCard, Shield, Heart, Sparkles, Star, ArrowRight } from "lucide-react";
import { useCreateCheckoutMutation, useConfirmCheckoutMutation, useGetMySubscriptionQuery } from "@/store/api/subscriptionApi";
import { useGetCharitiesQuery } from "@/store/api/charitiesApi";
import toast from "react-hot-toast";

export default function SubscribePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data: subData } = useGetMySubscriptionQuery();
  const { data: charitiesData, isLoading: loadingCharities } = useGetCharitiesQuery();
  const [createCheckout, { isLoading: checkingOut }] = useCreateCheckoutMutation();
  const [confirmCheckout] = useConfirmCheckoutMutation();

  const [plan, setPlan] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [charityId, setCharityId] = useState("");
  const [contribution, setContribution] = useState(10);

  const charities = charitiesData?.data || [];
  const isSubscribed = subData?.data?.status === "ACTIVE";
  const activePlan = subData?.data?.plan; // Usually "MONTHLY" or "YEARLY"
  const isHighestTier = activePlan === "YEARLY";

  useEffect(() => {
    if (sessionId && !isSubscribed) {
      confirmCheckout({ sessionId })
        .unwrap()
        .then(() => {
          toast.success("Subscription activated! 🎉");
          window.history.replaceState({}, "", "/dashboard/subscribe");
        })
        .catch((err) => {
          if (!err?.data?.message?.includes("already")) {
            toast.error(err?.data?.message || "Failed to confirm");
          }
        });
    }
  }, [sessionId, isSubscribed, confirmCheckout]);

  const handleSubscribe = async () => {
    if (!charityId) { toast.error("Please select a charity"); return; }
    try {
      const result = await createCheckout({ plan, charityId, charityPercentage: contribution }).unwrap();
      window.location.href = result.data.url;
    } catch (error: any) {
      toast.error(error?.data?.message || "Checkout failed");
    }
  };

  // ------------------------------------------------------------------
  // ALREADY SUBSCRIBED STATE
  // ------------------------------------------------------------------
  if (isSubscribed) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 sm:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center bg-dark-800/40 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-brand-500/10 blur-[80px] pointer-events-none" />

          <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-6 border border-brand-500/20 shadow-[0_0_30px_rgba(var(--brand-500),0.15)] relative z-10">
            {isHighestTier ? <Star className="w-10 h-10 text-brand-400" /> : <Check className="w-10 h-10 text-brand-400" />}
          </div>
          
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4 relative z-10">
            {isHighestTier ? "You're a Premium Member!" : "Subscription Active"}
          </h1>
          
          <div className="inline-block bg-dark-900/60 border border-white/[0.06] rounded-2xl p-5 mb-8 relative z-10 min-w-[250px]">
            <p className="text-dark-400 text-sm uppercase tracking-wider mb-1">Current Plan</p>
            <p className="font-display text-2xl font-bold text-brand-400 uppercase tracking-wide">
              {activePlan || "Active"}
            </p>
            <p className="text-dark-400 mt-2 text-sm">
              Renews on {new Date(subData.data.currentPeriodEnd).toLocaleDateString("en-IN")}
            </p>
          </div>

          {isHighestTier ? (
            <div className="max-w-md mx-auto mb-8 relative z-10">
              <p className="text-dark-300">
                You are on our highest tier! Enjoy all premium features, monthly prize draws, and making a continuous impact with your chosen charity.
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto mb-8 bg-brand-500/5 border border-brand-500/20 rounded-2xl p-6 relative z-10">
              <h3 className="text-white font-semibold text-lg mb-2">Want to save ₹389?</h3>
              <p className="text-dark-300 text-sm mb-4">
                Upgrade to our Yearly plan and get over 2 months free while maximizing your charity contributions.
              </p>
              {/* Note: Update this onClick if you have a specific customer portal URL or upgrade API endpoint */}
              <button 
                onClick={() => toast.success("Redirecting to billing portal...")}
                className="w-full py-2.5 bg-brand-500 text-dark-950 font-bold rounded-xl hover:bg-brand-400 transition-colors flex items-center justify-center gap-2"
              >
                Upgrade to Yearly <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <a href="/dashboard" className="inline-flex items-center justify-center px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white rounded-xl transition-colors font-medium relative z-10 w-full sm:w-auto">
            Back to Dashboard
          </a>
        </motion.div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // NEW SUBSCRIPTION STATE
  // ------------------------------------------------------------------
  const features = [
    "Monthly prize draw entry",
    "Stableford score tracking",
    "Choose your charity",
    "Winner payouts",
    "Dashboard & analytics",
    "Email notifications",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span className="text-sm text-brand-300">Subscribe to Play & Win</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">Choose Your Plan</h1>
        <p className="text-dark-400 text-base sm:text-lg">All plans include every feature. Just pick your billing cycle.</p>
      </motion.div>

      {/* Plan Toggle - Made Responsive */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
        <button onClick={() => setPlan("MONTHLY")}
          className={`glass rounded-2xl p-6 border text-center transition-all ${plan === "MONTHLY" ? "border-brand-500/40 bg-brand-500/5 shadow-[0_0_20px_rgba(var(--brand-500),0.1)]" : "border-white/[0.06] hover:border-white/[0.12]"}`}>
          <p className="text-dark-400 text-xs uppercase tracking-wider mb-2">Monthly</p>
          <p className="font-display font-bold text-3xl text-white">₹199</p>
          <p className="text-dark-500 text-xs mt-1">/month</p>
        </button>
        
        <button onClick={() => setPlan("YEARLY")}
          className={`glass rounded-2xl p-6 border text-center transition-all relative ${plan === "YEARLY" ? "border-brand-500/40 bg-brand-500/5 shadow-[0_0_20px_rgba(var(--brand-500),0.1)]" : "border-white/[0.06] hover:border-white/[0.12]"}`}>
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold bg-brand-500 text-dark-950 rounded-full uppercase whitespace-nowrap">Save ₹389</span>
          <p className="text-dark-400 text-xs uppercase tracking-wider mb-2">Yearly</p>
          <p className="font-display font-bold text-3xl text-white">₹1,999</p>
          <p className="text-dark-500 text-xs mt-1">/year (₹167/mo)</p>
        </button>
      </motion.div>

      {/* Charity Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-rose-400" />
          <h2 className="font-display font-semibold text-lg text-white">Choose Your Charity</h2>
        </div>

        {loadingCharities ? (
          <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-brand-400" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {charities.map((c: any) => (
              <button key={c.id} onClick={() => setCharityId(c.id)}
                className={`text-left p-4 rounded-xl border transition-all ${charityId === c.id ? "border-rose-500/40 bg-rose-500/5" : "border-white/[0.06] hover:border-white/[0.1]"}`}>
                <p className="font-semibold text-white text-sm">{c.name}</p>
                <p className="text-dark-500 text-xs mt-1 line-clamp-2">{c.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Contribution Slider - Made Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-white/[0.06]">
          <span className="text-sm text-dark-400 whitespace-nowrap">Your Contribution:</span>
          <div className="flex items-center gap-4 flex-1">
            <input type="range" min="10" max="100" value={contribution} onChange={(e) => setContribution(+e.target.value)} className="flex-1 accent-brand-500 h-1.5" />
            <span className="font-display font-bold text-lg text-brand-400 min-w-[3rem] text-right">{contribution}%</span>
          </div>
        </div>
      </motion.div>

      {/* Features - Made Responsive */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-6 mb-8">
        <h3 className="font-display font-semibold text-white mb-4">What's Included</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 text-brand-400" />
              </div>
              <span className="text-dark-300 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subscribe Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="text-center pb-10">
        <button onClick={handleSubscribe} disabled={checkingOut || !charityId}
          className="btn-primary w-full sm:w-auto px-8 py-4 text-lg flex items-center justify-center gap-3 mx-auto disabled:opacity-40 disabled:cursor-not-allowed">
          {checkingOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay ₹{plan === "MONTHLY" ? "199" : "1,999"} — Subscribe Now
            </>
          )}
        </button>
        <div className="flex items-center justify-center gap-2 text-dark-500 text-xs mt-4">
          <Shield className="w-3.5 h-3.5" />
          <span>Secure payment via Stripe. Cancel anytime.</span>
        </div>
      </motion.div>
    </div>
  );
}