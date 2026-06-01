"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { featuredMovie } from "@/lib/mockData";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/dashboard"; // Mock redirect
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={featuredMovie.bannerUrl} 
          alt="Background" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[8px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      </div>

      {/* Glassmorphic Form Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="bg-black/30 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-10 md:p-12 shadow-[0_0_80px_rgba(255,255,255,0.07)] overflow-hidden relative">
          
          {/* Top internal glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 drop-shadow-lg">
              Welcome Back
            </h1>
            <p className="text-white/60 font-light text-sm md:text-base">
              Sign in to access your purchased movies.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-white/50 ml-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 focus:bg-white/10 transition-all shadow-inner"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-white/50 ml-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 focus:bg-white/10 transition-all shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm text-white/60 pt-2 px-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors group">
                <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center bg-white/5 group-hover:border-white/50 transition-colors">
                  <input type="checkbox" className="opacity-0 absolute" />
                </div>
                Remember me
              </label>
              <a href="#" className="hover:text-white transition-colors">Forgot password?</a>
            </div>

            <CinematicButton 
              type="submit" 
              size="lg" 
              className="w-full bg-white text-black hover:bg-white/90 font-bold text-lg mt-4 h-14 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all"
            >
              Sign In
            </CinematicButton>
            
          </form>

          <div className="mt-10 text-center text-white/50 text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-white hover:underline font-semibold ml-1">
              Create one now
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
