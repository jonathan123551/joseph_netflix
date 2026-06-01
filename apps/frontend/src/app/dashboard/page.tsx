"use client";

import { motion } from "framer-motion";
import { Settings, Heart, History, Play, HeartHandshake, Film } from "lucide-react";
import { mockMovies } from "@/lib/mockData";
import { MovieRow } from "@/components/shared/MovieRow";

export default function DashboardPage() {
  const favorites = mockMovies.filter(m => m.rating === "PG-13" || m.rating === "R").slice(0, 5);
  const purchased = mockMovies.filter(m => m.year === 2023);
  const continueWatching = mockMovies.slice(0, 2);

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-20 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        
        {/* Premium Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 bg-zinc-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
          
          <div className="relative">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-primary to-primary/40 flex items-center justify-center overflow-hidden border-[4px] border-zinc-950 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <span className="text-4xl md:text-5xl font-bold text-black tracking-tighter">JD</span>
            </div>
            <button className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-center md:text-left flex-1 mt-2">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">John Doe</h1>
            <p className="text-white/60 mb-6 font-light">john.doe@example.com</p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-white/50 text-sm mb-1 font-medium uppercase tracking-wider">
                  <Film className="w-4 h-4" /> Purchased
                </div>
                <div className="text-3xl font-bold text-white">12</div>
              </div>
              <div className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-white/50 text-sm mb-1 font-medium uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4 text-primary" /> Donations
                </div>
                <div className="text-3xl font-bold text-white">$450</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-16">
          {/* Continue Watching */}
          <section>
            <h2 className="text-2xl font-semibold text-white/90 mb-8 flex items-center gap-3">
              <History className="w-6 h-6 text-white/50" /> Continue Watching
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {continueWatching.map((movie, i) => (
                <motion.div 
                  key={movie.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer bg-zinc-900/50"
                >
                  <div className="aspect-video relative">
                    <img src={movie.bannerUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <div>
                        <h3 className="text-white font-bold text-xl drop-shadow-md mb-1">{movie.title}</h3>
                        <p className="text-white/70 text-sm font-medium drop-shadow-md">45m remaining</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800">
                    <div className="h-full bg-red-600 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Purchased Library */}
          <section>
            <MovieRow title="Purchased Library" movies={purchased} />
          </section>

          {/* Favorites */}
          <section>
            <h2 className="text-2xl font-semibold text-white/90 mb-8 flex items-center gap-3 mt-8">
              <Heart className="w-6 h-6 text-primary" /> My List
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {favorites.map((movie) => (
                <div key={movie.id} className="relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer group shadow-lg border border-white/10">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <h3 className="text-white font-bold text-sm drop-shadow-md line-clamp-2">{movie.title}</h3>
                    <p className="text-white/50 text-xs mt-1">{movie.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity / Donations */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-primary" /> Recent Donations
            </h2>
            <div className="space-y-4">
              {[
                { org: "Angel Studios", amount: "$50.00", date: "Oct 12, 2024" },
                { org: "The Chosen Season 5", amount: "$100.00", date: "Sep 28, 2024" },
                { org: "Jesus Revolution Creators", amount: "$25.00", date: "Aug 15, 2024" },
              ].map((donation, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-white/10 last:border-0 last:pb-0">
                  <div>
                    <h4 className="text-white font-medium">{donation.org}</h4>
                    <p className="text-white/50 text-sm">{donation.date}</p>
                  </div>
                  <div className="text-lg font-bold text-primary">{donation.amount}</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
