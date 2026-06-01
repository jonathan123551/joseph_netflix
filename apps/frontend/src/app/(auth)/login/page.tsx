"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { featuredMovie } from "@/lib/mockData";
import { Film, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        window.location.href = "/dashboard"; // Direct redirect to clear session state fully
      } else {
        setError("Invalid email or password. Use your email to access the guest demo.");
      }
    } catch (err) {
      setError("Authentication service is unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#030306]">
      {/* Film Grain Texture */}
      <div className="grain-overlay" />

      {/* Background Cinematic Canvas */}
      <div className="absolute inset-0 z-0">
        <img 
          src={featuredMovie.bannerUrl} 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 pointer-events-none"
        />
        <div className="absolute inset-0 bg-[#030306]/85 backdrop-blur-[15px]" />
        <div className="absolute inset-0 bg-gradient-vignette" />
        <div className="absolute inset-0 bg-gradient-hero-overlay" />
      </div>

      {/* Volumetric Glow Backlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] radial-glow-gold rounded-full filter blur-[150px] opacity-35 mix-blend-screen pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] radial-glow-blue rounded-full filter blur-[100px] opacity-10 pointer-events-none" />

      {/* Glassmorphic Form Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="glass-panel-heavy rounded-3xl p-8 sm:p-12 shadow-cinematic overflow-hidden relative">
          {/* Top internal border glare highlights */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="mb-8 text-center flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Film className="w-5 h-5 text-gold-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-serif tracking-[0.2em] font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-400 to-gold-600">
                JOSEPH
              </span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-wide font-extrabold text-white mb-2 drop-shadow-md">
              Welcome Back
            </h1>
            <p className="text-white/50 text-xs sm:text-sm font-light leading-relaxed max-w-xs">
              Access your digital library, purchases, and watchlists securely.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-xs text-red-300"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-400/40 focus:bg-white/8 transition-all duration-300"
                placeholder="email@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-400/40 focus:bg-white/8 transition-all duration-300"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs text-white/60 pt-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors group select-none">
                <input 
                  type="checkbox" 
                  className="rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500/50 focus:ring-offset-0 focus:ring-transparent h-4 w-4" 
                />
                Remember me
              </label>
              <a href="#" className="hover:text-white hover:underline transition-colors font-medium">Forgot password?</a>
            </div>

            <CinematicButton 
              type="submit" 
              variant="gold"
              size="lg" 
              disabled={isSubmitting}
              className="w-full font-bold text-sm uppercase tracking-widest mt-2 h-13 rounded-xl"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </CinematicButton>
          </form>

          {/* Secure disclaimer */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider text-white/30 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500/50" /> Secure Connection
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-white/40 text-xs font-medium">
            New to Joseph Films?{" "}
            <Link href="/register" className="text-gold-400 hover:text-gold-300 hover:underline ml-1">
              Create a free account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
