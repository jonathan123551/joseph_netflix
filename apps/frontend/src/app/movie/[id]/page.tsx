"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, Heart, ShoppingBag, Tv, Share2, Check, Sparkles } from "lucide-react";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { mockMovies } from "@/lib/mockData";
import { MovieRow } from "@/components/shared/MovieRow";

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movie = mockMovies.find(m => m.id === resolvedParams.id) || mockMovies[0];
  const similarMovies = mockMovies.filter(m => m.id !== movie.id).slice(0, 5);

  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [customDonation, setCustomDonation] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "donated" | "purchased" | "rented">("idle");
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  const handleAction = (type: "purchased" | "rented" | "donated") => {
    setCheckoutStep(type);
    setTimeout(() => {
      setCheckoutStep("idle");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#030306] pb-24 overflow-x-hidden relative">
      <div className="grain-overlay" />

      {/* Edge-to-Edge Dramatic Background */}
      <div className="absolute top-0 left-0 right-0 h-[85vh] z-0 overflow-hidden">
        <img
          src={movie.bannerUrl}
          alt={movie.title}
          className="w-full h-full object-cover scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-hero-overlay" />
        <div className="absolute inset-0 bg-gradient-hero-left" />
        <div className="absolute inset-0 bg-gradient-vignette" />
        {/* Soft background light */}
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] radial-glow-gold rounded-full filter blur-[150px] opacity-20 pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-40">
        
        {/* Apple TV+ Double-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Movie Information & Cast */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            <div>
              {/* Back to library */}
              <Link 
                href="/" 
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors mb-6"
              >
                ← Back to Home
              </Link>

              {/* Movie Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif tracking-wide text-4xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 leading-[1.1] mb-6 drop-shadow-lg"
              >
                {movie.title}
              </motion.h1>

              {/* Metadata Indicators */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/60 mb-8">
                <span className="text-gold-400 font-bold tracking-wider">99% APPROVED</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{movie.year}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="border border-white/10 bg-white/5 px-2 py-0.5 rounded text-white/90">
                  {movie.rating}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{movie.duration}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-white/80">4K ULTRA HD</span>
              </div>

              {/* Description */}
              <p className="text-lg text-white/70 font-light leading-relaxed mb-10 max-w-3xl drop-shadow-md">
                {movie.description}
              </p>
            </div>

            {/* Cinematic Extras / Media section */}
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-white/40 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                Theatrical Presentation
              </h2>
              
              <div 
                onClick={() => setIsPlayingTrailer(!isPlayingTrailer)}
                className="relative aspect-video max-w-2xl rounded-2xl overflow-hidden glass-panel border-white/10 group cursor-pointer shadow-cinematic"
              >
                {isPlayingTrailer ? (
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title={`${movie.title} Trailer`}
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img 
                      src={movie.bannerUrl} 
                      alt="Trailer Preview" 
                      className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl transition-all group-hover:bg-gold-500/20 group-hover:border-gold-400/40"
                      >
                        <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white ml-1.5" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-4 left-6">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gold-400 mb-0.5">Teaser Trailer</p>
                      <p className="text-sm font-semibold text-white/95">{movie.title} - Official Trailer</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Theatrical Credits Section */}
            <div className="border-t border-white/5 pt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm max-w-2xl font-light">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-white/40 mb-1">Director</h4>
                  <p className="text-white/80 font-medium">{movie.director}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-white/40 mb-1">Genres</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {movie.genres.map(genre => (
                      <span key={genre} className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-white/70">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-wider font-bold text-white/40 mb-1">Starring Cast</h4>
                <ul className="space-y-1.5 text-white/80 font-medium">
                  {movie.cast.map(actor => (
                    <li key={actor}>{actor}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Right Column: Premium Purchase Glass Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="glass-panel-heavy rounded-[2.25rem] border-white/10 p-8 shadow-cinematic relative overflow-hidden"
            >
              {/* Internal border highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {/* Animated Action overlay */}
              <AnimatePresence mode="wait">
                {checkoutStep !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 z-30 bg-zinc-950/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
                  >
                    <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-4 animate-bounce">
                      <Check className="w-6 h-6 text-gold-400" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-white mb-1.5">
                      {checkoutStep === "donated" ? "Thank You!" : "Transaction Success!"}
                    </h3>
                    <p className="text-xs text-white/60 max-w-[200px] leading-relaxed">
                      {checkoutStep === "donated" 
                        ? `Your donation of $${donationAmount || customDonation} was sent directly to supporting Christian cinema.`
                        : `Successfully added ${movie.title} to your streaming library.`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic Header */}
              <div className="text-center pb-6 border-b border-white/5 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400">Available Formats</span>
                <h3 className="text-xl font-serif font-bold text-white mt-1">Rent, Buy or Support</h3>
              </div>

              {/* Transactions Panel */}
              <div className="space-y-4">
                {/* Purchase Button */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/80">Purchase Film</h4>
                    <p className="text-[10px] text-white/40 font-light mt-0.5">Add to library permanently</p>
                  </div>
                  <CinematicButton 
                    variant="gold"
                    size="sm" 
                    onClick={() => handleAction("purchased")}
                    className="gap-2.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    $19.99
                  </CinematicButton>
                </div>

                {/* Rent Button */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/80">Rent Presentation</h4>
                    <p className="text-[10px] text-white/40 font-light mt-0.5">30-day access, 48h watch limit</p>
                  </div>
                  <CinematicButton 
                    variant="glass" 
                    size="sm" 
                    onClick={() => handleAction("rented")}
                    className="gap-2 bg-white/8 border-white/10 text-white"
                  >
                    <Tv className="w-3.5 h-3.5 text-gold-400" />
                    $4.99
                  </CinematicButton>
                </div>

                {/* Donation Subsection */}
                <div className="border-t border-white/5 pt-6 mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/70 mb-1 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                    Support The Ministry
                  </h4>
                  <p className="text-[10px] text-white/40 font-light mb-4 leading-relaxed">
                    Joseph Films supports Christian creators directly. Choose to make an optional donation to fund upcoming faith projects.
                  </p>

                  {/* Preset Amount Pills */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[10, 25, 50, 100].map((val) => (
                      <button
                        key={val}
                        onClick={() => {
                          setDonationAmount(val);
                          setCustomDonation("");
                        }}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          donationAmount === val
                            ? "bg-gold-500/20 border-gold-400 text-gold-300"
                            : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>

                  {/* Custom Donation Input */}
                  <input
                    type="number"
                    value={customDonation}
                    onChange={(e) => {
                      setCustomDonation(e.target.value);
                      setDonationAmount(null);
                    }}
                    placeholder="Custom contribution ($)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-gold-500/50 mb-4 transition-all"
                  />

                  {/* Donate Trigger */}
                  <CinematicButton
                    variant="outline"
                    size="default"
                    onClick={() => {
                      if (donationAmount || customDonation) {
                        handleAction("donated");
                      }
                    }}
                    disabled={!donationAmount && !customDonation}
                    className="w-full border-gold-500/30 text-gold-400 hover:bg-gold-500/10 hover:border-gold-400/60 uppercase tracking-widest text-[10px] font-bold py-3.5 h-auto rounded-xl flex items-center justify-center gap-2"
                  >
                    <Heart className="w-3.5 h-3.5 fill-red-500/10" />
                    Submit Donation
                  </CinematicButton>
                </div>

                {/* Additional Utilities */}
                <div className="flex items-center justify-between text-xs text-white/40 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" /> Share Film
                  </button>
                  <span className="font-semibold text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/60">
                    TAX DEDUCTIBLE
                  </span>
                </div>

              </div>
            </motion.div>
          </div>

        </div>

      </div>

      {/* Similar Content Rows */}
      <section className="relative z-10 mt-20 max-w-7xl mx-auto">
        <MovieRow title="More Christian Presentations" movies={similarMovies} />
      </section>
    </div>
  );
}
