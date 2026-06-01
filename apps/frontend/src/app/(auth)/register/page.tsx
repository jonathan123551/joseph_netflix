"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { featuredMovie } from "@/lib/mockData";

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else window.location.href = "/dashboard"; // Mock redirect
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
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      </div>

      {/* Form Card */}
      <motion.div 
        key={step}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
          <div className="mb-8">
            <p className="text-white/50 text-sm font-medium uppercase tracking-widest mb-2">Step {step} of 2</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {step === 1 ? "Create a password to start your membership" : "Choose your plan"}
            </h1>
            {step === 1 && <p className="text-white/70 mt-3">Just a few more steps and you're done! We hate paperwork, too.</p>}
          </div>
          
          <form onSubmit={handleNext} className="space-y-5">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <input 
                    type="email" 
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                    placeholder="Email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <input 
                    type="password" 
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                    placeholder="Add a password"
                    required
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-white/20 rounded-xl p-4 cursor-pointer hover:border-white/50 transition-colors bg-white/5">
                  <h3 className="text-white font-bold text-lg">Premium</h3>
                  <p className="text-white/60 text-sm mt-1">4K + HDR, 4 devices</p>
                  <p className="text-white font-semibold mt-3">$19.99 / month</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4 cursor-pointer hover:border-white/30 transition-colors">
                  <h3 className="text-white font-bold text-lg">Standard</h3>
                  <p className="text-white/60 text-sm mt-1">1080p, 2 devices</p>
                  <p className="text-white font-semibold mt-3">$14.99 / month</p>
                </div>
              </div>
            )}

            <CinematicButton type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg mt-6 h-14">
              {step === 1 ? "Next" : "Start Membership"}
            </CinematicButton>
          </form>

          <div className="mt-8 text-center text-white/50 text-sm border-t border-white/10 pt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline font-medium ml-1">
              Sign In.
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
