"use client";

import { motion } from "framer-motion";
import { Users, Film, DollarSign, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { api, AdminStats } from "@/lib/api";
import Link from "next/link";

function currency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

interface AdminMovie {
  id: string;
  title: string;
  rating: string;
  year: number;
  posterUrl: string;
  published: boolean;
}

function normalizeMovie(m: any): AdminMovie {
  const poster =
    m.posterUrl ||
    (Array.isArray(m.assets)
      ? m.assets.find((a: any) => a.type === "POSTER")?.url
      : undefined) ||
    "";
  return {
    id: m.id,
    title: m.title,
    rating: m.rating || m.ageRating || "NR",
    year: m.year || (m.releaseDate ? new Date(m.releaseDate).getFullYear() : 2024),
    posterUrl: poster,
    published: m.published !== undefined ? m.published : true,
  };
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, m] = await Promise.all([api.getAdminStats(), api.getAllMovies()]);
        setStats(s);
        setMovies(m.map(normalizeMovie));
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const metrics = [
    { label: "Total Revenue", hint: "Rentals + purchases", value: stats ? currency(stats.totalRevenue) : "\u2014", icon: DollarSign, color: "text-gold-400", bg: "bg-gold-400/10" },
    { label: "Active Users", hint: "Registered patrons", value: stats ? stats.totalUsers.toLocaleString() : "\u2014", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Total Movies", hint: "In the library", value: stats ? stats.totalMovies.toLocaleString() : "\u2014", icon: Film, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Donations", hint: "Ministry support raised", value: stats ? currency(stats.totalDonations) : "\u2014", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-6 relative">
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} shadow-lg`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            {loading ? (
              <div className="h-10 w-28 rounded-lg bg-white/5 animate-pulse" />
            ) : (
              <h3 className="text-4xl font-serif font-black text-white tracking-tight relative text-glow-gold drop-shadow-md">{stat.value}</h3>
            )}
            <p className="text-[10px] text-white/30 mt-2 relative">{stat.hint}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Movies Table */}
      <div className="glass-panel-heavy border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-white">Recent Presentations</h2>
          <Link href="/admin/movies" className="text-xs uppercase tracking-widest font-bold text-gold-400 hover:text-gold-300 transition-colors bg-gold-400/10 px-4 py-2 rounded-lg border border-gold-400/20">View All Library</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="bg-[#030306]/50 text-white/40 text-[10px] uppercase tracking-widest font-bold border-b border-white/5">
              <tr>
                <th className="px-8 py-5">Title</th>
                <th className="px-8 py-5">Rating</th>
                <th className="px-8 py-5">Year</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading &&
                [1, 2, 3, 4].map((i) => (
                  <tr key={`sk-${i}`} className="border-b border-white/5 last:border-0">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded-lg bg-white/5 animate-pulse" />
                        <div className="h-4 w-40 rounded bg-white/5 animate-pulse" />
                      </div>
                    </td>
                    <td className="px-8 py-5"><div className="h-3 w-12 rounded bg-white/5 animate-pulse" /></td>
                    <td className="px-8 py-5"><div className="h-3 w-10 rounded bg-white/5 animate-pulse" /></td>
                    <td className="px-8 py-5"><div className="h-5 w-20 rounded-full bg-white/5 animate-pulse" /></td>
                    <td className="px-8 py-5" />
                  </tr>
                ))}
              {!loading && movies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-white/40 text-sm">
                    No movies yet. Use <span className="text-gold-400 font-semibold">Movies</span> to add your first title.
                  </td>
                </tr>
              )}
              {!loading && movies.slice(0, 5).map((movie) => (
                <tr key={movie.id} className="hover:bg-white/5 transition-colors group cursor-pointer border-b border-white/5 last:border-0">
                  <td className="px-8 py-5 flex items-center gap-4">
                    <div className="w-12 h-16 rounded-lg overflow-hidden border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                      <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-white text-base font-serif">{movie.title}</span>
                  </td>
                  <td className="px-8 py-5 font-medium">{movie.rating}</td>
                  <td className="px-8 py-5 text-white/40 font-medium">{movie.year}</td>
                  <td className="px-8 py-5">
                    {movie.published ? (
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] uppercase tracking-wider font-bold rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">Published</span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-[10px] uppercase tracking-wider font-bold rounded-full border border-yellow-500/20">Draft</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Link href={`/admin/movies?edit=${movie.id}`} className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-gold-400 transition-colors">Manage</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
