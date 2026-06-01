"use client";

import { motion } from "framer-motion";
import { Play, Info, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { MovieRow } from "@/components/shared/MovieRow";
import { categories, featuredMovie, Movie } from "@/lib/mockData";
import { api } from "@/lib/api";
import Link from "next/link";

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true);
  const [featured, setFeatured] = useState<Movie>(featuredMovie);
  const [rows, setRows] = useState<any[]>(categories);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const feat = await api.getFeaturedMovie();
        const movieRows = await api.getMovieCategories();
        if (feat) setFeatured(feat);
        if (movieRows && movieRows.length > 0) setRows(movieRows);
      } catch (err) {
        console.warn("Could not load homepage data from API, using static presets.");
      }
    }
    fetchHomeData();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030306] pb-24 overflow-x-hidden">
      {/* Film Grain Texture overlay */}
      <div className="grain-overlay" />

      {/* Massive Cinematic Hero Section */}
      <section className="relative h-[95vh] w-full flex items-center overflow-hidden">
        {/* Cinematic Spotlight Backdrop Bloom */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] radial-glow-gold rounded-full filter blur-[120px] opacity-40 mix-blend-screen pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] radial-glow-blue rounded-full filter blur-[100px] opacity-20 mix-blend-screen pointer-events-none" />

        {/* Hero Media Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={featured.bannerUrl}
            alt={featured.title}
            className="w-full h-full object-cover scale-105 pointer-events-none"
          />
          {/* Intense vignette and blending gradients */}
          <div className="absolute inset-0 bg-gradient-hero-overlay" />
          <div className="absolute inset-0 bg-gradient-hero-left" />
          <div className="absolute inset-0 bg-gradient-vignette" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 sm:px-8 md:px-16 w-full max-w-7xl mx-auto mt-24">
          <div className="max-w-3xl">
            {/* Elegant Micro-pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/25 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300 mb-6 shadow-[0_0_20px_rgba(212,163,89,0.1)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Featured Presentation
            </motion.div>

            {/* Immersive Cinematic Typography */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <h1 className="font-serif tracking-wide text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 mb-4 leading-[1.05] drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]">
                {featured.title}
              </h1>
            </motion.div>
            
            {/* Metadata Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-white/70 mb-6 font-medium"
            >
              <span className="text-gold-400 font-bold tracking-wider text-shadow-gold">98% RECOMMENDED</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span>{featured.year}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="border border-white/10 px-2 py-0.5 rounded-md bg-white/5 font-semibold">
                {featured.rating}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span>{featured.duration}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="border border-gold-500/20 px-2 py-0.5 rounded-md bg-gold-500/5 text-[9px] uppercase tracking-widest font-bold text-gold-400">Ultra 4K</span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg text-white/60 drop-shadow-md mb-8 line-clamp-3 md:line-clamp-4 font-light leading-relaxed max-w-2xl"
            >
              {featured.description}
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href={`/movie/${featured.id}`}>
                <CinematicButton variant="gold" size="lg" className="gap-3">
                  <Play className="w-5 h-5 fill-zinc-950 text-zinc-950" />
                  Watch Trailer
                </CinematicButton>
              </Link>
              <Link href={`/movie/${featured.id}`}>
                <CinematicButton variant="glass" size="lg" className="gap-3">
                  <Info className="w-5 h-5" />
                  Details & Offers
                </CinematicButton>
              </Link>
              
              {/* Audio controller */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMuted(!isMuted)}
                className="w-11 h-11 rounded-full border border-white/10 bg-black/30 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white cursor-pointer hover:border-white/20 transition-all shadow-md ml-auto sm:ml-4"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Rows */}
      <section className="relative z-20 -mt-20 sm:-mt-24 space-y-16 max-w-7xl mx-auto px-0 md:px-4">
        {/* Ambient Row Light Reflection */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[90%] h-[300px] radial-glow-gold rounded-full filter blur-[150px] opacity-10 mix-blend-screen pointer-events-none" />
        
        {rows.map((category) => (
          <MovieRow 
            key={category.id} 
            title={category.title} 
            movies={category.items} 
          />
        ))}
      </section>
    </div>
  );
}
