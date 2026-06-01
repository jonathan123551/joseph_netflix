"use client";

import { motion } from "framer-motion";
import { Settings, CreditCard, History, Heart } from "lucide-react";
import { mockMovies } from "@/lib/mockData";
import { MovieRow } from "@/components/shared/MovieRow";

export default function DashboardPage() {
  const favorites = mockMovies.filter(m => m.rating === "PG-13" || m.rating === "R");
  const purchased = mockMovies.filter(m => m.year === 2023);
  const continueWatching = mockMovies.slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center gap-6 mb-12 border-b border-white/10 pb-8"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-primary/40 flex items-center justify-center overflow-hidden border-2 border-white/20">
            <span className="text-4xl font-bold text-black">JD</span>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John</h1>
            <p className="text-white/60">Premium Member since 2024</p>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
              <Settings className="w-4 h-4" /> Account Settings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
              <CreditCard className="w-4 h-4" /> Billing
            </button>
          </div>
        </motion.div>

        <div className="space-y-12">
          {/* Continue Watching (Cards with Progress Bars) */}
          <section>
            <h2 className="text-2xl font-semibold text-white/90 mb-6 flex items-center gap-2">
              <History className="w-6 h-6 text-primary" /> Continue Watching
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueWatching.map((movie) => (
                <div key={movie.id} className="group relative rounded-lg overflow-hidden border border-white/10 cursor-pointer">
                  <div className="aspect-video relative">
                    <img src={movie.bannerUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-medium">{movie.title}</h3>
                      <p className="text-white/60 text-sm">45m remaining</p>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-zinc-800">
                    <div className="h-full bg-red-600" style={{ width: `${Math.random() * 40 + 30}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Purchased / Library */}
          <section>
            <MovieRow title="Your Library (Purchased)" movies={purchased} />
          </section>

          {/* Favorites */}
          <section>
            <h2 className="text-2xl font-semibold text-white/90 mb-6 px-4 md:px-0 flex items-center gap-2 mt-8">
              <Heart className="w-6 h-6 text-primary" /> My List
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {favorites.map((movie) => (
                <div key={movie.id} className="relative aspect-[2/3] rounded-md overflow-hidden cursor-pointer group">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium text-sm drop-shadow-md">{movie.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        
      </div>
    </div>
  );
}
