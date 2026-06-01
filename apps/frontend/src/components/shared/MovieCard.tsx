"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Movie } from "@/lib/mockData";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  let hoverTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    hoverTimeout = setTimeout(() => setIsHovered(true), 400); // 400ms delay to prevent accidental hovers while scrolling
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setIsHovered(false);
  };

  return (
    <div 
      className="relative w-full aspect-[16/9] rounded-xl z-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={movie.bannerUrl}
        alt={movie.title}
        className="w-full h-full object-cover rounded-xl"
        loading="lazy"
      />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1.3 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] rounded-xl bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] border border-white/20 overflow-hidden"
          >
            {/* Expanded Hover Card Image */}
            <div className="relative aspect-[16/9] w-full">
              <img
                src={movie.bannerUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              
              {/* Optional embedded title treatment */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 drop-shadow-md">
                  {movie.title}
                </h3>
              </div>
            </div>

            {/* Expanded Hover Card Details */}
            <div className="p-4 space-y-3 bg-zinc-950">
              <div className="flex items-center gap-2">
                <Link href={`/watch/${movie.id}`}>
                  <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/80 transition-colors">
                    <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                  </button>
                </Link>
                <button className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:border-white transition-colors group">
                  <Plus className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </button>
                <button className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:border-white transition-colors group">
                  <ThumbsUp className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </button>
                
                <div className="flex-1" />
                
                <Link href={`/movie/${movie.id}`}>
                  <button className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:border-white transition-colors group">
                    <ChevronDown className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-white/80">
                <span className="text-green-500 font-semibold drop-shadow-sm">98% Match</span>
                <span className="border border-white/30 px-1 rounded-sm text-white/90">
                  {movie.rating}
                </span>
                <span>{movie.duration}</span>
                <span className="border border-white/20 px-1 rounded-sm text-[8px] uppercase tracking-wider">HD</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-white/60 line-clamp-1 font-light">
                {movie.genres.map((genre, index) => (
                  <span key={genre} className="flex items-center gap-1.5">
                    {genre}
                    {index < movie.genres.length - 1 && <span className="w-1 h-1 rounded-full bg-white/30" />}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
