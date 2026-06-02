"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Globe2, Users, Heart, Clock, PlayCircle, HeartHandshake } from "lucide-react";
import { Ministry, getMinistryById } from "@/lib/api-ministries";
import { CinematicButton } from "@/components/ui/CinematicButton";

export default function MinistryProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await getMinistryById(id);
        setMinistry(data);
      } catch (err) {
        console.error("Failed to load ministry profile", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse-slow">
        <div className="h-[50vh] bg-white/5 w-full" />
        <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
          <div className="w-32 h-32 rounded-xl bg-[#0a0a0f] border-4 border-[#030306] mb-8" />
          <div className="h-10 w-1/3 bg-white/10 rounded mb-4" />
          <div className="h-6 w-1/4 bg-white/5 rounded mb-8" />
          <div className="flex gap-4 mb-12">
            <div className="h-12 w-40 bg-white/10 rounded-lg" />
            <div className="h-12 w-40 bg-white/5 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-40 w-full bg-white/5 rounded-2xl" />
              <div className="h-64 w-full bg-white/5 rounded-2xl" />
            </div>
            <div className="h-96 w-full bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!ministry) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ministry not found</h2>
          <button onClick={() => router.back()} className="text-gold-500 hover:text-gold-400">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Cover Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-[#030306]/60 to-transparent z-10" />
        <motion.img 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={ministry.coverImage}
          alt={ministry.name}
          className="w-full h-full object-cover"
        />
        
        {/* Nav actions */}
        <div className="absolute top-24 left-6 right-6 z-20 flex justify-between items-center max-w-7xl mx-auto w-full">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-white hover:text-gold-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-white hover:text-gold-300">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-10"
        >
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-[#030306] shadow-2xl bg-[#0a0a0f] shrink-0 relative group">
            <div className="absolute inset-0 bg-gold-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img 
              src={ministry.logo} 
              alt={ministry.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Mission */}
          <div className="flex-1 pb-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-3 text-glow-gold">
              {ministry.name}
            </h1>
            <p className="text-xl md:text-2xl text-gold-400 font-serif italic max-w-3xl">
              "{ministry.mission}"
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 shrink-0 w-full md:w-auto mt-4 md:mt-0">
            <CinematicButton 
              variant="gold"
              onClick={() => router.push(`/donate?ministry=${ministry.id}`)}
            >
              Donate Now
            </CinematicButton>
            <button className="px-6 py-3 rounded-full glass-button text-white font-medium flex items-center gap-2 hover:bg-white/10">
              <HeartHandshake className="w-5 h-5" />
              <span>Partner</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 space-y-12"
          >
            {/* About */}
            <section className="glass-panel rounded-2xl p-8">
              <h3 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
                <Globe2 className="text-gold-500" /> About the Ministry
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {ministry.about}
              </p>
            </section>

            {/* Featured Movies/Projects */}
            {ministry.featuredMovies.length > 0 && (
              <section>
                <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                  <PlayCircle className="text-gold-500" /> Featured Projects
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {ministry.featuredMovies.map((movie) => (
                    <div key={movie.id} className="group relative rounded-xl overflow-hidden cursor-pointer shadow-glass">
                      <div className="aspect-[2/3] w-full">
                        <img 
                          src={movie.image} 
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <h4 className="text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                          {movie.title}
                        </h4>
                        <div className="w-0 h-1 bg-gold-500 mt-2 group-hover:w-12 transition-all duration-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>

          {/* Sidebar Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Impact Stats */}
            <div className="glass-panel-heavy rounded-2xl p-8 border border-gold-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl" />
              <h3 className="text-xl font-bold text-white mb-6">Global Impact</h3>
              <div className="space-y-6">
                {ministry.impactStats.map((stat, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <span className="text-gray-400 font-medium">{stat.label}</span>
                    <span className="text-2xl font-bold text-gradient-gold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Campaigns */}
            {ministry.campaigns.length > 0 && (
              <div className="glass-panel rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Active Campaigns</h3>
                <div className="space-y-6">
                  {ministry.campaigns.map((camp) => {
                    const percent = Math.min(100, Math.round((camp.raised / camp.goal) * 100));
                    return (
                      <div key={camp.id} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <h4 className="font-medium text-white">{camp.name}</h4>
                          <span className="text-xs text-gold-400 font-bold">{percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>${camp.raised.toLocaleString()} raised</span>
                          <span>${camp.goal.toLocaleString()} goal</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Donations */}
            {ministry.recentDonations.length > 0 && (
              <div className="glass-panel rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" /> 
                  Recent Backers
                </h3>
                <div className="space-y-5">
                  {ministry.recentDonations.map((don, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-700/20 flex items-center justify-center border border-gold-500/30">
                        <span className="text-gold-400 font-bold text-sm">
                          {don.donor.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium text-sm">{don.donor}</span>
                          <span className="text-gold-400 font-bold text-sm">${don.amount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{don.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
