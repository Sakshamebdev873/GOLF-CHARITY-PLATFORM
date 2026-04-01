"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles, IndianRupee } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { openAuthModal } from "@/store/slices/uiSlice";

const features = [
  "Monthly prize draw entry",
  "Stableford score tracking",
  "Choose your charity",
  "Winner verification & payouts",
  "Dashboard & analytics",
  "Email notifications",
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Pull the user from your auth state
  const { user } = useAppSelector((state) => state.auth);

  const monthlyPrice = 199;
  const yearlyPrice = 1999;
  const yearlyMonthly = Math.round(yearlyPrice / 12);
  const savings = monthlyPrice * 12 - yearlyPrice;

  // Handle the button click based on auth status
  const handleSubscribeClick = () => {
    if (user) {
      router.push("/dashboard/subscribe");
    } else {
      router.push('/login')
    }
  };

  return (
    <section id="pricing" className="relative py-32 section-padding">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/[0.04] rounded-full blur-[140px]" />

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-brand-400 font-mono text-sm tracking-widest uppercase mb-4 block">
            Pricing
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            One Plan,
            <span className="text-gradient"> Everything Included</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            No tiers, no hidden fees. Every subscriber gets the same full
            experience — just pick your billing cycle.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className={`text-sm font-medium transition-colors ${!yearly ? "text-white" : "text-dark-500"}`}>
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${yearly ? "bg-brand-500" : "bg-dark-700"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${yearly ? "translate-x-7" : "translate-x-0"}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${yearly ? "text-white" : "text-dark-500"}`}>
            Yearly
          </span>
          {yearly && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20"
            >
              Save ₹{savings}
            </motion.span>
          )}
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass rounded-[2rem] p-10 md:p-14 border border-brand-500/20 glow-border relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            {/* Left — Price */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Full Access</span>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-dark-400 text-2xl">₹</span>
                <span className="font-display font-bold text-6xl md:text-7xl text-white">
                  {yearly ? yearlyMonthly : monthlyPrice}
                </span>
                <span className="text-dark-400 text-lg">/mo</span>
              </div>

              {yearly && (
                <p className="text-dark-500 text-sm mb-6">
                  Billed ₹{yearlyPrice.toLocaleString("en-IN")} per year
                </p>
              )}
              {!yearly && <div className="mb-6" />}

              {/* Updated Button */}
              <button
                onClick={handleSubscribeClick}
                className="btn-primary w-full text-center text-lg"
              >
                Subscribe Now
              </button>

              <p className="text-dark-600 text-xs text-center mt-4">
                Cancel anytime. No lock-in contracts.
              </p>
            </div>

            {/* Right — Features */}
            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-brand-400" />
                  </div>
                  <span className="text-dark-200 text-sm">{feature}</span>
                </motion.div>
              ))}

              <div className="pt-6 mt-6 border-t border-white/[0.06]">
                <p className="text-dark-400 text-xs leading-relaxed">
                  At least <span className="text-brand-400 font-semibold">10% of your subscription</span>{" "}
                  goes directly to your chosen charity. You can increase this percentage anytime from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}