"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";
import { Movie } from "@/lib/api";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-4 pt-4 group/row">
      {/* Cinematic Heading with Outfits display font */}
      <h2 className="text-lg md:text-xl font-display font-semibold tracking-wider text-white/80 px-4 md:px-12 transition-colors duration-300 group-hover/row:text-white flex items-center gap-3">
        <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
        {title}
      </h2>
      
      <div className="relative group/arrows">
        {/* Left Arrow with Frosted Blur */}
        <button
          className={`absolute left-0 top-0 bottom-0 w-12 bg-black/40 backdrop-blur-md z-30 opacity-0 group-hover/arrows:opacity-100 transition-all duration-300 hover:bg-black/70 flex items-center justify-center border-r border-white/5
            ${isScrolled ? "pointer-events-auto" : "pointer-events-none !opacity-0"}
          `}
          onClick={() => handleScroll("left")}
        >
          <ChevronLeft className="w-6 h-6 text-white transition-transform hover:scale-125" />
        </button>

        {/* Scroll Container with cards sized correctly */}
        <div 
          ref={rowRef}
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollLeft > 10)}
          className="flex items-center gap-4 overflow-x-auto no-scrollbar px-4 md:px-12 pb-6 pt-2 snap-x"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="snap-start shrink-0 w-[240px] sm:w-[280px] md:w-[320px]"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Right Arrow with Frosted Blur */}
        <button
          className="absolute right-0 top-0 bottom-0 w-12 bg-black/40 backdrop-blur-md z-30 opacity-0 group-hover/arrows:opacity-100 transition-all duration-300 hover:bg-black/70 flex items-center justify-center border-l border-white/5"
          onClick={() => handleScroll("right")}
        >
          <ChevronRight className="w-6 h-6 text-white transition-transform hover:scale-125" />
        </button>
      </div>
    </div>
  );
}
