import { Movie, MovieAsset } from '@prisma/client';

type MovieWithAssets = Movie & { assets: MovieAsset[] };

export interface MovieCard {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: string;
  rating: string | null;
  year: number;
  bannerUrl: string;
  posterUrl: string;
  genres: string[];
}

export function toMovieCard(
  movie: MovieWithAssets,
  genres: string[] = [],
): MovieCard {
  const bannerAsset = movie.assets.find((a) => a.type === 'BANNER');
  const posterAsset = movie.assets.find((a) => a.type === 'POSTER');
  return {
    id: movie.id,
    title: movie.title,
    slug: movie.slug,
    description: movie.description,
    duration: `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`,
    rating: movie.ageRating,
    year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 2024,
    bannerUrl: bannerAsset ? bannerAsset.url : '',
    posterUrl: posterAsset ? posterAsset.url : '',
    genres,
  };
}
