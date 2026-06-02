"use client";

import { use, useState, useEffect } from "react";
import { CinematicPlayer } from "@/components/shared/CinematicPlayer";
import { Movie, mockMovies } from "@/lib/mockData";
import { MovieRow } from "@/components/shared/MovieRow";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = resolvedParams.id;
  const router = useRouter();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovie() {
      try {
        const playback = await api.getPlaybackSource(movieId);
        setPlaybackUrl(playback.url);

        const details = await api.getMovieDetails(movieId);
        if (details) {
          setMovie(details);
          setRecommended(mockMovies.filter(m => m.id !== details.id).slice(2, 7));
        }
      } catch (err: any) {
        console.error("Playback entitlement check failed:", err);
        alert(err.message || "You must purchase or rent this movie to watch it.");
        router.push(`/movie/${movieId}`);
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [movieId, router]);

  const handleBack = () => {
    if (movie) {
      router.push(`/movie/${movie.id}`);
    } else {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/40 font-serif tracking-widest text-lg uppercase animate-pulse">Loading theatre...</div>
      </div>
    );
  }

  if (!movie || !playbackUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Presentation not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Real Cinematic Player */}
      <CinematicPlayer movie={movie} videoUrl={playbackUrl} onBack={handleBack} />

      {/* Recommended Below Player */}
      <div className="py-12 bg-zinc-950">
        <div className="max-w-[1400px] mx-auto">
          <MovieRow title="More Like This" movies={recommended} />
        </div>
      </div>
    </div>
  );
}
