"use client";

import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { MovieRow } from "@/components/shared/MovieRow";
import { categories, featuredMovie } from "@/lib/mockData";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 pb-24 overflow-x-hidden">
      {/* Massive Cinematic Hero Section */}
      <section className="relative h-[90vh] md:h-[100vh] w-full flex items-center">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={featuredMovie.bannerUrl}
            alt={featuredMovie.title}
            className="w-full h-full object-cover scale-105"
          />
          {/* Intense vignette and blending gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 md:px-16 w-full max-w-6xl mt-20 md:mt-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            {/* Soft glow behind text */}
            <div className="relative">
              <div className="absolute -inset-8 bg-primary/20 blur-[80px] rounded-full opacity-50" />
              <h1 className="relative text-5xl md:text-7xl lg:text-[6rem] font-bold text-white mb-6 tracking-tighter leading-[1.1] drop-shadow-2xl">
                {featuredMovie.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-4 text-sm md:text-base text-white/80 mb-6 font-medium">
              <span className="text-green-500 font-semibold drop-shadow-md">98% Match</span>
              <span className="drop-shadow-md">{featuredMovie.year}</span>
              <span className="border border-white/30 px-2 py-0.5 rounded text-white/90 shadow-sm">
                {featuredMovie.rating}
              </span>
              <span className="drop-shadow-md">{featuredMovie.duration}</span>
              <span className="border border-white/20 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold shadow-sm">HD</span>
            </div>

            <p className="text-lg md:text-xl text-white/80 drop-shadow-lg mb-10 line-clamp-3 md:line-clamp-4 font-light leading-relaxed max-w-xl">
              {featuredMovie.description}
            </p>

            <div className="flex items-center gap-4">
              <Link href={`/watch/${featuredMovie.id}`}>
                <CinematicButton size="lg" className="gap-3 px-8 md:px-10 h-14 md:h-16 text-lg rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all">
                  <Play className="w-6 h-6 md:w-7 md:h-7 fill-black" />
                  Watch Now
                </CinematicButton>
              </Link>
              <Link href={`/movie/${featuredMovie.id}`}>
                <CinematicButton variant="glass" size="lg" className="gap-3 px-8 md:px-10 h-14 md:h-16 text-lg rounded-xl hover:scale-105 transition-all bg-white/10 border-white/20">
                  <Info className="w-6 h-6 md:w-7 md:h-7" />
                  More Info
                </CinematicButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Rows */}
      <section className="relative z-20 -mt-32 space-y-12 md:space-y-16">
        {categories.map((category) => (
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
