"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, UserProfile } from "@/lib/api";
import { Movie, mockMovies } from "@/lib/mockData";
import { MovieCard } from "@/components/shared/MovieCard";
import { Settings, Clock, ShoppingBag, Tv, CreditCard, User, Bell, Shield, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"purchased" | "rentals" | "history" | "settings">("purchased");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [library, setLibrary] = useState<Movie[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profData, libData, histData] = await Promise.all([
          api.getProfileStats().catch(() => null),
          api.getMyLibrary().catch(() => []),
          api.getWatchHistory().catch(() => []),
        ]);
        
        setProfile(profData || {
          name: "Faithful Viewer",
          email: "user@josephfilms.com",
          role: "user",
          purchasedCount: 12,
          totalDonations: 250,
        });

        setLibrary(libData.length ? libData : mockMovies.slice(0, 4));
        setHistory(histData.length ? histData : mockMovies.slice(2, 6));
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const tabs = [
    { id: "purchased", label: "Purchased", icon: ShoppingBag },
    { id: "rentals", label: "Active Rentals", icon: Tv },
    { id: "history", label: "Watch History", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030306] pb-24 relative overflow-x-hidden pt-32">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-16 border-b border-white/5 pb-10">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
            <div className="text-center md:text-left flex-1 space-y-3">
              <div className="w-48 h-8 rounded bg-white/5 animate-pulse mx-auto md:mx-0" />
              <div className="w-32 h-4 rounded bg-white/5 animate-pulse mx-auto md:mx-0" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            <div className="md:col-span-3 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-12 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
            <div className="md:col-span-9 space-y-6">
              <div className="w-40 h-8 rounded bg-white/5 animate-pulse mb-8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full aspect-[16/9] rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030306] pb-24 relative overflow-x-hidden pt-32">
      <div className="grain-overlay" />
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-16 border-b border-white/10 pb-10"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 p-1 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-zinc-900 border-4 border-zinc-950 flex items-center justify-center overflow-hidden">
              <User className="w-12 h-12 text-gold-400/50" />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">{profile?.name}</h1>
            <p className="text-white/50 text-sm">{profile?.email} • Member since 2024</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto mt-6 md:mt-0">
            <div className="flex-1 md:flex-none glass-panel p-4 rounded-2xl text-center min-w-[120px]">
              <div className="text-2xl font-bold text-gold-400">{profile?.purchasedCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/50 mt-1">Titles Owned</div>
            </div>
            <div className="flex-1 md:flex-none glass-panel p-4 rounded-2xl text-center min-w-[120px]">
              <div className="text-2xl font-bold text-gold-400">${profile?.totalDonations}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/50 mt-1">Supported</div>
            </div>
          </div>
        </motion.div>

        {/* Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Sidebar Navigation */}
          <div className="md:col-span-3 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-gold-500/10 text-gold-400 border border-gold-500/20" 
                      : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-gold-400" : "text-white/40"}`} />
                  {tab.label}
                </button>
              );
            })}
            
            <div className="pt-8 mt-8 border-t border-white/5">
              <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-9">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === "purchased" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-white">Your Library</h2>
                  <p className="text-sm text-white/50 mb-8">Presentations you own permanently.</p>
                  
                  {library.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {library.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="Your library is currently empty." />
                  )}
                </div>
              )}

              {activeTab === "rentals" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-white">Active Rentals</h2>
                  <p className="text-sm text-white/50 mb-8">Titles available for the next 48 hours.</p>
                  <EmptyState message="You have no active rentals." />
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-white">Watch History</h2>
                  <p className="text-sm text-white/50 mb-8">Recently viewed presentations.</p>
                  
                  {history.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {history.map((movie: any) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No watch history found." />
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-8 max-w-2xl">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-6">Account Settings</h2>
                    
                    <div className="space-y-4">
                      <SettingRow icon={User} title="Personal Information" description="Update your name, email, and password" />
                      <SettingRow icon={CreditCard} title="Payment Methods" description="Manage your cards and billing address" />
                      <SettingRow icon={Shield} title="Privacy & Security" description="Control your data and account security" />
                      <SettingRow icon={Bell} title="Notifications" description="Email and push notification preferences" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-5 rounded-2xl glass-panel border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold-500/10 group-hover:text-gold-400 transition-colors">
          <Icon className="w-5 h-5 text-white/60 group-hover:text-gold-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white/90">{title}</h4>
          <p className="text-xs text-white/50 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="text-white/20 group-hover:text-gold-400 transition-colors">→</div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="w-full py-24 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <Tv className="w-6 h-6 text-white/20" />
      </div>
      <p className="text-white/40 font-medium text-sm">{message}</p>
    </div>
  );
}
