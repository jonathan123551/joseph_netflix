"use client";

import { motion } from "framer-motion";
import {
  Heart, Film, Sparkles, LogOut,
  TrendingUp, BookOpen, ChevronRight
} from "lucide-react";
import { Movie } from "@/lib/api";
import { MovieRow } from "@/components/shared/MovieRow";
import { useAuth } from "@/context/AuthContext";
import { api, UserProfile, Contribution } from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-divine rounded-2xl p-5 relative overflow-hidden group hover:border-gold-500/25 transition-all duration-300"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-60"
        style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
      />
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/30 transition-colors" />
      </div>
      <p className="text-2xl font-bold text-white font-display mb-0.5">{value}</p>
      <p className="text-[11px] text-white/40 font-medium">{label}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [profileStats, setProfileStats] = useState<UserProfile>({
    name: "John Doe",
    email: "guest@josephfilms.com",
    role: "USER",
    purchasedCount: 2,
    totalDonations: 150.0,
  });
  const [purchasedMovies, setPurchasedMovies] = useState<Movie[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

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
        console.warn("Could not load dashboard data, using defaults.");
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
    ? profileStats.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "JD";

  return (
    <div className="min-h-screen bg-[#030306] pt-28 pb-24 overflow-x-hidden relative">
      <div className="grain-overlay" />

      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] radial-glow-gold rounded-full filter blur-[200px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] radial-glow-blue rounded-full filter blur-[180px] opacity-[0.08] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Billboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-10 rounded-[2rem] overflow-hidden glass-divine shadow-[0_30px_80px_rgba(0,0,0,0.6)] p-7 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-7 md:gap-10"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(212,163,89,0.06) 0%, transparent 60%, rgba(255,255,255,0.02) 100%)" }}
          />

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center border-4 border-[#030306]"
              style={{
                background: "linear-gradient(135deg, #a77030, #d4a359, #fbf6eb)",
                boxShadow: "0 0 50px rgba(212,163,89,0.3), 0 0 100px rgba(212,163,89,0.1)",
              }}
            >
              <span className="text-3xl md:text-4xl font-serif font-black text-zinc-950 tracking-tighter">
                {userInitials}
              </span>
            </div>
            <div
              className="absolute -inset-1 rounded-full opacity-40 animate-spin-slow"
              style={{
                background: "conic-gradient(from 0deg, rgba(212,163,89,0.8), transparent, rgba(212,163,89,0.4), transparent)",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
              }}
            />
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #d4a359, #a77030)", color: "#030306" }}
            >
              {profileStats.role === "ADMIN" ? "Admin" : "Patron"}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl md:text-3xl font-serif font-black text-white mb-1"
            >
              {profileStats.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/40 text-sm mb-6"
            >
              {profileStats.email}
            </motion.p>

            <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
              <Link href="/donate">
                <button
                  id="dashboard-donate-btn"
                  className="btn-cinematic flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-zinc-950 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #dfba73, #d4a359)", boxShadow: "0 0 20px rgba(212,163,89,0.3)" }}
                >
                  <Heart className="w-3.5 h-3.5" /> Support Ministry
                </button>
              </Link>
              <Link href="/profile">
                <button
                  id="dashboard-edit-btn"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white/65 hover:text-white transition-all cursor-pointer glass-panel"
                >
                  Edit Profile
                </button>
              </Link>
              <button
                id="dashboard-logout-btn"
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-red-400/65 hover:text-red-400 transition-all cursor-pointer glass-panel"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>

          {/* Bible Quote */}
          <div className="hidden lg:block flex-shrink-0 max-w-xs text-right">
            <blockquote className="text-xs italic leading-relaxed" style={{ color: "rgba(212,163,89,0.5)" }}>
              &ldquo;I am the way, the truth, and the life.&rdquo;
            </blockquote>
            <cite className="text-[10px] text-white/25 not-italic">John 14:6</cite>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard icon={Film}       label="Movies Purchased"   value={profileStats.purchasedCount ?? 0}                    color="#d4a359" delay={0.10} />
          <StatCard icon={Heart}      label="Total Support"      value={`$${(profileStats.totalDonations ?? 0).toFixed(0)}`} color="#f87171" delay={0.18} />
          <StatCard icon={Sparkles}   label="Favorites"          value={favorites.length}                                    color="#a78bfa" delay={0.26} />
          <StatCard icon={TrendingUp} label="Continue Watching"  value={continueWatching.length}                             color="#34d399" delay={0.34} />
        </div>

        {/* Movie Rows */}
        <div className="space-y-2">
          {continueWatching.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
              <MovieRow title="Continue Watching" movies={continueWatching} />
            </motion.div>
          )}
          {purchasedMovies.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
              <MovieRow title="My Library" movies={purchasedMovies} />
            </motion.div>
          )}
          {favorites.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
              <MovieRow title="My Favorites" movies={favorites} />
            </motion.div>
          )}
        </div>

        {/* Contribution History */}
        {contributions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12"
          >
            <div className="flex items-center gap-3 mb-5 px-1">
              <span
                className="w-[3px] h-5 rounded-full flex-shrink-0"
                style={{ background: "linear-gradient(to bottom, #ebd19b, #a77030)" }}
              />
              <h2 className="text-base font-display font-semibold tracking-wider text-white/65">Support History</h2>
            </div>
            <div className="glass-divine rounded-2xl overflow-hidden">
              {contributions.map((contribution: Contribution, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 group hover:bg-white/[0.02] transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #dfba73, #a77030)", boxShadow: "0 0 8px rgba(212,163,89,0.4)" }}
                    />
                    <div>
                      <p className="text-sm text-white/75 font-medium">{(contribution as any).description || "Ministry Support"}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">
                        {(contribution as any).date
                          ? new Date((contribution as any).date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                          : "Recent"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gold-400">${(contribution as any).amount?.toFixed(2) || "0.00"}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && purchasedMovies.length === 0 && favorites.length === 0 && continueWatching.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center py-20"
          >
            <div
              className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: "rgba(212,163,89,0.08)", border: "1px solid rgba(212,163,89,0.15)" }}
            >
              <BookOpen className="w-7 h-7 text-gold-400/50" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white/60 mb-2">Your library is empty</h3>
            <p className="text-sm text-white/30 mb-6">Explore our collection of inspiring Christian films</p>
            <Link href="/">
              <button
                id="dashboard-browse-btn"
                className="btn-cinematic px-7 py-3 rounded-full text-sm font-bold text-zinc-950 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #dfba73, #d4a359)", boxShadow: "0 0 20px rgba(212,163,89,0.3)" }}
              >
                Browse Films
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
