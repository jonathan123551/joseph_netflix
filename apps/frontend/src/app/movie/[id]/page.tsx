"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Plus, ThumbsUp, Heart, ShoppingBag, Tv } from "lucide-react";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { mockMovies } from "@/lib/mockData";
import { MovieRow } from "@/components/shared/MovieRow";

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movie = mockMovies.find(m => m.id === resolvedParams.id) || mockMovies[0];
  const similarMovies = mockMovies.filter(m => m.id !== movie.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 overflow-x-hidden">
      {/* Cinematic Hero Banner */}
      <section className="relative h-[85vh] w-full flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={movie.bannerUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent md:w-3/4" />
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 mt-20">
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start md:items-end">
            {/* Poster */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hidden md:block w-72 lg:w-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20"
              style={{ perspective: 1000 }}
            >
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex-1 max-w-3xl"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl tracking-tighter leading-tight">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/80 mb-8 font-medium">
                <span className="text-green-500 font-semibold drop-shadow">98% Match</span>
                <span className="drop-shadow">{movie.year}</span>
                <span className="border border-white/40 px-2 py-0.5 rounded-sm text-white/90 shadow-sm">{movie.rating}</span>
                <span className="drop-shadow">{movie.duration}</span>
                <span className="border border-white/20 px-1.5 py-0.5 rounded-sm text-[10px] tracking-wider uppercase shadow-sm">HD</span>
              </div>

              {/* Action Buttons (Purchase / Rent / Donate) */}
              <div className="flex flex-wrap gap-4 mb-8">
                <CinematicButton size="lg" className="gap-3 px-8 h-14 bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <ShoppingBag className="w-5 h-5 fill-black" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">Purchase</span>
                    <span>$19.99</span>
                  </div>
                </CinematicButton>
                
                <CinematicButton variant="glass" size="lg" className="gap-3 px-8 h-14 bg-white/10 border-white/20">
                  <Tv className="w-5 h-5" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">Rent</span>
                    <span>$4.99</span>
                  </div>
                </CinematicButton>
                
                <CinematicButton variant="outline" size="lg" className="gap-3 px-8 h-14 border-primary/50 hover:bg-primary/20 hover:border-primary ml-auto group">
                  <Heart className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  Donate to Creator
                </CinematicButton>
              </div>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light mb-8 drop-shadow">
                {movie.description}
              </p>
              
              <div className="space-y-3 text-sm md:text-base text-white/70 font-light border-l-2 border-primary pl-4">
                <p><strong className="text-white font-medium">Cast:</strong> {movie.cast.join(", ")}</p>
                <p><strong className="text-white font-medium">Director:</strong> {movie.director}</p>
                <p><strong className="text-white font-medium">Genres:</strong> {movie.genres.join(", ")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trailer Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 mt-16 mb-20 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Trailer & Extras</h2>
        <div className="relative aspect-video max-w-4xl rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer shadow-2xl">
          <img src={movie.bannerUrl} alt="Trailer" className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              <Play className="w-10 h-10 md:w-12 md:h-12 text-white fill-white ml-2" />
            </div>
          </div>
        </div>
      </section>

      {/* Similar Movies */}
      <section className="mt-12 relative z-10 pb-12">
        <MovieRow title="More Like This" movies={similarMovies} />
      </section>
    </div>
  );
}
