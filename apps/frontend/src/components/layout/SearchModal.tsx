"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { mockMovies } from "@/lib/mockData";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const results = query.trim() === "" 
    ? [] 
    : mockMovies.filter(m => 
        m.title.toLowerCase().includes(query.toLowerCase()) || 
        m.cast.some(c => c.toLowerCase().includes(query.toLowerCase())) ||
        m.genres.some(g => g.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
            <div className="flex-1 relative flex items-center">
              <Search className="w-6 h-6 text-white/50 absolute left-4" />
              <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, cast, or genres..."
                className="w-full bg-transparent border-b-2 border-white/20 px-14 py-4 text-2xl md:text-4xl text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors font-light"
              />
              {query && (
                <button 
                  onClick={() => setQuery("")}
                  className="absolute right-4 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
            <div className="max-w-5xl mx-auto">
              {query.trim() !== "" && results.length === 0 && (
                <div className="text-center text-white/50 py-20 text-xl font-light">
                  No results found for "{query}"
                </div>
              )}
              
              {results.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {results.map((movie, i) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link href={`/movie/${movie.id}`} onClick={onClose} className="block group">
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-white/10 shadow-lg">
                          <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium text-sm">View</span>
                          </div>
                        </div>
                        <h3 className="text-white mt-3 font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h3>
                        <p className="text-white/50 text-xs mt-1">{movie.year} • {movie.rating}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
