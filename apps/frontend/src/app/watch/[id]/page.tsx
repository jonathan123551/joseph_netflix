"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Maximize, Volume2, Settings, SkipForward } from "lucide-react";
import { mockMovies } from "@/lib/mockData";
import { MovieRow } from "@/components/shared/MovieRow";

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movie = mockMovies.find(m => m.id === resolvedParams.id) || mockMovies[0];
  const recommended = mockMovies.filter(m => m.id !== movie.id).slice(2, 7);

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player Area */}
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-black group">
        {/* Placeholder Video Background */}
        <img 
          src={movie.bannerUrl} 
          alt={movie.title}
          className="w-full h-full object-cover opacity-50"
        />
        
        {/* Top Overlay - Back Button */}
        <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <Link href={`/movie/${movie.id}`} className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors">
            <ArrowLeft className="w-8 h-8" />
            <span className="text-lg font-medium tracking-wide">Back to Browse</span>
          </Link>
        </div>

        {/* Center Play Button (Simulated Paused State) */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 md:w-24 md:h-24 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
          >
            <Play className="w-10 h-10 md:w-12 md:h-12 fill-current ml-2" />
          </motion.button>
        </div>

        {/* Bottom Player Controls */}
        <div className="absolute bottom-0 left-0 w-full px-6 py-8 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col gap-4">
          
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
            <div className="h-full bg-red-600 w-1/3 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-6">
              <button><Play className="w-8 h-8 fill-white" /></button>
              <button><SkipForward className="w-7 h-7 fill-white" /></button>
              <button><Volume2 className="w-7 h-7" /></button>
              <div className="text-lg font-medium ml-4">
                {movie.title}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-white/70 font-mono">0:45:12 / {movie.duration}</span>
              <button><Settings className="w-7 h-7" /></button>
              <button><Maximize className="w-7 h-7" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Below Player */}
      <div className="py-12 bg-zinc-950">
        <div className="max-w-[1400px] mx-auto">
          <MovieRow title="More Like This" movies={recommended} />
        </div>
      </div>
    </div>
  );
}
