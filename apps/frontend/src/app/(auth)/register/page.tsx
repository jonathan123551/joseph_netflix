"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Film, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full transition-all duration-400"
            style={{ background: i < strength ? colors[strength - 1] : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>
      <p className="text-[10px] font-medium" style={{ color: strength > 0 ? colors[strength - 1] : 'rgba(255,255,255,0.3)' }}>
        {strength > 0 ? labels[strength - 1] : ''}
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth() as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("Please accept the terms to continue."); return; }
    setError("");
    setIsSubmitting(true);
    try {
      const ok = await register(name, email, password);
      if (ok) {
        setSuccess(true);
        setTimeout(() => { window.location.href = "/dashboard"; }, 2000);
      } else {
        setError("Registration failed. This email may already be in use.");
      }
    } catch (err: any) {
      setError(err.message || "Registration service unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  };
  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(212,163,89,0.45)';
    e.target.style.boxShadow = '0 0 0 3px rgba(212,163,89,0.08)';
    e.target.style.background = 'rgba(255,255,255,0.07)';
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    e.target.style.boxShadow = 'none';
    e.target.style.background = 'rgba(255,255,255,0.05)';
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#030306]">
      <div className="grain-overlay" />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1920"
          alt="Cinema background"
          className="w-full h-full object-cover opacity-15 pointer-events-none"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(3,3,6,0.9)' }} />
        <div className="absolute inset-0 bg-gradient-vignette" />
      </div>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] radial-glow-gold rounded-full filter blur-[180px] opacity-20 mix-blend-screen pointer-events-none animate-pulse-slow" />

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-divine rounded-3xl p-8 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.75)]">
          {/* Gold top line */}
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
            <h1 className="text-2xl font-serif font-bold text-white mb-2">Join the community</h1>
            <p className="text-white/40 text-sm">Create your free account today</p>
          </div>

          {/* Success State */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <CheckCircle2 className="w-7 h-7 text-green-400" />
              </div>
              <p className="font-semibold text-white">Account Created!</p>
              <p className="text-sm text-white/45">Redirecting to your library…</p>
            </motion.div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 p-3.5 rounded-xl"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-400/90">{error}</p>
                </motion.div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="reg-name" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/45">Full Name</label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="reg-email" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/45">Email Address</label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="reg-password" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/45">Password</label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-300"
                    style={inputStyle}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
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
                <PasswordStrength password={password} />
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group mt-1">
                <div
                  className="relative flex-shrink-0 w-4 h-4 rounded mt-0.5 border transition-all duration-200"
                  style={{
                    borderColor: agreed ? 'rgba(212,163,89,0.6)' : 'rgba(255,255,255,0.2)',
                    background: agreed ? 'rgba(212,163,89,0.15)' : 'transparent',
                  }}
                >
                  <input
                    id="reg-terms"
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {agreed && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 m-auto w-2.5 h-2.5 text-gold-400"
                      viewBox="0 0 12 12" fill="none"
                    >
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </div>
                <span className="text-[11px] text-white/40 leading-relaxed">
                  I agree to the{" "}
                  <span className="text-gold-400/70 hover:text-gold-400 transition-colors">Terms of Service</span>
                  {" "}and{" "}
                  <span className="text-gold-400/70 hover:text-gold-400 transition-colors">Privacy Policy</span>
                </span>
              </label>

              {/* Submit */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="btn-cinematic w-full py-3.5 rounded-xl font-bold text-sm text-zinc-950 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #dfba73, #d4a359, #c58d41)',
                  boxShadow: '0 0 25px rgba(212,163,89,0.35), 0 4px 15px rgba(0,0,0,0.3)',
                }}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Sign In Link */}
          {!success && (
            <p className="text-center text-xs text-white/30 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-gold-400/70 hover:text-gold-400 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
