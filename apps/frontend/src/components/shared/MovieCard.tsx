"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Play, Plus, ThumbsUp, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { Movie } from "@/lib/mockData";
import { api } from "@/lib/api";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for the 3D tilt effect
  const x = useMotionValue(200);
  const y = useMotionValue(100);
  
  // Transform values for tilt angles (rotates up to 10 degrees)
  const rotateX = useTransform(y, [0, 200], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);
  
  // Reflection highlights
  const glareX = useTransform(x, [0, 400], ["0%", "100%"]);
  const glareY = useTransform(y, [0, 200], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset tilt
    x.set(200);
    y.set(100);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[16/9] cursor-pointer perspective-1000 z-10"
    >
      <motion.div
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? 1.05 : 1,
          z: isHovered ? 40 : 0,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={`relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-shadow duration-300 ${
          isHovered ? "shadow-[0_20px_50px_rgba(0,0,0,0.8),_0_0_30px_rgba(212,163,89,0.15)] border-white/10" : "border-white/5"
        } border bg-zinc-950`}
      >
        {/* Poster Image */}
        <img
          src={movie.bannerUrl}
          alt={movie.title}
          className="w-full h-full object-cover select-none transition-transform duration-700 ease-out"
          style={{
            transform: isHovered ? "scale(1.08)" : "scale(1)",
          }}
          loading="lazy"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
        
        {/* Dynamic Interactive Light Glare Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 select-none bg-[radial-gradient(circle_at_var(--glare-x)_var(--glare-y),rgba(255,255,255,0.15)_0%,transparent_50%)]"
          style={{
            opacity: isHovered ? 1 : 0,
            // CSS custom variables hooked into motion transforms
            "--glare-x": glareX,
            "--glare-y": glareY,
          } as any}
          transition={{ duration: 0.2 }}
        />

        {/* Cinematic Title & Meta overlay (Visible always at bottom, cleaner design) */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
          isHovered ? "bg-zinc-950/90 backdrop-blur-md translate-y-0" : "bg-gradient-to-t from-zinc-950 to-transparent"
        }`}>
          <h3 className="text-white font-serif tracking-wide text-sm md:text-base font-bold line-clamp-1 text-glow">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-1.5 text-[10px] font-medium text-white/70">
            <span className="text-gold-400 font-semibold">{movie.year}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="border border-white/20 px-1 py-0.2 rounded-[3px] text-[9px] scale-90 origin-left text-white/90">
              {movie.rating}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{movie.duration}</span>
          </div>

          {/* Interactive options expanded on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Link href={`/movie/${movie.id}`} className="flex-shrink-0">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-gold-300 transition-colors shadow-lg cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-zinc-950 fill-zinc-950 ml-0.5" />
                    </motion.button>
                  </Link>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={async (e) => {
                      e.stopPropagation();
                      const nextState = !isAdded;
                      setIsAdded(nextState);
                      try {
                        if (nextState) {
                          await api.addFavorite(movie.id);
                        } else {
                          await api.removeFavorite(movie.id);
                        }
                      } catch (err) {
                        setIsAdded(!nextState);
                        console.error("Failed to toggle favorite", err);
                      }
                    }}
                    className="w-7 h-7 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:border-white transition-colors cursor-pointer"
                  >
                    {isAdded ? (
                      <Check className="w-3.5 h-3.5 text-gold-400" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-white/80" />
                    )}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-7 h-7 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:border-white transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3 text-white/80" />
                  </motion.button>
                </div>
                
                <Link href={`/movie/${movie.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-gold-400 hover:text-white font-bold transition-colors cursor-pointer"
                  >
                    Details <ChevronDown className="w-3 h-3" />
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
