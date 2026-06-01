"use client";

import { motion } from "framer-motion";
import { History, Heart, HeartHandshake, Film, Sparkles, User, Award, LogOut } from "lucide-react";
import { mockMovies, Movie } from "@/lib/mockData";
import { MovieRow } from "@/components/shared/MovieRow";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { useAuth } from "@/context/AuthContext";
import { api, UserProfile, Contribution } from "@/lib/api";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [profileStats, setProfileStats] = useState<UserProfile>({
    name: "John Doe",
    email: "guest@josephfilms.com",
    role: "USER",
    purchasedCount: 2,
    totalDonations: 150.00
  });
  const [purchasedMovies, setPurchasedMovies] = useState<Movie[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [stats, library, supportHistory, favs, history] = await Promise.all([
          api.getProfileStats(),
          api.getMyLibrary(),
          api.getMyContributions(),
          api.getFavorites(),
          api.getWatchHistory(),
        ]);
        if (stats) setProfileStats(stats);
        if (library) setPurchasedMovies(library);
        if (supportHistory) setContributions(supportHistory);
        if (favs) setFavorites(favs as Movie[]);
        if (history) setContinueWatching(history);
      } catch (err) {
        console.warn("Could not load dashboard data from API, using default mock presets.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const userInitials = profileStats.name
    ? profileStats.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "JD";

  return (
    <div className="min-h-screen bg-[#030306] pt-32 pb-24 overflow-x-hidden relative">
      {/* Cinematic Film Grain */}
      <div className="grain-overlay" />

      {/* Volumetric glow backdrop */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] radial-glow-gold rounded-full filter blur-[150px] opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] radial-glow-blue rounded-full filter blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Premium Profile Billboard */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-16 rounded-[2.5rem] overflow-hidden border border-white/10 glass-panel-heavy shadow-cinematic p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12"
        >
          {/* Subtle inside gradient background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/5 via-transparent to-white/5 pointer-events-none" />

          {/* Profile Circle Accent */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-300 flex items-center justify-center border-4 border-zinc-950 shadow-[0_0_40px_rgba(212,163,89,0.25)] overflow-hidden">
              <span className="text-3xl md:text-4xl font-serif font-black text-zinc-950 tracking-tighter">
                {userInitials}
              </span>
            </div>
            {/* Patron badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gold-500 border border-gold-400 text-[9px] uppercase tracking-widest font-black text-zinc-950 flex items-center gap-1 shadow-lg">
              <Award className="w-3 h-3" /> Patron
            </div>
          </div>
          
          {/* User Bio and Stats */}
          <div className="text-center md:text-left flex-grow">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 mb-3">
              <Sparkles className="w-3 h-3 text-gold-400" /> Premium Account Space
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif tracking-wide font-extrabold text-white mb-2 leading-tight">
                  {profileStats.name || "Patron Member"}
                </h1>
                <p className="text-white/40 text-xs md:text-sm font-light mb-6">
                  {profileStats.email} • Member since 2024
                </p>
              </div>

              <CinematicButton 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2 self-center sm:self-start border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-400/50"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </CinematicButton>
            </div>
            
            {/* Quick stats with gold accent */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                <Film className="w-4 h-4 text-gold-400" />
                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">Purchased Titles</p>
                  <p className="text-lg font-bold text-white">{profileStats.purchasedCount} Movies</p>
                </div>
              </div>
              
              <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                <HeartHandshake className="w-4 h-4 text-gold-400" />
                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">Ministry Support</p>
                  <p className="text-lg font-bold text-white">${profileStats.totalDonations.toFixed(2)} donated</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Grid / Rows */}
        <div className="space-y-16">
          
          {/* Continue Watching Section */}
          <section className="space-y-6">
            <h2 className="text-lg md:text-xl font-display font-semibold tracking-wider text-white/80 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
              Continue Watching
            </h2>
            
            {continueWatching.length === 0 && (
              <p className="text-white/40 text-sm font-light">
                Nothing in progress yet. Press play on any title and it will appear here.
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {continueWatching.map((movie, i) => {
                let progressPercent = 75;
                if (movie.progressSecs && movie.duration) {
                  const mins = parseInt(movie.duration) || 120;
                  const totalSecs = mins * 60;
                  progressPercent = Math.min(100, Math.max(0, (movie.progressSecs / totalSecs) * 100));
                }

                return (
                  <Link href={`/movie/${movie.id}`} key={movie.id} className="block">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: i * 0.15 }}
                      className="group relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer bg-zinc-950/60 shadow-lg"
                    >
                      <div className="aspect-video relative">
                        <img 
                          src={movie.bannerUrl} 
                          alt={movie.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                            <History className="w-6 h-6 text-white ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-6 right-6">
                          <span className="text-[9px] uppercase tracking-widest font-bold text-gold-400">
                            {movie.remainingLabel || "45 Minutes Remaining"}
                          </span>
                          <h3 className="text-white font-serif font-bold text-lg md:text-xl drop-shadow-md mt-1">{movie.title}</h3>
                        </div>
                      </div>
                      {/* Premium red-gold stream bar indicator */}
                      <div className="w-full h-1 bg-zinc-900">
                        <div 
                          className="h-full bg-gradient-to-r from-gold-500 to-gold-400 relative"
                          style={{ width: `${progressPercent}%` }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gold-400 rounded-full shadow-[0_0_8px_rgba(212,163,89,0.8)]" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Purchased Content Rows */}
          <section className="-mx-4 md:-mx-8">
            <MovieRow 
              title="My Purchased Presentations" 
              movies={purchasedMovies.length > 0 ? purchasedMovies : mockMovies.filter(m => m.year === 2023)} 
            />
          </section>

          {/* Wishlist / My List Grid */}
          <section className="space-y-6">
            <h2 className="text-lg md:text-xl font-display font-semibold tracking-wider text-white/80 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
              Watchlist & Favorites
            </h2>
            
            {favorites.length === 0 && (
              <p className="text-white/40 text-sm font-light">
                Your list is empty. Tap “Add” on any film to save it here.
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {favorites.map((movie, index) => (
                <motion.div 
                  key={movie.id}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer group shadow-lg border border-white/5 bg-zinc-950"
                >
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  {/* Expanded Hover Cover */}
                  <div className="absolute inset-0 bg-[#030306]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <h3 className="text-white font-serif font-bold text-sm leading-snug">{movie.title}</h3>
                    <p className="text-[10px] text-gold-400 font-semibold mt-1">{movie.year}</p>
                    
                    <Link href={`/movie/${movie.id}`} className="mt-4">
                      <CinematicButton variant="gold" size="sm" className="w-full text-[9px] uppercase tracking-widest py-2 h-auto rounded-lg">
                        Details
                      </CinematicButton>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Premium Donation History - Styled as elegant Receipt Ledger */}
          <section className="space-y-6">
            <h2 className="text-lg md:text-xl font-display font-semibold tracking-wider text-white/80 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
              Patronage & Ministry Ledger
            </h2>
            
            <div className="glass-panel rounded-3xl border-white/10 p-6 md:p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6 mb-6">
                <div>
                  <h3 className="text-white font-serif font-bold text-lg">Direct Creator Impact</h3>
                  <p className="text-xs text-white/40 font-light mt-0.5">Your support history directly impacts Christian filmmaking ministries.</p>
                </div>
                <div className="mt-4 md:mt-0 text-[10px] font-bold uppercase tracking-wider text-gold-400 px-3 py-1 rounded bg-gold-500/10 border border-gold-500/20">
                  Total Donated: ${profileStats.totalDonations.toFixed(2)}
                </div>
              </div>

              <div className="space-y-4">
                {contributions.map((donation, i) => (
                  <div 
                    key={donation.id || i} 
                    className="flex flex-col sm:flex-row justify-between sm:items-center py-4 border-b border-white/5 last:border-0 last:pb-0"
                  >
                    <div>
                      <h4 className="text-white font-medium text-sm flex items-center gap-2">
                        {donation.org}
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-white/30">{donation.invoice}</span>
                      </h4>
                      <p className="text-xs text-white/50 font-light mt-0.5">{donation.campaign} • {donation.date}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <div className="text-sm font-bold text-gold-400 text-glow-gold">{donation.amount}</div>
                      <div className="text-[8px] font-bold text-green-500/80 uppercase tracking-widest mt-0.5">Disbursed</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
