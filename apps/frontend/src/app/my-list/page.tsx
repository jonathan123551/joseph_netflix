"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MovieCard } from "@/components/shared/MovieCard";
import { api } from "@/lib/api";
import { Movie } from "@/lib/api";
import { Film, PlayCircle } from "lucide-react";

export default function MyListPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [favData, historyData] = await Promise.all([
          api.getFavorites().catch(() => []),
          api.getWatchHistory().catch(() => []),
        ]);
        
        // For fallback if API fails
        if (favData.length > 0) {
          setFavorites(favData);
        } else {
          setFavorites([]);
        }

        if (historyData.length > 0) {
          setContinueWatching(historyData);
        } else {
          setContinueWatching([]);
        }
      } catch (err) {
        console.error("Failed to load my-list data", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#030306] pb-24 relative overflow-x-hidden pt-32">
      <div className="grain-overlay" />
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030306]/80 to-[#030306]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-wide">My List</h1>
          <p className="text-white/50 text-sm max-w-xl">
            Your saved Christian presentations and active watch sessions, synced across all your devices.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-16">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-5 h-5 rounded-full bg-white/5 animate-pulse" />
                <div className="w-48 h-6 rounded-md bg-white/5 animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full aspect-[16/9] rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            </section>
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-5 h-5 rounded-full bg-white/5 animate-pulse" />
                <div className="w-40 h-6 rounded-md bg-white/5 animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full aspect-[16/9] rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Continue Watching Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <PlayCircle className="w-5 h-5 text-gold-400" />
                <h2 className="text-xl font-bold text-white tracking-wide">Continue Watching</h2>
              </div>
              
              {continueWatching.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {continueWatching.map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <MovieCard movie={movie} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<PlayCircle className="w-8 h-8 text-white/20" />}
                  message="No active watch sessions yet."
                  hint="Press play on any film and it'll pick up right here."
                />
              )}
            </section>

            {/* Favorites Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Film className="w-5 h-5 text-gold-400" />
                <h2 className="text-xl font-bold text-white tracking-wide">Saved to Favorites</h2>
              </div>
              
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {favorites.map((movie, index) => (
                      <motion.div
                        key={movie.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <MovieCard movie={movie} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <EmptyState
                  icon={<Film className="w-8 h-8 text-white/20" />}
                  message="Your watchlist is empty."
                  hint="Tap the heart on any film to save it here for later."
                  cta
                />
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  message,
  hint,
  cta,
}: {
  icon: React.ReactNode;
  message: string;
  hint?: string;
  cta?: boolean;
}) {
  return (
    <div className="w-full py-16 px-6 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-white/60 font-semibold text-sm">{message}</p>
      {hint && <p className="text-white/30 text-xs max-w-xs">{hint}</p>}
      {cta && (
        <Link href="/">
          <button className="mt-2 btn-cinematic px-6 py-2.5 rounded-full text-xs font-bold text-zinc-950 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #dfba73, #d4a359)', boxShadow: '0 0 20px rgba(212,163,89,0.25)' }}>
            Browse Films
          </button>
        </Link>
      )}
    </div>
  );
}
