"use client";

import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Play, Heart, ShoppingBag, Tv, Share2, Check,
  Sparkles, Star, Clock, Calendar, ChevronLeft
} from "lucide-react";
import { Movie } from "@/lib/api";
import { MovieRow } from "@/components/shared/MovieRow";
import { api } from "@/lib/api";

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = resolvedParams.id;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [customDonation, setCustomDonation] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "donated" | "purchased" | "rented">("idle");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  useEffect(() => {
    async function loadMovieData() {
      try {
        const details = await api.getMovieDetails(movieId);
        if (details) {
          setMovie(details);
          try {
            const allMovies = await api.getCatalog();
            setSimilarMovies(allMovies.filter((m: Movie) => m.id !== details.id).slice(0, 6));
          } catch (e) {}
        }
        const favorites = await api.getFavorites();
        setIsFavorite(favorites.some((f: any) => f.id === movieId));
      } catch (err) {
        console.warn("Could not retrieve movie details from API.");
      }
    }
    loadMovieData();
  }, [movieId]);

  const handleBuy = async () => {
    if (!movie) return;
    try { await api.buyMovie(movie.id); setCheckoutStep("purchased"); setTimeout(() => setCheckoutStep("idle"), 4000); }
    catch (err) { console.error(err); }
  };

  const handleRent = async () => {
    if (!movie) return;
    try { await api.rentMovie(movie.id); setCheckoutStep("rented"); setTimeout(() => setCheckoutStep("idle"), 4000); }
    catch (err) { console.error(err); }
  };

  const handleToggleFavorite = async () => {
    if (!movie) return;
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      if (next) await api.addFavorite(movie.id);
      else await api.removeFavorite(movie.id);
    } catch (err) { setIsFavorite(!next); }
  };

  const handleDonate = async () => {
    const amt = donationAmount || Number(customDonation);
    if (!amt || isNaN(amt)) return;
    try { await api.submitDonation(amt); setCheckoutStep("donated"); setTimeout(() => setCheckoutStep("idle"), 4000); }
    catch (err) { console.error(err); }
  };

  // Loading skeleton
  if (!movie) {
    return (
      <div className="min-h-screen bg-[#030306] pt-32 pb-24 px-4 md:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="w-48 h-8 rounded-xl skeleton" />
          <div className="w-3/4 h-16 rounded-2xl skeleton" />
          <div className="flex gap-3">
            {[1,2,3].map(i => <div key={i} className="w-20 h-5 rounded skeleton" />)}
          </div>
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="w-full h-4 rounded skeleton" style={{ width: i === 3 ? '60%' : '100%' }} />)}
          </div>
          <div className="w-full aspect-video rounded-2xl skeleton" />
        </div>
      </div>
    );
  }

  const donationPresets = [5, 10, 25, 50];

  return (
    <div className="min-h-screen bg-[#030306] pb-24 overflow-x-hidden relative">
      <div className="grain-overlay" />

      {/* ── Cinematic Banner ── */}
      <div className="absolute top-0 left-0 right-0 h-[75vh] z-0 overflow-hidden">
        <motion.img
          src={movie.bannerUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: 'linear' }}
        />
        {/* Multi-layer fade to dark */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(3,3,6,0.25) 0%, rgba(3,3,6,0.6) 60%, #030306 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(3,3,6,0.7) 0%, transparent 50%)' }} />
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] radial-glow-gold rounded-full filter blur-[160px] opacity-12 mix-blend-screen pointer-events-none animate-pulse-slow" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-medium group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* ── Left Column ── */}
          <div className="lg:col-span-8 space-y-8">

            {/* Genre Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.slice(0, 3).map((g) => (
                    <span key={g} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400 glass-gold">
                      <Sparkles className="w-3 h-3" />
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-black leading-[0.92] tracking-tight text-white"
            >
              {movie.title}
            </motion.h1>

            {/* Meta Row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center flex-wrap gap-4"
            >
              {(movie as any).rating && (
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(Number((movie as any).rating) / 2)
                          ? 'fill-gold-400 text-gold-400'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-white/45 ml-1">{(movie as any).rating}</span>
                </div>
              )}
              {(movie as any).duration && (
                <div className="flex items-center gap-1.5 text-white/45 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {(movie as any).duration}
                </div>
              )}
              {(movie as any).year && (
                <div className="flex items-center gap-1.5 text-white/45 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {(movie as any).year}
                </div>
              )}
              {(movie as any).language && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {(movie as any).language}
                </span>
              )}
            </motion.div>

            {/* Description */}
            {(movie as any).description && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-white/58 text-base leading-relaxed max-w-2xl"
              >
                {(movie as any).description}
              </motion.p>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 flex-wrap"
            >
              <Link href={`/watch/${movie.id}`}>
                <button
                  id="detail-watch-btn"
                  className="btn-cinematic flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm text-zinc-950 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #dfba73, #d4a359, #c58d41)',
                    boxShadow: '0 0 25px rgba(212,163,89,0.4), 0 4px 15px rgba(0,0,0,0.4)'
                  }}
                >
                  <Play className="w-4 h-4 fill-current" /> Watch Now
                </button>
              </Link>
              <button
                id="detail-fav-btn"
                onClick={handleToggleFavorite}
                className="p-3.5 rounded-full glass-panel transition-all cursor-pointer"
                style={{
                  borderColor: isFavorite ? 'rgba(248,113,113,0.4)' : undefined,
                  color: isFavorite ? 'rgba(248,113,113,0.9)' : 'rgba(255,255,255,0.5)',
                }}
                aria-label="Toggle favorite"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                id="detail-share-btn"
                className="p-3.5 rounded-full glass-panel text-white/45 hover:text-white transition-all cursor-pointer"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

          {/* ── Right Column: Commerce + Donation ── */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">

            {/* Get this Film — Rent vs Buy */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.34, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel-heavy rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(212,163,89,0.6), transparent)' }} />

              <h3 className="text-sm font-bold text-white mb-1">Get this Film</h3>
              <p className="text-xs text-white/40 mb-5 leading-relaxed">
                Choose how you&apos;d like to watch. Both unlock instant streaming in HD.
              </p>

              {/* Rent option */}
              <button
                id="detail-rent-btn"
                onClick={handleRent}
                className="w-full text-left rounded-2xl p-4 mb-3 transition-all cursor-pointer group"
                style={{
                  background: checkoutStep === 'rented' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${checkoutStep === 'rented' ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm font-bold text-white">
                    <Tv className="w-4 h-4 text-gold-400" /> Rent
                  </span>
                  <span className="text-base font-black text-gold-400">
                    {checkoutStep === 'rented' ? 'Rented!' : `$${movie.rentPrice.toFixed(2)}`}
                  </span>
                </div>
                <p className="text-[11px] text-white/45 leading-relaxed">
                  48-hour streaming access once you press play. Great for a one-time watch.
                </p>
              </button>

              {/* Buy option */}
              <button
                id="detail-buy-btn"
                onClick={handleBuy}
                className="w-full text-left rounded-2xl p-4 transition-all cursor-pointer group relative overflow-hidden"
                style={{
                  background: checkoutStep === 'purchased' ? 'rgba(34,197,94,0.1)' : 'rgba(212,163,89,0.08)',
                  border: `1px solid ${checkoutStep === 'purchased' ? 'rgba(34,197,94,0.35)' : 'rgba(212,163,89,0.3)'}`,
                }}
              >
                <span className="absolute top-2.5 right-3 text-[8px] font-bold uppercase tracking-[0.18em] text-gold-400/70">Best value</span>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm font-bold text-white">
                    <ShoppingBag className="w-4 h-4 text-gold-400" /> Buy
                  </span>
                  <span className="text-base font-black text-gold-400">
                    {checkoutStep === 'purchased' ? 'Purchased!' : `$${movie.buyPrice.toFixed(2)}`}
                  </span>
                </div>
                <p className="text-[11px] text-white/45 leading-relaxed">
                  Own it forever. Watch unlimited times, anytime, across all your devices.
                </p>
              </button>
            </motion.div>

            {/* Donation Panel */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.46, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="glass-divine rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative overflow-hidden"
            >
              {/* Top gold bar */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(212,163,89,0.6), transparent)' }} />

              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-gold-400" />
                <h3 className="text-sm font-bold text-white">Donate to the Mission</h3>
              </div>
              <p className="text-xs text-white/40 mb-5 leading-relaxed">
                Separate from renting or buying — donations fund new Christian films and keep stories free for families who can&apos;t afford them.
              </p>

              {/* Donation Presets */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {donationPresets.map(amt => (
                  <button
                    key={amt}
                    id={`donate-${amt}`}
                    onClick={() => { setDonationAmount(amt); setCustomDonation(""); }}
                    className="py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer"
                    style={{
                      background: donationAmount === amt ? 'rgba(212,163,89,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${donationAmount === amt ? 'rgba(212,163,89,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      color: donationAmount === amt ? '#dfba73' : 'rgba(255,255,255,0.6)',
                      boxShadow: donationAmount === amt ? '0 0 15px rgba(212,163,89,0.1)' : 'none',
                    }}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative mb-4">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm font-semibold">$</span>
                <input
                  id="donate-custom-input"
                  type="number"
                  placeholder="Custom amount"
                  value={customDonation}
                  onChange={e => { setCustomDonation(e.target.value); setDonationAmount(null); }}
                  className="w-full pl-8 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  min="1"
                />
              </div>

              {/* Donate Button */}
              <button
                id="donate-submit-btn"
                onClick={handleDonate}
                className="btn-cinematic w-full py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{
                  background: checkoutStep === 'donated'
                    ? 'rgba(34,197,94,0.15)'
                    : 'linear-gradient(135deg, #dfba73, #d4a359)',
                  border: checkoutStep === 'donated' ? '1px solid rgba(34,197,94,0.3)' : 'none',
                  color: checkoutStep === 'donated' ? '#22c55e' : '#030306',
                  boxShadow: checkoutStep === 'donated' ? 'none' : '0 0 20px rgba(212,163,89,0.3)',
                }}
              >
                {checkoutStep === 'donated' ? (
                  <><Check className="w-4 h-4" /> Thank you!</>
                ) : (
                  <><Heart className="w-4 h-4" /> Donate{donationAmount ? ` $${donationAmount}` : customDonation ? ` $${customDonation}` : ''}</>
                )}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16"
          >
            <MovieRow title="More Like This" movies={similarMovies} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
