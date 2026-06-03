"use client";

import { motion } from "framer-motion";
import { Play, Info, Sparkles, Volume2, VolumeX, ChevronDown, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { MovieRow } from "@/components/shared/MovieRow";
import { Movie } from "@/lib/api";
import { api } from "@/lib/api";
import Link from "next/link";

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true);
  const [featured, setFeatured] = useState<Movie | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const feat = await api.getFeaturedMovie();
        const movieRows = await api.getMovieCategories();
        if (feat) setFeatured(feat);
        if (movieRows && movieRows.length > 0) setRows(movieRows);
      } catch (err) {
        console.error("Could not load homepage data from API:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030306] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-2 border-gold-400/15 rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-gold-400 rounded-full animate-spin" />
          </div>
          <p className="text-white/25 text-[10px] uppercase tracking-[0.35em] font-medium">Loading</p>
        </div>
      </div>
    );
  }

  if (!featured) {
    return (
      <div className="min-h-screen bg-[#030306] flex items-center justify-center">
        <p className="text-white/35 text-sm">No movies available at this time.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030306] pb-24 overflow-x-hidden">
      <div className="grain-overlay" />

      {/* ─── HERO ───────────────────────────────────────── */}
      <section className="relative h-[100vh] min-h-[620px] w-full flex items-end md:items-center overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src={featured.bannerUrl}
            alt={featured.title}
            className="w-full h-full object-cover object-top"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 9, ease: "linear" }}
          />
          {/* Multi-layer overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030306] via-[#030306]/75 to-[#030306]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-[#030306]/20 to-[#030306]/40" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] radial-glow-gold rounded-full filter blur-[180px] opacity-15 mix-blend-screen pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 right-1/5 w-[400px] h-[400px] radial-glow-blue rounded-full filter blur-[130px] opacity-12 mix-blend-screen pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-0 w-full">
          <div className="max-w-xl">

            {/* Featured Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 mb-5"
            >
              <div className="w-4 h-4 relative flex items-center justify-center flex-shrink-0">
                <div className="absolute w-[2px] h-4 bg-gradient-to-b from-gold-300 to-gold-600 rounded-full" />
                <div className="absolute w-2.5 h-[2px] bg-gradient-to-r from-gold-300 to-gold-600 rounded-full" style={{ top: '26%' }} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.38em] font-bold text-gold-400">
                Featured Film
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl font-serif font-black leading-[0.9] tracking-tight text-white mb-5"
              style={{ textShadow: '0 0 60px rgba(0,0,0,0.8)' }}
            >
              {featured.title}
            </motion.h1>

            {/* Meta Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center flex-wrap gap-2.5 mb-5"
            >
              {(featured as any).year && (
                <span className="text-white/45 text-xs font-medium">{(featured as any).year}</span>
              )}
              {(featured as any).duration && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/18" />
                  <span className="text-white/45 text-xs font-medium">{(featured as any).duration}</span>
                </>
              )}
              {featured.genres && featured.genres[0] && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/18" />
                  <span className="px-2.5 py-0.5 rounded-full glass-gold text-[10px] font-semibold text-gold-400 tracking-wide">
                    {featured.genres[0]}
                  </span>
                </>
              )}
              {(featured as any).rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                  <span className="text-xs text-white/50 font-medium">{(featured as any).rating}</span>
                </div>
              )}
            </motion.div>

            {/* Description */}
            {(featured as any).description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="text-white/55 text-sm md:text-[15px] leading-relaxed mb-8 line-clamp-3 max-w-md"
              >
                {(featured as any).description}
              </motion.p>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.78, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 flex-wrap"
            >
              <Link href={`/watch/${featured.id}`}>
                <button
                  id="hero-watch-btn"
                  className="btn-cinematic flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm text-zinc-950 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #dfba73, #d4a359, #c58d41)',
                    boxShadow: '0 0 30px rgba(212,163,89,0.45), 0 4px 20px rgba(0,0,0,0.4)'
                  }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Watch Now
                </button>
              </Link>
              <Link href={`/movie/${featured.id}`}>
                <button
                  id="hero-info-btn"
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-full glass-panel-heavy text-white/80 font-semibold text-sm hover:text-white hover:border-white/25 transition-all duration-300 cursor-pointer"
                >
                  <Info className="w-4 h-4" />
                  More Info
                </button>
              </Link>
              <button
                id="hero-mute-btn"
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-full glass-panel border-white/10 text-white/45 hover:text-white transition-all duration-200 cursor-pointer"
                aria-label="Toggle mute"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-none"
        >
          <span className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-medium">Scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-white/18" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── MOVIE ROWS ─────────────────────────────────── */}
      <section className="relative z-10 -mt-4 space-y-1 pb-12">
        {rows.map((row: any, index: number) => (
          <motion.div
            key={`${row.title}-${index}`}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.75, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <MovieRow title={row.title} movies={row.movies} />
          </motion.div>
        ))}
      </section>
    </div>
  );
}
