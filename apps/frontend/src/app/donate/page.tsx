"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, CheckCircle2, Sparkles, Film, Users, Globe, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const TIERS = [
  {
    id: "bronze",
    name: "Supporter",
    amount: 10,
    color: "#cd7f32",
    glow: "rgba(205,127,50,0.2)",
    border: "rgba(205,127,50,0.3)",
    bg: "rgba(205,127,50,0.06)",
    description: "Help fund one scene",
    perks: ["Name in credits", "Monthly newsletter"],
  },
  {
    id: "silver",
    name: "Advocate",
    amount: 25,
    color: "#a8a9ad",
    glow: "rgba(168,169,173,0.2)",
    border: "rgba(168,169,173,0.3)",
    bg: "rgba(168,169,173,0.06)",
    description: "Support a full scene",
    perks: ["All Supporter perks", "Early access", "Behind the scenes"],
  },
  {
    id: "gold",
    name: "Patron",
    amount: 50,
    color: "#d4a359",
    glow: "rgba(212,163,89,0.25)",
    border: "rgba(212,163,89,0.4)",
    bg: "rgba(212,163,89,0.08)",
    description: "Fund a full day of filming",
    perks: ["All Advocate perks", "Producer credit", "Exclusive content"],
    popular: true,
  },
  {
    id: "patron",
    name: "Champion",
    amount: 100,
    color: "#e8d5b7",
    glow: "rgba(232,213,183,0.2)",
    border: "rgba(232,213,183,0.35)",
    bg: "rgba(232,213,183,0.05)",
    description: "Executive Producer level",
    perks: ["All Patron perks", "Executive Producer", "Premiere invitation"],
  },
];

const IMPACT_STATS = [
  { icon: Film, label: "Films Funded", value: "12" },
  { icon: Users, label: "Families Reached", value: "50K+" },
  { icon: Globe, label: "Countries", value: "28" },
];

export default function DonatePage() {
  const [selectedTier, setSelectedTier] = useState<string | null>("gold");
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donated, setDonated] = useState(false);

  const getAmount = () => {
    if (customAmount) return Number(customAmount);
    const tier = TIERS.find((t) => t.id === selectedTier);
    return tier?.amount ?? 0;
  };

  const handleDonate = async () => {
    const amt = getAmount();
    if (!amt || isNaN(amt)) return;
    setIsSubmitting(true);
    try {
      await api.submitDonation(amt);
      setDonated(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030306] pb-24 overflow-x-hidden">
      <div className="grain-overlay" />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] radial-glow-gold rounded-full filter blur-[180px] opacity-18 pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] radial-glow-blue rounded-full filter blur-[140px] opacity-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          {/* Cross Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative w-10 h-14 flex items-center justify-center">
              <div className="absolute w-[3px] h-14 rounded-full"
                style={{ background: 'linear-gradient(to bottom, #ebd19b, #d4a359, #a77030)' }} />
              <div className="absolute w-9 h-[3px] rounded-full"
                style={{ background: 'linear-gradient(to right, #ebd19b, #d4a359, #a77030)', top: '26%' }} />
              <div className="absolute inset-0 rounded-full filter blur-[20px] opacity-50 animate-pulse-slow"
                style={{ background: 'rgba(212,163,89,0.35)' }} />
            </div>
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-[10px] font-bold uppercase tracking-[0.3em] text-gold-400 mb-5">
            <Sparkles className="w-3 h-3" /> Support the Mission
          </span>

          <h1 className="text-4xl md:text-6xl font-serif font-black text-white leading-[0.92] tracking-tight mb-5">
            Make an Eternal
            <span className="block text-shimmer">Difference</span>
          </h1>

          <p className="text-white/45 text-base md:text-lg leading-relaxed mb-6 max-w-xl mx-auto">
            Your generosity helps us create inspiring Christian films that transform lives and bring hope to families around the world.
          </p>

          {/* Bible Verse */}
          <div className="inline-block glass-divine rounded-2xl px-6 py-4">
            <p className="text-sm italic" style={{ color: 'rgba(212,163,89,0.7)' }}>
              &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
            </p>
            <p className="text-[10px] text-white/30 mt-2 font-medium">2 Corinthians 9:7</p>
          </div>
        </motion.div>
      </section>

      {/* ── Impact Stats ── */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-3 gap-4">
          {IMPACT_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-divine rounded-2xl p-5 text-center"
            >
              <stat.icon className="w-5 h-5 text-gold-400 mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-white font-display">{stat.value}</p>
              <p className="text-[11px] text-white/35 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Donation Section ── */}
      <section className="max-w-5xl mx-auto px-4">

        <AnimatePresence mode="wait">
          {donated ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center py-20"
            >
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(212,163,89,0.1)', border: '1px solid rgba(212,163,89,0.3)', boxShadow: '0 0 40px rgba(212,163,89,0.2)' }}
              >
                <CheckCircle2 className="w-9 h-9 text-gold-400" />
              </div>
              <h2 className="text-3xl font-serif font-black text-white mb-3">Thank You!</h2>
              <p className="text-white/45 text-base mb-2">Your generous gift of <span className="text-gold-400 font-bold">${getAmount()}</span> has been received.</p>
              <p className="text-white/30 text-sm mb-8">May God bless you abundantly for your support.</p>
              <Link href="/">
                <button
                  id="donate-success-home-btn"
                  className="btn-cinematic flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-zinc-950 mx-auto cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #dfba73, #d4a359)', boxShadow: '0 0 25px rgba(212,163,89,0.35)' }}
                >
                  Browse More Films <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Tier Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {TIERS.map((tier, i) => (
                  <motion.button
                    key={tier.id}
                    id={`tier-${tier.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => { setSelectedTier(tier.id); setCustomAmount(""); }}
                    className="relative rounded-2xl p-5 text-left cursor-pointer transition-all duration-300 group"
                    style={{
                      background: selectedTier === tier.id ? tier.bg : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedTier === tier.id ? tier.border : 'rgba(255,255,255,0.07)'}`,
                      boxShadow: selectedTier === tier.id ? `0 0 30px ${tier.glow}, 0 10px 40px rgba(0,0,0,0.3)` : 'none',
                    }}
                  >
                    {/* Top accent */}
                    <div
                      className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(to right, transparent, ${tier.color}, transparent)`,
                        opacity: selectedTier === tier.id ? 0.8 : 0.2,
                      }}
                    />

                    {/* Popular badge */}
                    {tier.popular && (
                      <span
                        className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg, #d4a359, #a77030)', color: '#030306' }}
                      >
                        Most Popular
                      </span>
                    )}

                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center mb-4 text-xs font-black"
                      style={{ background: `${tier.color}18`, color: tier.color, border: `1px solid ${tier.color}30` }}
                    >
                      ${tier.amount}
                    </div>

                    <p className="text-sm font-bold text-white mb-1">{tier.name}</p>
                    <p className="text-[11px] text-white/40 mb-3">{tier.description}</p>

                    <ul className="space-y-1.5">
                      {tier.perks.map(perk => (
                        <li key={perk} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: tier.color }} />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </motion.button>
                ))}
              </div>

              {/* Custom Amount + Submit */}
              <div className="max-w-md mx-auto space-y-4">
                <div className="glass-divine rounded-2xl p-6 space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-semibold">$</span>
                    <input
                      id="donate-custom-amount"
                      type="number"
                      placeholder="Or enter a custom amount"
                      value={customAmount}
                      onChange={e => { setCustomAmount(e.target.value); setSelectedTier(null); }}
                      className="w-full pl-8 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      min="1"
                    />
                  </div>

                  <button
                    id="donate-submit-btn"
                    onClick={handleDonate}
                    disabled={isSubmitting || (!selectedTier && !customAmount)}
                    className="btn-cinematic w-full py-4 rounded-xl font-bold text-sm text-zinc-950 transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #dfba73, #d4a359, #c58d41)',
                      boxShadow: '0 0 30px rgba(212,163,89,0.4), 0 4px 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        <Heart className="w-4 h-4 fill-current" />
                        Give {getAmount() ? `$${getAmount()}` : 'Now'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-white/25">
                    Secure payment • Tax deductible • Cancel anytime
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
