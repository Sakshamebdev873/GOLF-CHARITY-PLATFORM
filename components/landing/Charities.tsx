"use client";

import { motion } from "framer-motion";
import { Heart, Users, ExternalLink, ArrowRight } from "lucide-react";
import { useGetFeaturedCharitiesQuery } from "@/store/api/charitiesApi";

const fallbackCharities = [
  { id: "1", name: "Golf For Good Foundation", slug: "golf-for-good", description: "Bringing the game of golf to underprivileged youth worldwide through coaching and equipment programs.", category: "Youth & Education", _count: { userSelections: 142, donations: 380 } },
  { id: "2", name: "Drive Against Hunger", slug: "drive-against-hunger", description: "Using the power of sport to fight food insecurity in local communities across the UK.", category: "Food & Hunger", _count: { userSelections: 98, donations: 256 } },
  { id: "3", name: "Tee Up For Kids", slug: "tee-up-for-kids", description: "Providing golf scholarships and mentoring for talented young players from disadvantaged backgrounds.", category: "Youth & Education", _count: { userSelections: 76, donations: 198 } },
];

const categoryColors: Record<string, string> = {
  "Youth & Education": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Food & Hunger": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Environment": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Veterans & Health": "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function Charities() {
  const { data, isLoading } = useGetFeaturedCharitiesQuery();
  const charities = data?.data?.length ? data.data : fallbackCharities;

  return (
    <section id="charities" className="relative py-32 section-padding">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-rose-500/[0.04] rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-rose-400 font-mono text-sm tracking-widest uppercase mb-4 block">
            Our Charities
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            Your Subscription,
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-pink-300">
              {" "}Their Future
            </span>
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Choose the cause closest to your heart. At least 10% of every
            subscription goes directly to your selected charity.
          </p>
        </motion.div>

        {/* Charity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {charities.slice(0, 3).map((charity: any, i: number) => (
            <motion.div
              key={charity.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group glass rounded-3xl overflow-hidden border border-white/[0.06] hover:border-rose-500/20 transition-all duration-500"
            >
              {/* Gradient Header */}
              <div className="h-32 bg-gradient-to-br from-dark-800 to-dark-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <Heart className="w-6 h-6 text-rose-400" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Category Badge */}
                {charity.category && (
                  <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full border mb-4 ${categoryColors[charity.category] || "bg-dark-800 text-dark-300 border-dark-700"}`}>
                    {charity.category}
                  </span>
                )}

                <h3 className="font-display font-semibold text-lg text-white mb-3 group-hover:text-rose-300 transition-colors">
                  {charity.name}
                </h3>

                <p className="text-dark-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {charity.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 text-dark-400 text-xs">
                    <Users className="w-3.5 h-3.5" />
                    <span>{charity._count?.userSelections || 0} supporters</span>
                  </div>
                  <button className="text-rose-400 text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="/charities"
            className="inline-flex items-center gap-2 text-dark-300 hover:text-white text-sm font-medium transition-colors group"
          >
            View All Charities
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}