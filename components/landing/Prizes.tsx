"use client";

import { motion } from "framer-motion";
import { Trophy, Zap, RotateCcw, TrendingUp } from "lucide-react";

const tiers = [
  {
    match: "5 Numbers",
    share: "40%",
    label: "Jackpot",
    rollover: true,
    gradient: "from-accent-500 to-yellow-300",
    glow: "shadow-[0_0_50px_rgba(245,158,11,0.15)]",
    icon: Trophy,
  },
  {
    match: "4 Numbers",
    share: "35%",
    label: "Runner Up",
    rollover: false,
    gradient: "from-dark-200 to-dark-400",
    glow: "",
    icon: TrendingUp,
  },
  {
    match: "3 Numbers",
    share: "25%",
    label: "Third Tier",
    rollover: false,
    gradient: "from-amber-700 to-amber-500",
    glow: "",
    icon: Zap,
  },
];

export default function Prizes() {
  return (
    <section id="prizes" className="relative py-32 section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-accent-500/[0.04] rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-accent-400 font-mono text-sm tracking-widest uppercase mb-4 block">
            Prize Pool
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            Your Scores,
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-yellow-200">
              {" "}Your Chances
            </span>
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Every month, 5 numbers are drawn. Match them against your latest
            scores — the more you match, the bigger your prize.
          </p>
        </motion.div>

        {/* Draw Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 md:p-12 border border-white/[0.06] mb-12"
        >
          {/* Sample Draw Visualization */}
          <div className="text-center mb-10">
            <p className="text-dark-400 text-sm mb-4 font-mono uppercase tracking-wider">
              Sample Winning Numbers
            </p>
            <div className="flex items-center justify-center gap-3 md:gap-4">
              {[12, 27, 33, 8, 41].map((num, i) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 200 }}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-300 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                >
                  <span className="font-display font-bold text-xl md:text-3xl text-dark-950">
                    {num}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.match}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className={`relative rounded-2xl p-6 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 ${tier.glow}`}
              >
                {tier.rollover && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-accent-500 rounded-full">
                    <RotateCcw className="w-3 h-3 text-dark-950" />
                    <span className="text-[10px] font-bold text-dark-950 uppercase tracking-wider">
                      Rolls Over
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center mb-4`}>
                  <tier.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="font-display font-semibold text-lg text-white mb-1">
                  {tier.label}
                </h3>
                <p className="text-dark-400 text-sm mb-4">Match {tier.match}</p>

                <div className="pt-4 border-t border-white/[0.06]">
                  <span className="font-display font-bold text-3xl text-gradient">
                    {tier.share}
                  </span>
                  <p className="text-dark-500 text-xs mt-1">of prize pool</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-dark-500 text-sm max-w-xl mx-auto"
        >
          If no one matches all 5 numbers, the jackpot rolls over to next
          month&apos;s draw — growing until someone wins it all.
        </motion.p>
      </div>
    </section>
  );
}