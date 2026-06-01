"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, User, Film, Compass, Library } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchModal } from "./SearchModal";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 py-4 md:py-6">
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto flex items-center justify-between w-full transition-all duration-500 ease-in-out ${
            isScrolled
              ? "max-w-4xl py-2.5 px-6 rounded-full glass-panel-heavy shadow-2xl border-white/10"
              : "max-w-7xl py-4 px-6 md:px-12 bg-transparent border-transparent"
          }`}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-8 md:gap-12">
            <Link href="/" className="flex items-center gap-2 group">
              <Film className="w-5 h-5 text-gold-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-serif tracking-[0.2em] font-black text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-400 to-gold-600 text-glow-gold">
                JOSEPH
              </span>
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className="relative text-xs uppercase tracking-[0.15em] font-semibold text-white/90 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/dashboard" 
                className="relative text-xs uppercase tracking-[0.15em] font-semibold text-white/60 hover:text-white transition-colors"
              >
                Library
              </Link>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-white/60 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/5"
            >
              <Search className="w-4 h-4" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-white/60 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/5"
            >
              <Bell className="w-4 h-4" />
            </motion.button>

            {/* Premium Profile Pill */}
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center overflow-hidden">
                  <User className="w-3.5 h-3.5 text-zinc-950" />
                </div>
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-white/80">Account</span>
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    {/* Backdrop to close click */}
                    <div 
                      className="fixed inset-0 z-40 pointer-events-auto cursor-default" 
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-56 z-50 glass-panel-heavy rounded-2xl p-2 border-white/10 shadow-2xl pointer-events-auto"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <p className="text-xs text-white/40 font-semibold tracking-wider uppercase">Signed In As</p>
                        <p className="text-sm font-semibold text-white/95 truncate">guest@josephfilms.com</p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Library className="w-4 h-4 text-gold-400" />
                        My Library
                      </Link>
                      <Link 
                        href="/login" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4 text-gold-400" />
                        Switch Account
                      </Link>
                      <div className="border-t border-white/5 mt-1 pt-1">
                        <Link 
                          href="/login" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          Sign Out
                        </Link>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.nav>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
