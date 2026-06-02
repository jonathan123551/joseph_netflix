"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Globe2, Users, Heart } from "lucide-react";
import { Ministry, getMinistries } from "@/lib/api-ministries";
import { CinematicButton } from "@/components/ui/CinematicButton";

export default function MinistriesDirectoryPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMinistries();
        setMinistries(data);
      } catch (err) {
        console.error("Failed to fetch ministries", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] radial-glow-gold -z-10 pointer-events-none" />
        <h1 className="text-5xl md:text-6xl font-display font-bold text-gradient-gold mb-6 tracking-tight">
          Ministry Partners
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed">
          Support the creators and organizations bringing light to the world. 
          Discover campaigns, back projects, and track global impact.
        </p>
      </motion.div>

      {/* Directory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel rounded-2xl h-[400px] animate-pulse-slow overflow-hidden relative">
              <div className="w-full h-48 bg-white/5" />
              <div className="p-8">
                <div className="w-16 h-16 rounded-full bg-white/10 absolute top-40 border-4 border-[#030306]" />
                <div className="h-6 w-1/3 bg-white/10 rounded mt-6 mb-4" />
                <div className="space-y-2 mb-6">
                  <div className="h-4 w-full bg-white/5 rounded" />
                  <div className="h-4 w-5/6 bg-white/5 rounded" />
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-24 bg-white/5 rounded" />
                  <div className="h-10 w-24 bg-white/5 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
        >
          {ministries.map((ministry, idx) => (
            <motion.div
              key={ministry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/5 to-gold-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none rounded-2xl" />
              
              <Link href={`/ministries/${ministry.id}`}>
                <div className="glass-panel rounded-2xl overflow-hidden transition-all duration-500 hover:border-gold-500/30 hover:shadow-[0_0_40px_rgba(212,163,89,0.15)] hover:-translate-y-1 h-full flex flex-col relative z-10">
                  {/* Cover Image */}
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={ministry.coverImage} 
                      alt={ministry.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030306] to-transparent opacity-80" />
                  </div>

                  {/* Logo & Content */}
                  <div className="p-8 pt-0 flex-1 flex flex-col relative">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-[#030306] shadow-xl absolute -top-10 left-8 z-20 bg-[#0a0a0f]">
                      <img 
                        src={ministry.logo} 
                        alt={`${ministry.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="mt-14 flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-white group-hover:text-gold-300 transition-colors duration-300">
                          {ministry.name}
                        </h2>
                        <p className="text-sm text-gold-500/80 font-medium mt-1">
                          {ministry.mission}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-white/50 group-hover:text-gold-400 group-hover:bg-gold-500/10 transition-all duration-300 transform group-hover:translate-x-1">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="text-gray-400 mt-5 text-sm line-clamp-2 leading-relaxed">
                      {ministry.about}
                    </p>

                    {/* Impact Stats */}
                    <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-4 auto-mt">
                      {ministry.impactStats.map((stat, sIdx) => {
                        const Icon = sIdx === 0 ? Globe2 : sIdx === 1 ? Users : Heart;
                        return (
                          <div key={sIdx} className="text-center group/stat">
                            <Icon className="w-5 h-5 mx-auto mb-2 text-white/20 group-hover/stat:text-gold-400 transition-colors duration-300" />
                            <div className="text-lg font-bold text-white tracking-wide">
                              {stat.value}
                            </div>
                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
                              {stat.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
