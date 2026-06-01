"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import type { Movie } from "@/lib/mockData";

export function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group w-64 h-36 md:w-72 md:h-40 flex-shrink-0 cursor-pointer rounded-md overflow-hidden"
    >
      {/* Base Image */}
      <img
        src={movie.bannerUrl}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Overlay gradient always present at bottom for title legibility if needed, but Netflix usually hides title on hover and shows it in the expanded card */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300 flex items-end p-4">
        <h3 className="text-white font-semibold text-sm md:text-base drop-shadow-md line-clamp-1">{movie.title}</h3>
      </div>

      {/* Hover Card (Expands slightly and shows actions) */}
      <motion.div
        className="absolute inset-0 bg-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 border border-white/10 rounded-md shadow-2xl"
        whileHover={{ scale: 1.1, zIndex: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative w-full h-20 md:h-24 -mt-3 -mx-3 mb-2 rounded-t-md overflow-hidden">
           <img
            src={movie.bannerUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link href={`/watch/${movie.id}`} className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition-colors">
              <Play className="w-4 h-4 text-black ml-0.5" />
            </Link>
            <button className="w-8 h-8 bg-zinc-800 border border-white/20 rounded-full flex items-center justify-center hover:border-white transition-colors">
              <Plus className="w-4 h-4 text-white" />
            </button>
            <button className="w-8 h-8 bg-zinc-800 border border-white/20 rounded-full flex items-center justify-center hover:border-white transition-colors">
              <ThumbsUp className="w-4 h-4 text-white" />
            </button>
            <div className="flex-1" />
            <Link href={`/movie/${movie.id}`} className="w-8 h-8 bg-zinc-800 border border-white/20 rounded-full flex items-center justify-center hover:border-white transition-colors">
              <ChevronDown className="w-4 h-4 text-white" />
            </Link>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-green-500">98% Match</span>
            <span className="border border-white/40 px-1 text-white/70">{movie.rating}</span>
            <span className="text-white/90">{movie.duration}</span>
            <span className="border border-white/20 px-1 rounded-sm text-white/50 text-[10px]">HD</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] text-white/70">
            {movie.genres.map((genre, i) => (
              <React.Fragment key={genre}>
                <span>{genre}</span>
                {i < movie.genres.length - 1 && <span className="w-1 h-1 rounded-full bg-white/30" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
