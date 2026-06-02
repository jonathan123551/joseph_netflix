"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { Film, ShieldCheck, HelpCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const success = await register(name, email, password);
      if (success) {
        window.location.href = "/dashboard"; // Clear session fully on reload
      } else {
        setError("Could not register. Use your email to access the guest demo.");
      }
    } catch (err) {
      setError("Registration service is unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#030306] overflow-hidden">
      {/* Grain texture overlay */}
      <div className="grain-overlay" />

      {/* Volumetric glow backdrop */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] radial-glow-gold rounded-full filter blur-[150px] opacity-25 pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] radial-glow-blue rounded-full filter blur-[130px] opacity-15 pointer-events-none" />

      {/* Split-Screen Glassmorphic Form Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[1000px] flex flex-col md:flex-row overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-3xl shadow-cinematic"
      >
        {/* Left Side: Cinematic Presentation & Value Proposition */}
        <div className="relative w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-white/5 min-h-[350px] md:min-h-auto">
          {/* Background image inside side card */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1920&h=1080" 
              alt="Background" 
              className="w-full h-full object-cover opacity-30 pointer-events-none"
            />
            <div className="absolute inset-0 bg-[#030306]/75" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#030306]/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030306] to-transparent" />
          </div>

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <Film className="w-5 h-5 text-gold-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-serif tracking-[0.2em] font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-400 to-gold-600">
                JOSEPH
              </span>
            </Link>

            <h2 className="text-3xl sm:text-4xl font-serif tracking-wide font-extrabold text-white mb-4 leading-tight drop-shadow-md">
              Create a Free Account
            </h2>
            <p className="text-white/60 text-sm font-light leading-relaxed max-w-sm mb-6">
              Enter the cinematic gateway for clean, uplifting Christian storytelling. No monthly contracts, subscription fees, or automatic billings.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            {[
              "Free Registration (No Credit Card)",
              "Rent or Purchase Individual Titles",
              "Directly Support Ministries & Creators",
              "Access Anywhere (TV, Web, Mobile)"
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.15), duration: 0.8 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(212,163,89,0.05)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-white/85">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 mt-8 text-[10px] uppercase tracking-widest text-white/30 font-semibold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> 100% Free Accounts & Library Space
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-black/20">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-xs text-red-300"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-400/40 focus:bg-white/8 transition-all duration-300"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-400/40 focus:bg-white/8 transition-all duration-300"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-400/40 focus:bg-white/8 transition-all duration-300"
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className="text-[10px] text-white/40 leading-relaxed pt-1 px-1">
              By joining, you agree to our terms. This is a transactional-only streaming marketplace. Subscriptions are not supported.
            </div>

            <CinematicButton 
              type="submit" 
              variant="gold"
              size="lg" 
              disabled={isSubmitting}
              className="w-full font-bold text-sm uppercase tracking-widest mt-4 h-13 rounded-xl"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </CinematicButton>
          </form>

          {/* Secure lock disclaimer */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-wider text-white/20 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500/40" /> 256-bit encryption layer
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-white/40 text-xs font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-gold-400 hover:text-gold-300 hover:underline ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
