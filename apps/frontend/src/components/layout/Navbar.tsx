"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search, Bell, Film, X, Menu, LogOut, Settings,
  Heart, BookOpen, HandHeart, Home, Library, User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchModal } from "./SearchModal";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  const userInitials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "JN";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Library", icon: Library },
    { href: "/ministries", label: "Ministries", icon: BookOpen },
    { href: "/donate", label: "Donate", icon: HandHeart },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 py-3 md:py-5">
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto flex items-center justify-between w-full transition-all duration-500 ease-in-out ${
            isScrolled
              ? "max-w-5xl py-2.5 px-5 rounded-full glass-panel-heavy shadow-[0_8px_32px_rgba(0,0,0,0.7),0_0_0_1px_rgba(212,163,89,0.1)]"
              : "max-w-7xl py-4 px-6 md:px-10 bg-transparent border-transparent"
          }`}
        >
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative">
              <Film className="w-5 h-5 text-gold-400 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse-slow" />
            </div>
            <div className="flex items-center">
              <span className="font-serif tracking-[0.18em] font-black text-base md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-400 to-gold-200 text-glow-gold">
                JOSEPH
              </span>
              <span className="hidden sm:inline font-serif tracking-[0.12em] font-black text-base md:text-lg text-white/25 mx-1.5">·</span>
              <span className="hidden sm:inline font-serif tracking-[0.18em] font-black text-base md:text-lg text-white/45">
                NETFLIX
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group px-3.5 py-1.5 text-[11px] uppercase tracking-[0.15em] font-semibold text-white/55 hover:text-white transition-colors duration-200"
              >
                {link.label}
                <span className="absolute bottom-0 left-3.5 right-3.5 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </Link>
            ))}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Search */}
            <button
              id="navbar-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-white/45 hover:text-gold-400 transition-colors duration-200 cursor-pointer rounded-full hover:bg-white/5"
              aria-label="Search movies"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Notifications */}
            <button
              id="navbar-bell-btn"
              className="relative p-2 text-white/45 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/5"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.85)]" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                id="navbar-profile-btn"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full glass-panel hover:border-gold-500/30 transition-all cursor-pointer border-white/10"
                aria-label="Account menu"
                aria-expanded={isProfileOpen}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gold-700 via-gold-500 to-gold-300 flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(212,163,89,0.35)]">
                  <span className="text-[9px] font-black text-zinc-950 tracking-tight">{userInitials}</span>
                </div>
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-white/65">
                  {user ? (user.name?.split(" ")[0] || "Account") : "Account"}
                </span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-2 w-52 glass-panel-heavy rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)]"
                  >
                    <div className="px-4 py-3 border-b border-white/[0.07]">
                      <p className="text-xs font-semibold text-white">{user?.name || "Guest User"}</p>
                      <p className="text-[10px] text-white/35 truncate mt-0.5">{user?.email || "guest@josephfilms.com"}</p>
                    </div>
                    <div className="py-1.5">
                      {user ? (
                        <>
                          <Link href="/dashboard" onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/65 hover:text-white hover:bg-white/[0.05] transition-colors">
                            <Library className="w-3.5 h-3.5" /> My Library
                          </Link>
                          <Link href="/my-list" onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/65 hover:text-white hover:bg-white/[0.05] transition-colors">
                            <Heart className="w-3.5 h-3.5" /> Favorites
                          </Link>
                          <Link href="/profile" onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/65 hover:text-white hover:bg-white/[0.05] transition-colors">
                            <Settings className="w-3.5 h-3.5" /> Settings
                          </Link>
                          <div className="border-t border-white/[0.07] mt-1 pt-1">
                            <button
                              onClick={() => { logout(); setIsProfileOpen(false); }}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400/75 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors w-full"
                            >
                              <LogOut className="w-3.5 h-3.5" /> Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Link href="/login" onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/65 hover:text-white hover:bg-white/[0.05] transition-colors">
                            <User className="w-3.5 h-3.5" /> Sign In
                          </Link>
                          <Link href="/register" onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gold-400/80 hover:text-gold-400 hover:bg-gold-500/[0.06] transition-colors">
                            <Film className="w-3.5 h-3.5" /> Create Account
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              id="navbar-mobile-menu-btn"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 text-white/55 hover:text-white transition-colors rounded-full hover:bg-white/5 cursor-pointer"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileOpen ? (
                  <motion.span key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="block"
                  >
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="block"
                  >
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.nav>
      </div>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col pt-24 pb-10 px-6 md:hidden"
            style={{ background: 'rgba(3,3,6,0.97)', backdropFilter: 'blur(40px)' }}
          >
            <nav className="flex flex-col flex-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-4 py-4 border-b border-white/[0.06] text-white/65 hover:text-white transition-colors group"
                  >
                    <link.icon className="w-5 h-5 text-gold-400/70 group-hover:text-gold-400 transition-colors" />
                    <span className="text-xl font-display font-medium tracking-wide">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/[0.06]">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-700 via-gold-500 to-gold-300 flex items-center justify-center">
                      <span className="text-xs font-black text-zinc-950">{userInitials}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <p className="text-[10px] text-white/35">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setIsMobileOpen(false); }}
                    className="flex items-center gap-2 text-red-400/70 hover:text-red-400 transition-colors py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setIsMobileOpen(false)}
                    className="w-full text-center py-3.5 rounded-2xl glass-panel text-white/75 font-semibold text-sm hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileOpen(false)}
                    className="w-full text-center py-3.5 rounded-2xl bg-gradient-to-r from-gold-700 to-gold-400 text-zinc-950 font-black text-sm shadow-[0_0_20px_rgba(212,163,89,0.3)]">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
