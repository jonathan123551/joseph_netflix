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
    // Mock login, no backend integration
    window.location.href = "/dashboard";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={featuredMovie.bannerUrl} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Sign In</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Email or phone number</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="Password"
                required
              />
            </div>

            <CinematicButton type="submit" size="lg" className="w-full bg-white text-black hover:bg-white/90 font-bold text-lg mt-4 h-14">
              Sign In
            </CinematicButton>
            
            <div className="flex items-center justify-between text-sm text-white/50 mt-4">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white/80 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-transparent" />
                Remember me
              </label>
              <a href="#" className="hover:underline hover:text-white/80 transition-colors">Need help?</a>
            </div>
          </form>

          <div className="mt-10 text-white/50 text-sm">
            New to Joseph Netflix?{" "}
            <Link href="/register" className="text-white hover:underline font-medium ml-1">
              Sign up now.
            </Link>
          </div>
          
          <p className="mt-4 text-[11px] text-white/40 leading-relaxed">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.{" "}
            <a href="#" className="text-blue-500 hover:underline">Learn more.</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
