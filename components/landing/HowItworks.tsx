"use client";

import { motion } from "framer-motion";
import { UserPlus, BarChart3, Ticket, Heart } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Subscribe",
    description:
      "Choose a monthly or yearly plan. A portion of your subscription goes straight to your chosen charity.",
    accent: "brand",
  },
  {
    icon: BarChart3,
    step: "02",
    title: "Enter Scores",
    description:
      "Log your latest 5 golf scores in Stableford format. Your scores become your entry into the monthly draw.",
    accent: "blue",
  },
  {
    icon: Ticket,
    step: "03",
    title: "Win Prizes",
    description:
      "Each month, 5 winning numbers are drawn. Match 3, 4, or all 5 to win your share of the prize pool.",
    accent: "amber",
  },
  {
    icon: Heart,
    step: "04",
    title: "Give Back",
    description:
      "Every subscription fuels charitable impact. Track your contributions and see the difference you're making.",
    accent: "rose",
  },
];

const accentColors: Record<string, string> = {
  brand: "from-brand-500 to-brand-300 shadow-brand-500/20",
  blue: "from-blue-500 to-cyan-400 shadow-blue-500/20",
  amber: "from-accent-500 to-amber-300 shadow-amber-500/20",
  rose: "from-rose-500 to-pink-400 shadow-rose-500/20",
};

const accentBorder: Record<string, string> = {
  brand: "group-hover:border-brand-500/30",
  blue: "group-hover:border-blue-500/30",
  amber: "group-hover:border-amber-500/30",
  rose: "group-hover:border-rose-500/30",
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-brand-400 font-mono text-sm tracking-widest uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            Four Steps to
            <span className="text-gradient"> Making a Difference</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            From signup to impact — the simplest way to enjoy golf, win prizes,
            and support causes that matter.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`group relative glass rounded-3xl p-8 border border-white/[0.06] ${accentBorder[step.accent]} hover:bg-white/[0.06] transition-all duration-500`}
            >
              {/* Step Number */}
              <span className="absolute top-6 right-6 font-mono text-xs text-dark-600 tracking-wider">
                {step.step}
              </span>

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accentColors[step.accent]} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <step.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-display font-semibold text-xl text-white mb-3">
                {step.title}
              </h3>
              <p className="text-dark-400 text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line (hidden on last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-white/10 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}