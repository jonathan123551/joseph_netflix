"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: '#030306' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] radial-glow-gold rounded-full filter blur-[150px] opacity-25 animate-pulse-slow pointer-events-none" />

          <div className="flex flex-col items-center gap-10 relative z-10">
            {/* Cross Icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-12 h-16 flex items-center justify-center"
            >
              <div className="absolute w-[3px] h-16 rounded-full"
                style={{ background: 'linear-gradient(to bottom, #ebd19b, #d4a359, #a77030)' }} />
              <div className="absolute w-10 h-[3px] rounded-full"
                style={{ background: 'linear-gradient(to right, #ebd19b, #d4a359, #a77030)', top: '28%' }} />
              <div className="absolute inset-0 rounded-full filter blur-[18px] opacity-50 animate-pulse-slow"
                style={{ background: 'rgba(212,163,89,0.4)' }} />
            </motion.div>

            {/* Logo */}
            <div className="text-center space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center"
              >
                <span className="text-4xl md:text-6xl font-serif font-black tracking-[0.12em] text-shimmer">
                  JOSEPH
                </span>
                <span className="text-4xl md:text-6xl font-serif font-black tracking-[0.1em] text-white/22 mx-2.5">·</span>
                <span className="text-4xl md:text-6xl font-serif font-black tracking-[0.12em] text-white/40">
                  NETFLIX
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.75 }}
                className="text-[9px] uppercase tracking-[0.45em] font-semibold"
                style={{ color: 'rgba(212,163,89,0.48)' }}
              >
                Premium Christian Streaming
              </motion.p>
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.4 }}
              className="w-40 h-px rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #a77030, #dfba73, #fbf6eb, #dfba73, #a77030)' }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.85, delay: 0.75, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
