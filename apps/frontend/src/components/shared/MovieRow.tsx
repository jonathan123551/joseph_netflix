"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";
import type { Movie } from "@/lib/mockData";

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
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-2 md:space-y-4 pt-6 group/row">
      <h2 className="text-xl md:text-2xl font-semibold text-white/90 px-4 md:px-12 transition-colors group-hover/row:text-white">
        {title}
      </h2>
      
      <div className="relative group">
        {/* Left Arrow */}
        <button
          className={`absolute left-0 top-0 bottom-0 w-12 bg-black/50 z-40 opacity-0 transition-all hover:bg-black/70 hover:w-16 flex items-center justify-center
            ${isScrolled ? "group-hover:opacity-100" : "hidden"}
          `}
          onClick={() => handleScroll("left")}
        >
          <ChevronLeft className="w-8 h-8 text-white transition-transform hover:scale-125" />
        </button>

        {/* Scroll Container */}
        <div 
          ref={rowRef}
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollLeft > 0)}
          className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar px-4 md:px-12 pb-8 pt-4 -mt-4 snap-x"
        >
          {movies.map((movie, index) => (
            <div key={movie.id} className="snap-start">
              <MovieCard movie={movie} index={index} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-0 top-0 bottom-0 w-12 bg-black/50 z-40 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:w-16 flex items-center justify-center"
          onClick={() => handleScroll("right")}
        >
          <ChevronRight className="w-8 h-8 text-white transition-transform hover:scale-125" />
        </button>
      </div>
    </div>
  );
}
