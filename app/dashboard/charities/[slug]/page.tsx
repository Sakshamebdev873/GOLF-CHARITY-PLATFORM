"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  Loader2,
  ArrowLeft,
  ExternalLink,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  CheckCircle,
  Globe,
} from "lucide-react";
import { useGetCharityBySlugQuery } from "@/store/api/charitiesApi";
import { useGetMyCharitySelectionQuery, useSelectCharityMutation, useCreateDonationMutation } from "@/store/api/extrasApi";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CharityProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data, isLoading } = useGetCharityBySlugQuery(slug);
  const { data: selectionData } = useGetMyCharitySelectionQuery();
  const [selectCharity, { isLoading: selecting }] = useSelectCharityMutation();
  const [createDonation, { isLoading: donating }] = useCreateDonationMutation();

  const [donationAmount, setDonationAmount] = useState("");
  const [showDonate, setShowDonate] = useState(false);
  const [contribution, setContribution] = useState(10);

  const charity = data?.data;
  const isSelected = selectionData?.data?.charityId === charity?.id;
  const events = (charity as any)?.events || [];

  const handleSelect = async () => {
    if (!charity) return;
    try {
      await selectCharity({ charityId: charity.id, contributionPercent: contribution }).unwrap();
      toast.success(`${charity.name} is now your selected charity!`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to select charity");
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!charity) return;
    const amountCents = Math.round(parseFloat(donationAmount) * 100);
    if (amountCents < 100) {
      toast.error("Minimum donation is £1.00");
      return;
    }
    try {
      await createDonation({ charityId: charity.id, amountInCents: amountCents }).unwrap();
      toast.success(`£${donationAmount} donated to ${charity.name}!`);
      setDonationAmount("");
      setShowDonate(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Donation failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6">
        <div className="text-center">
          <Heart className="w-16 h-16 text-dark-700 mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl text-white mb-2">Charity Not Found</h1>
          <p className="text-dark-400 mb-6">The charity you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/dashboard/charities" className="btn-primary inline-block text-sm px-6 py-3">Browse Charities</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/charities" className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-6 sm:mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Charities
        </Link>
      </motion.div>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-3xl border border-white/[0.06] overflow-hidden mb-6 sm:mb-8"
      >
        {/* Cover Image / Gradient */}
        <div className="h-32 sm:h-48 bg-gradient-to-br from-rose-500/20 via-pink-500/10 to-dark-900 relative">
          {charity.coverImageUrl && (
            <img src={charity.coverImageUrl} alt={charity.name} className="w-full h-full object-cover absolute inset-0 opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />

          {/* Logo */}
          <div className="absolute bottom-0 left-4 sm:left-8 translate-y-1/2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-dark-800 border-4 border-dark-950 flex items-center justify-center shadow-xl">
              {charity.logoUrl ? (
                <img src={charity.logoUrl} alt={charity.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-contain" />
              ) : (
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400" />
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="pt-10 sm:pt-14 px-4 sm:px-8 pb-6 sm:pb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">{charity.name}</h1>
                {isSelected && (
                  <span className="flex items-center gap-1.5 px-3 py-1 text-[10px] sm:text-xs font-semibold bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">
                    <CheckCircle className="w-3.5 h-3.5" /> Your Charity
                  </span>
                )}
              </div>
              {charity.category && (
                <span className="inline-block text-[10px] sm:text-xs text-dark-400 bg-white/[0.04] px-3 py-1 rounded-lg mb-3">
                  {charity.category}
                </span>
              )}
              <p className="text-dark-300 text-sm sm:text-base leading-relaxed max-w-2xl">{charity.description}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap mb-6 pb-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-dark-400 text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              <span>{charity._count?.userSelections || 0} supporters</span>
            </div>
            <div className="flex items-center gap-2 text-dark-400 text-xs sm:text-sm">
              <CreditCard className="w-4 h-4" />
              <span>{charity._count?.donations || 0} donations</span>
            </div>
            {charity.websiteUrl && (
              <a href={charity.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 text-xs sm:text-sm hover:text-blue-300 transition-colors">
                <Globe className="w-4 h-4" />
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isSelected ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                <button
                  onClick={handleSelect}
                  disabled={selecting}
                  className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 py-3 sm:py-2.5"
                >
                  {selecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
                  Select as My Charity ({contribution}%)
                </button>
                
                {/* Range Slider Container - Styled for mobile */}
                <div className="flex items-center justify-between sm:justify-start gap-3 px-4 py-3 sm:px-0 sm:py-0 bg-white/[0.02] sm:bg-transparent border border-white/[0.06] sm:border-none rounded-xl">
                  <span className="text-xs text-dark-400 sm:hidden">Contribution:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={contribution}
                      onChange={(e) => setContribution(+e.target.value)}
                      className="w-24 sm:w-24 accent-brand-500 h-1.5"
                    />
                    <span className="text-xs text-brand-400 font-bold min-w-[2.5rem] text-right">{contribution}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 bg-rose-500/5 border border-rose-500/20 rounded-xl flex-1">
                <CheckCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-rose-400 font-medium text-sm">This is your selected charity</span>
              </div>
            )}

            <button
              onClick={() => setShowDonate(!showDonate)}
              className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 py-3 sm:py-2.5"
            >
              <CreditCard className="w-4 h-4" />
              Make a Donation
            </button>
          </div>

          {/* Donation Form */}
          {showDonate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-4 sm:p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden"
            >
              <p className="text-dark-300 text-xs sm:text-sm mb-3">Make an independent donation (not tied to subscription)</p>
              <form onSubmit={handleDonate} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 text-sm">£</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    required
                    placeholder="5.00"
                    className="w-full pl-8 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-rose-500/50 transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={donating} className="flex-1 sm:flex-none px-6 py-3 bg-rose-500 text-white text-sm font-semibold rounded-xl hover:bg-rose-400 transition-colors disabled:opacity-50 flex justify-center items-center min-w-[100px]">
                    {donating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Donate"}
                  </button>
                  <button type="button" onClick={() => setShowDonate(false)} className="flex-1 sm:flex-none px-4 py-3 text-dark-400 text-sm hover:text-white bg-white/[0.04] hover:bg-white/[0.08] sm:bg-transparent rounded-xl transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl border border-white/[0.06] p-4 sm:p-6"
      >
        <h2 className="font-display font-semibold text-lg text-white mb-4 sm:mb-6">
          Upcoming Events
        </h2>

        {events.length === 0 ? (
          <div className="text-center py-8 sm:py-10">
            <Calendar className="w-10 h-10 text-dark-600 mx-auto mb-3" />
            <p className="text-dark-400 text-sm sm:text-base">No upcoming events for this charity.</p>
            <p className="text-dark-500 text-xs sm:text-sm mt-1">Check back soon for golf days and fundraising events.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {events.map((event: any) => (
              <div key={event.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-all">
                {/* Date Badge */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-rose-500/10 flex flex-col items-center justify-center flex-shrink-0 border border-rose-500/20">
                  <span className="text-lg sm:text-xl font-display font-bold text-rose-400">
                    {new Date(event.eventDate).getDate()}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-rose-400/70 uppercase font-medium">
                    {new Date(event.eventDate).toLocaleDateString("en-GB", { month: "short" })}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-white mb-1 text-base sm:text-lg">{event.title}</h3>
                  {event.description && (
                    <p className="text-dark-400 text-xs sm:text-sm mb-2 line-clamp-2">{event.description}</p>
                  )}
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap mt-2 sm:mt-0">
                    <span className="flex items-center gap-1.5 text-dark-500 text-[10px] sm:text-xs">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {new Date(event.eventDate).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1.5 text-dark-500 text-[10px] sm:text-xs">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}