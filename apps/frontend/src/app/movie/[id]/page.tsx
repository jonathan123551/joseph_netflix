"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Plus, ThumbsUp, Heart } from "lucide-react";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { mockMovies } from "@/lib/mockData";
import { MovieRow } from "@/components/shared/MovieRow";

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movie = mockMovies.find(m => m.id === resolvedParams.id) || mockMovies[0];
  const similarMovies = mockMovies.filter(m => m.id !== movie.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Hero Banner */}
      <section className="relative h-[70vh] md:h-[80vh] w-full">
        <div className="absolute inset-0">
          <img
            src={movie.bannerUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t-dark" />
          <div className="absolute inset-0 bg-gradient-to-r-dark" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" /> {/* Extra blur for details page */}
        </div>

        <div className="relative h-full flex flex-col justify-end px-4 md:px-12 pb-12 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* Poster */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hidden md:block w-64 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl border border-white/10"
            >
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl tracking-tighter">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/80 mb-6 font-medium">
                <span className="text-green-500 font-semibold">98% Match</span>
                <span>{movie.year}</span>
                <span className="border border-white/40 px-2 py-0.5 rounded-sm text-white/90">{movie.rating}</span>
                <span>{movie.duration}</span>
                <span className="border border-white/20 px-1 rounded-sm text-[10px]">HD</span>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link href={`/watch/${movie.id}`}>
                  <CinematicButton size="lg" className="gap-2 px-8">
                    <Play className="w-6 h-6 fill-black" />
                    Play
                  </CinematicButton>
                </Link>
                <CinematicButton variant="glass" size="lg" className="gap-2 px-6">
                  <Plus className="w-5 h-5" />
                  My List
                </CinematicButton>
                <CinematicButton variant="glass" size="icon" className="rounded-full w-12 h-12">
                  <ThumbsUp className="w-5 h-5" />
                </CinematicButton>
                <CinematicButton variant="outline" size="lg" className="gap-2 px-6 ml-auto border-primary/50 hover:bg-primary/20">
                  <Heart className="w-5 h-5 text-primary" />
                  Donate to Creator
                </CinematicButton>
              </div>

              <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-3xl font-light">
                {movie.description}
              </p>
              
              <div className="mt-6 space-y-2 text-sm text-white/60">
                <p><span className="text-white/40">Cast:</span> {movie.cast.join(", ")}</p>
                <p><span className="text-white/40">Director:</span> {movie.director}</p>
                <p><span className="text-white/40">Genres:</span> {movie.genres.join(", ")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trailer Section (Placeholder) */}
      <section className="max-w-5xl mx-auto px-4 md:px-12 mt-12 mb-16">
        <h2 className="text-2xl font-semibold text-white mb-6">Trailer & Extras</h2>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer">
          <img src={movie.bannerUrl} alt="Trailer" className="w-full h-full object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transition-transform duration-300 group-hover:scale-110">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Similar Movies */}
      <section className="mt-12">
        <MovieRow title="More Like This" movies={similarMovies} />
      </section>
    </div>
  );
}
