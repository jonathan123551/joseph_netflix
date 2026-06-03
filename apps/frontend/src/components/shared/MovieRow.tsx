"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { MovieCard } from "./MovieCard";
import { Movie } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  viewAllHref?: string;
}

export function MovieRow({ title, movies, viewAllHref }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  };

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      rowRef.current.scrollBy({
        left: direction === "left"
          ? -(rowRef.current.clientWidth * 0.75)
          : rowRef.current.clientWidth * 0.75,
        behavior: "smooth",
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  const rowSlug = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="space-y-4 pt-8 group/row">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 md:px-12">
        <h2 className="flex items-center gap-3">
          <span
            className="w-[3px] h-5 rounded-full flex-shrink-0"
            style={{ background: 'linear-gradient(to bottom, #ebd19b, #d4a359, #a77030)' }}
          />
          <span className="text-[15px] md:text-base font-display font-semibold tracking-wider text-white/65 group-hover/row:text-white transition-colors duration-300">
            {title}
          </span>
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] font-semibold text-gold-400/55 hover:text-gold-400 transition-colors group/link"
          >
            See All
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {/* Scrollable Row */}
      <div className="relative group/scroll">
        {/* Left Fade + Arrow */}
        <motion.div
          animate={{ opacity: canScrollLeft ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 top-0 bottom-0 z-20 flex items-center pointer-events-none"
          style={{ width: 80 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, #030306, transparent)' }}
          />
          <button
            id={`row-left-${rowSlug}`}
            onClick={() => handleScroll("left")}
            className="relative z-10 ml-3 w-9 h-9 rounded-full glass-panel-heavy flex items-center justify-center text-white/60 hover:text-white hover:border-gold-400/30 transition-all cursor-pointer pointer-events-auto"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Right Fade + Arrow */}
        <motion.div
          animate={{ opacity: canScrollRight ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-0 bottom-0 z-20 flex items-center justify-end pointer-events-none"
          style={{ width: 80 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to left, #030306, transparent)' }}
          />
          <button
            id={`row-right-${rowSlug}`}
            onClick={() => handleScroll("right")}
            className="relative z-10 mr-3 w-9 h-9 rounded-full glass-panel-heavy flex items-center justify-center text-white/60 hover:text-white hover:border-gold-400/30 transition-all cursor-pointer pointer-events-auto"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Cards */}
        <div
          ref={rowRef}
          onScroll={updateScrollState}
          className="flex gap-3 overflow-x-auto px-4 md:px-12 pb-6 scrollbar-none"
        >
          {movies.map((movie, idx) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0"
              style={{ width: 'clamp(120px, 17vw, 176px)' }}
            >
              <Link href={`/movie/${movie.id}`}>
                <MovieCard movie={movie} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
