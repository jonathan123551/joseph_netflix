"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Minimize, Settings, SkipForward, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { Movie } from "@/lib/api";

interface CinematicPlayerProps {
  movie: Movie;
  videoUrl: string;
  onBack: () => void;
}

export function CinematicPlayer({ movie, videoUrl, onBack }: CinematicPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);

  // Load saved watch history on mount
  useEffect(() => {
    async function loadSavedProgress() {
      try {
        const historyList = await api.getWatchHistory();
        const existing = historyList.find((h: any) => h.id === movie.id);
        if (existing && existing.progressSecs && videoRef.current) {
          videoRef.current.currentTime = existing.progressSecs;
          setCurrentTime(existing.progressSecs);
        }
      } catch (err) {
        console.warn("Could not load initial progress from API:", err);
      }
    }
    loadSavedProgress();
  }, [movie.id]);

  // Save progress periodically (every 10s) while playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(async () => {
      if (videoRef.current) {
        const currentSecs = Math.floor(videoRef.current.currentTime);
        if (currentSecs > 0) {
          await api.updateWatchProgress(movie.id, currentSecs);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isPlaying, movie.id]);

  // Save progress on exit (cleanup)
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        const finalSecs = Math.floor(videoRef.current.currentTime);
        if (finalSecs > 0) {
          api.updateWatchProgress(movie.id, finalSecs).catch(console.error);
        }
      }
    };
  }, [movie.id]);

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  // Skip progress helper
  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      videoRef.current.duration || 0,
      Math.max(0, videoRef.current.currentTime + seconds)
    );
  };

  // Time formatting helper (hh:mm:ss)
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);

    const pad = (n: number) => n.toString().padStart(2, "0");

    if (h > 0) {
      return `${h}:${pad(m)}:${pad(s)}`;
    }
    return `${pad(m)}:${pad(s)}`;
  };

  // Handle video progress updates
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 0;
    setCurrentTime(current);
    setProgressPercent(total > 0 ? (current / total) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  // Progress bar manual scrub
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;
    const targetTime = clickPercent * duration;

    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
    setProgressPercent(clickPercent * 100);
  };

  // Handle volume controls
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const val = parseFloat(e.target.value);
    setVolume(val);
    videoRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    videoRef.current.muted = newMute;
  };

  // Fullscreen controller
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(console.error);
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(console.error);
    }
  };

  // Hide controls after inactivity
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      clearTimeout(timeoutId);
    };
  }, [isPlaying]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[60vh] md:h-[80vh] bg-black overflow-hidden select-none"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={handleTogglePlay}
        playsInline
      />

      {/* Top Header Controls Overlay */}
      <div 
        className={`absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/90 to-transparent z-20 flex items-center justify-between transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-sm font-semibold tracking-wider uppercase">Back</span>
        </button>
        <div className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          PREMIUM FAITH STREAMING
        </div>
      </div>

      {/* Play/Pause Center Indicator */}
      <div className={`absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-300 ${
        !isPlaying || showControls ? "opacity-100" : "opacity-0"
      }`}>
        <button 
          onClick={handleTogglePlay}
          className="w-20 h-20 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all transform hover:scale-105 pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>
      </div>

      {/* Bottom Controls Bar Overlay */}
      <div 
        className={`absolute bottom-0 left-0 w-full px-6 py-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-20 flex flex-col gap-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Timeline Slider */}
        <div 
          onClick={handleProgressBarClick}
          className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative group/timeline"
        >
          <div 
            className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full scale-0 group-hover/timeline:scale-100 transition-transform shadow-[0_0_10px_rgba(212,163,89,0.8)] border-2 border-gold-600" />
          </div>
        </div>

        {/* Control Action Buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-5">
            <button 
              onClick={handleTogglePlay}
              className="text-white/80 hover:text-white transition-colors cursor-pointer animate-none"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
            </button>
            <button 
              onClick={() => handleSkip(-10)}
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
              title="-10 Seconds"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleSkip(10)}
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
              title="+10 Seconds"
            >
              <SkipForward className="w-5 h-5 fill-white" />
            </button>
            
            {/* Volume Control */}
            <div className="flex items-center gap-2 group/volume ml-2">
              <button 
                onClick={handleToggleMute}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-gold-500 bg-white/20 h-1 rounded-full overflow-hidden cursor-pointer"
              />
            </div>

            <div className="text-sm font-semibold tracking-wide text-white/90 drop-shadow ml-3">
              {movie.title}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <span className="text-xs font-mono text-white/60">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <button className="text-white/80 hover:text-white transition-colors cursor-pointer">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={handleToggleFullscreen}
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
