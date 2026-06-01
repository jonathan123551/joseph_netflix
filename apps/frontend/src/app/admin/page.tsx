"use client";

import { motion } from "framer-motion";
import { Users, Film, DollarSign, TrendingUp, Search, Bell, Settings } from "lucide-react";
import { mockMovies } from "@/lib/mockData";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900/50 border-r border-white/10 flex-shrink-0 p-6 flex flex-col gap-8 hidden md:flex">
        <div className="space-y-6">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">Overview</div>
          <nav className="flex flex-col gap-2">
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-md font-medium">
              <TrendingUp className="w-5 h-5" /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors font-medium">
              <Film className="w-5 h-5" /> Movies
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors font-medium">
              <Users className="w-5 h-5" /> Users
            </a>
          </nav>
        </div>
        
        <div className="mt-auto space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors font-medium">
            <Settings className="w-5 h-5" /> Settings
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-white/60 text-sm">Manage movies, users, and platform settings.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search admin..." 
                className="pl-9 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <button className="w-9 h-9 flex items-center justify-center rounded-md bg-zinc-900 border border-white/10 text-white/70 hover:text-white">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Revenue", value: "$45,231.89", icon: DollarSign, color: "text-green-500" },
            { label: "Active Users", value: "+2350", icon: Users, color: "text-blue-500" },
            { label: "Total Movies", value: "142", icon: Film, color: "text-purple-500" },
            { label: "Platform Growth", value: "+12.5%", icon: TrendingUp, color: "text-primary" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/50 border border-white/10 rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-white/60 text-sm font-medium">{stat.label}</p>
                <div className={`p-2 bg-white/5 rounded-md ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Recent Movies Table */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Recent Movies</h2>
            <button className="text-sm font-medium text-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-white/5 text-white/90">
                <tr>
                  <th className="px-6 py-4 font-medium">Movie</th>
                  <th className="px-6 py-4 font-medium">Rating</th>
                  <th className="px-6 py-4 font-medium">Year</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {mockMovies.slice(0, 5).map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={movie.posterUrl} alt={movie.title} className="w-10 h-14 object-cover rounded shadow" />
                      <span className="font-medium text-white">{movie.title}</span>
                    </td>
                    <td className="px-6 py-4">{movie.rating}</td>
                    <td className="px-6 py-4">{movie.year}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/20">Active</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-white/40 hover:text-white transition-colors">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
