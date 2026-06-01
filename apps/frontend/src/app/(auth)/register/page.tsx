"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { featuredMovie } from "@/lib/mockData";
import { CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
      </div>

      {/* Glassmorphic Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[900px] flex flex-col md:flex-row overflow-hidden rounded-3xl border border-white/20 bg-black/40 backdrop-blur-3xl shadow-[0_0_80px_rgba(255,255,255,0.05)]"
      >
        {/* Value Proposition Sidebar */}
        <div className="w-full md:w-5/12 bg-white/5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Create Free Account</h2>
          <p className="text-white/70 mb-8 font-light leading-relaxed">
            Join Joseph Netflix today. No subscriptions. No hidden fees. Pay only for what you watch.
          </p>
          
          <ul className="space-y-5 text-white/80">
            {[
              "Purchase premium Christian movies",
              "Rent exclusive faith-based content",
              "Support Christian creators directly",
              "Donate to partner ministries"
            ].map((benefit, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex items-center gap-3 font-medium"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                <span>{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Registration Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Password</label>
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
                placeholder="Create a strong password"
                required
              />
            </div>

            <CinematicButton 
              type="submit" 
              size="lg" 
              className="w-full bg-gradient-to-r from-primary/90 to-primary text-primary-foreground hover:from-primary hover:to-primary/90 font-bold text-lg mt-8 h-14 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all rounded-xl"
            >
              Start Watching Now
            </CinematicButton>
          </form>

          <div className="mt-8 text-center text-white/50 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:text-primary transition-colors font-semibold ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
