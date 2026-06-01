"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, User } from "lucide-react";
import { motion } from "framer-motion";
import { SearchModal } from "./SearchModal";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? "bg-zinc-950/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tighter text-white">
                JOSEPH<span className="text-primary/70">NETFLIX</span>
              </span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Home</Link>
              <Link href="/movies" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Movies</Link>
              <Link href="/categories" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Categories</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button className="text-white/70 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link href="/dashboard" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10 hover:border-white/30 transition-all">
              <User className="w-4 h-4 text-white/70" />
            </Link>
          </div>
        </div>
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </motion.nav>
  );
}
