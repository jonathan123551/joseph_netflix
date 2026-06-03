"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Film, ShieldCheck, AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const { login, register } = useAuth();

  const GUEST_EMAIL = "demo@josephfilms.com";
  const GUEST_PASSWORD = "demopass123";

  const handleGuest = async () => {
    setError("");
    setIsGuestLoading(true);
    try {
      // Self-healing: try to sign in, and provision the demo account if it
      // doesn't exist yet so the guest experience always works.
      try {
        await login(GUEST_EMAIL, GUEST_PASSWORD);
      } catch {
        await register("Guest Viewer", GUEST_EMAIL, GUEST_PASSWORD);
      }
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Couldn't start a guest session. Please try again.");
    } finally {
      setIsGuestLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        window.location.href = "/dashboard";
      } else {
        setError("Invalid email or password. Please check your credentials.");
      }
    } catch (err: any) {
      setError(err.message || "Authentication service is unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#030306]">
      <div className="grain-overlay" />

      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1920&h=1080"
          alt="Cinema background"
          className="w-full h-full object-cover opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(3,3,6,0.88)' }} />
        <div className="absolute inset-0 bg-gradient-vignette" />
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] radial-glow-gold rounded-full filter blur-[180px] opacity-22 mix-blend-screen pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-16 right-16 w-[280px] h-[280px] radial-glow-blue rounded-full filter blur-[100px] opacity-12 pointer-events-none" />

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-divine rounded-3xl p-8 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.75)]">
          {/* Top gold accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(212,163,89,0.7), transparent)' }} />

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Film className="w-5 h-5 text-gold-400" />
              <span className="font-serif text-lg font-black tracking-[0.18em] text-shimmer">JOSEPH</span>
              <span className="font-serif text-lg font-black tracking-wider text-white/25">·</span>
              <span className="font-serif text-lg font-black tracking-[0.18em] text-white/40">NETFLIX</span>
            </div>
            <p className="text-[9px] uppercase tracking-[0.4em] font-semibold" style={{ color: 'rgba(212,163,89,0.45)' }}>
              Christian Streaming
            </p>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-white mb-2">Welcome back</h1>
            <p className="text-white/40 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex items-start gap-2.5 p-3.5 rounded-xl mb-6"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-400/90 leading-relaxed">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/45">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(212,163,89,0.45)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(212,163,89,0.08)';
                  e.target.style.background = 'rgba(255,255,255,0.07)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/45">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[10px] text-gold-400/60 hover:text-gold-400 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(212,163,89,0.45)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212,163,89,0.08)';
                    e.target.style.background = 'rgba(255,255,255,0.07)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="btn-cinematic w-full py-3.5 rounded-xl font-bold text-sm text-zinc-950 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #dfba73, #d4a359, #c58d41)',
                boxShadow: '0 0 25px rgba(212,163,89,0.35), 0 4px 15px rgba(0,0,0,0.3)',
              }}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-[10px] text-white/25 font-medium">OR</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Guest Access */}
          <button
            id="login-guest-btn"
            onClick={handleGuest}
            disabled={isGuestLoading}
            className="w-full py-3 rounded-xl text-sm font-medium text-white/55 hover:text-white/80 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
          >
            {isGuestLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                Starting demo…
              </>
            ) : (
              "Explore as Guest"
            )}
          </button>
          <p className="text-center text-[10px] text-white/25 mt-2">
            Browse the full demo library — no sign-up required.
          </p>

          {/* Register Link */}
          <p className="text-center text-xs text-white/30 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-gold-400/70 hover:text-gold-400 font-semibold transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
