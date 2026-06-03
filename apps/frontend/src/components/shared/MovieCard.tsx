"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Play, Plus, Heart, Check, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Movie } from "@/lib/api";
import { api } from "@/lib/api";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isFaved, setIsFaved] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(200);
  const y = useMotionValue(100);
  const rotateX = useTransform(y, [0, 200], [7, -7]);
  const rotateY = useTransform(x, [0, 400], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    x.set(mx * 2);
    y.set(my * 2);
    setMousePos({ x: mx, y: my });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(200);
    y.set(100);
    setMousePos({ x: 0, y: 0 });
  };

  const handleAddToList = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isAdded;
    setIsAdded(next);
    try {
      if (next) await api.addFavorite(movie.id);
      else await api.removeFavorite(movie.id);
    } catch (_e) {}
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isFaved;
    setIsFaved(next);
    try {
      if (next) await api.addFavorite(movie.id);
    } catch (_e) {}
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full cursor-pointer"
      style={{ aspectRatio: "2/3", perspective: "1000px" }}
    >
      <motion.div
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? 1.04 : 1,
          zIndex: isHovered ? 40 : 10,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className={`relative w-full h-full rounded-xl overflow-hidden border transition-shadow duration-300 bg-zinc-900 ${
          isHovered
            ? "shadow-[0_22px_65px_rgba(0,0,0,0.85),0_0_32px_rgba(212,163,89,0.14)] border-gold-500/[0.22]"
            : "border-white/[0.06] shadow-[0_6px_28px_rgba(0,0,0,0.55)]"
        }`}
      >
        {/* Poster */}
        <img
          src={(movie as any).thumbnailUrl || movie.bannerUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: isHovered ? "scale(1.07)" : "scale(1)" }}
          loading="lazy"
        />

        {/* Cross badge */}
        <div
          className="absolute top-2 right-2 transition-opacity duration-300"
          style={{ opacity: isHovered ? 0.65 : 0.3 }}
        >
          <div className="w-4 h-4 relative flex items-center justify-center">
            <div className="absolute w-[1.5px] h-4 rounded-full"
              style={{ background: "linear-gradient(to bottom, #ebd19b, #d4a359)" }} />
            <div className="absolute w-2.5 h-[1.5px] rounded-full"
              style={{ background: "linear-gradient(to right, #ebd19b, #d4a359)", top: "27%" }} />
          </div>
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(3,3,6,0.92) 0%, rgba(3,3,6,0.35) 45%, transparent 100%)" }}
        />

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.p
                key="title"
                initial={false}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="text-[11px] font-semibold text-white/75 line-clamp-2 leading-snug"
              >
                {movie.title}
              </motion.p>
            ) : (
              <motion.div
                key="overlay"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-2"
              >
                <p className="text-xs font-bold text-white line-clamp-2 leading-snug">{movie.title}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(movie as any).year && <span className="text-[9px] text-white/38 font-medium">{(movie as any).year}</span>}
                  {(movie as any).genre && (
                    <span className="px-1.5 py-px rounded text-[8px] font-semibold text-gold-400/80"
                      style={{ background: "rgba(212,163,89,0.1)", border: "1px solid rgba(212,163,89,0.18)" }}>
                      {(movie as any).genre}
                    </span>
                  )}
                  {(movie as any).rating && (
                    <div className="flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-gold-400 text-gold-400" />
                      <span className="text-[9px] text-white/38">{(movie as any).rating}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <Link href={`/watch/${movie.id}`} onClick={e => e.stopPropagation()}>
                    <button
                      id={`card-play-${movie.id}`}
                      className="flex items-center justify-center w-7 h-7 rounded-full cursor-pointer transition-colors"
                      style={{ background: "white" }}
                      aria-label={`Play ${movie.title}`}
                    >
                      <Play className="w-3 h-3 fill-zinc-900 text-zinc-900" />
                    </button>
                  </Link>
                  <button
                    id={`card-add-${movie.id}`}
                    onClick={handleAddToList}
                    className="flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: isAdded ? "rgba(212,163,89,0.7)" : "rgba(255,255,255,0.28)",
                      background: isAdded ? "rgba(212,163,89,0.12)" : "transparent",
                      color: isAdded ? "#dfba73" : "rgba(255,255,255,0.55)",
                    }}
                    aria-label={isAdded ? "Remove from list" : "Add to list"}
                  >
                    {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </button>
                  <button
                    id={`card-fav-${movie.id}`}
                    onClick={handleFavorite}
                    className="flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: isFaved ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.28)",
                      background: isFaved ? "rgba(248,113,113,0.1)" : "transparent",
                      color: isFaved ? "rgba(248,113,113,0.9)" : "rgba(255,255,255,0.55)",
                    }}
                    aria-label={isFaved ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`w-3 h-3 ${isFaved ? "fill-current" : ""}`} />
                  </button>
                  <Link href={`/movie/${movie.id}`} onClick={e => e.stopPropagation()} className="ml-auto">
                    <button
                      id={`card-info-${movie.id}`}
                      className="flex items-center justify-center w-7 h-7 rounded-full border border-white/18 text-white/40 hover:text-white hover:border-white/40 transition-all cursor-pointer"
                      aria-label={`More info about ${movie.title}`}
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Glare */}
        {isHovered && mousePos.x > 0 && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.07) 0%, transparent 55%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
