"use client";

import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { MovieRow } from "@/components/shared/MovieRow";
import { categories, featuredMovie } from "@/lib/mockData";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full">
        {/* Background Image & Gradients */}
        <div className="absolute inset-0">
          <img
            src={featuredMovie.bannerUrl}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t-dark" />
          <div className="absolute inset-0 bg-gradient-to-r-dark" />
          <div className="absolute inset-0 bg-black/20" /> {/* Subtle darkening for text legibility */}
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-end px-4 md:px-12 pb-24 md:pb-32 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 drop-shadow-2xl tracking-tighter">
              {featuredMovie.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm md:text-base text-white/80 mb-6 font-medium">
              <span className="text-green-500 font-semibold">98% Match</span>
              <span>{featuredMovie.year}</span>
              <span className="border border-white/40 px-2 py-0.5 rounded-sm text-white/90">
                {featuredMovie.rating}
              </span>
              <span>{featuredMovie.duration}</span>
              <span className="border border-white/20 px-1 rounded-sm text-[10px]">HD</span>
            </div>

            <p className="text-lg md:text-xl text-white/90 drop-shadow-lg mb-8 line-clamp-3 max-w-2xl font-light leading-relaxed">
              {featuredMovie.description}
            </p>

            <div className="flex items-center gap-4">
              <Link href={`/watch/${featuredMovie.id}`}>
                <CinematicButton size="lg" className="gap-2 px-8">
                  <Play className="w-6 h-6 fill-black" />
                  Play
                </CinematicButton>
              </Link>
              <Link href={`/movie/${featuredMovie.id}`}>
                <CinematicButton variant="glass" size="lg" className="gap-2 px-8">
                  <Info className="w-6 h-6" />
                  More Info
                </CinematicButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Rows */}
      <section className="relative z-10 -mt-24 space-y-8">
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
