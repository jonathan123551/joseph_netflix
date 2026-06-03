export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl: string;
  videoUrl?: string;
  rating: string;
  duration: string;
  year?: number;
  rentPrice: number;
  buyPrice: number;
  director?: string;
  cast?: string[];
  genres?: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-1871f.up.railway.app';

// Format a runtime given in minutes (e.g. 131) into "2h 11m".
function formatRuntime(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value !== "number" || !isFinite(value) || value <= 0) return "";
  const hours = Math.floor(value / 60);
  const mins = Math.round(value % 60);
  if (hours <= 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

// The backend exposes movies in two shapes: a pre-shaped row (the /categories
// feed) and a raw Prisma record (/movies, /movies/:id, /movies/featured) with
// `assets`, `ageRating`, `releaseDate`, `price`, `actors` and `categories`.
// Normalize both into the flat `Movie` shape the UI renders.
export function normalizeMovie(raw: any): Movie {
  if (!raw) return raw;

  const assets: any[] = Array.isArray(raw.assets) ? raw.assets : [];
  const posterAsset = assets.find((a) => a?.type === "POSTER")?.url;
  const bannerAsset = assets.find((a) => a?.type === "BANNER")?.url;

  const poster = raw.posterUrl || posterAsset || raw.bannerUrl || bannerAsset || "";
  const banner = raw.bannerUrl || bannerAsset || raw.posterUrl || posterAsset || "";

  const year =
    raw.year ||
    (raw.releaseDate ? new Date(raw.releaseDate).getFullYear() : undefined);

  const genres: string[] =
    (Array.isArray(raw.genres) && raw.genres.length ? raw.genres : undefined) ||
    (Array.isArray(raw.categories)
      ? raw.categories.map((c: any) => c?.title || c?.name).filter(Boolean)
      : []);

  const cast: string[] =
    (Array.isArray(raw.cast) && raw.cast.length ? raw.cast : undefined) ||
    (Array.isArray(raw.actors)
      ? raw.actors.map((a: any) => a?.actor?.name || a?.name).filter(Boolean)
      : []);

  // The backend stores a single `price` (the purchase price). Derive a sensible
  // rental price so Rent vs Buy reads clearly in the UI.
  const buyPrice =
    raw.buyPrice != null ? Number(raw.buyPrice) : raw.price != null ? Number(raw.price) : 0;
  const rentPrice =
    raw.rentPrice != null
      ? Number(raw.rentPrice)
      : buyPrice > 0
        ? Math.max(2.99, Math.round(buyPrice * 0.3 * 100) / 100)
        : 0;

  return {
    id: String(raw.id),
    title: raw.title,
    description: raw.description,
    posterUrl: poster,
    bannerUrl: banner,
    trailerUrl: raw.trailerUrl,
    videoUrl: raw.videoUrl,
    rating: raw.rating || raw.ageRating || "NR",
    duration: formatRuntime(raw.duration),
    year,
    rentPrice,
    buyPrice,
    director: raw.director,
    cast,
    genres,
  };
}

// Helper for parsing raw cookies
function getCookie(name: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  purchasedCount: number;
  totalDonations: number;
}

export interface Contribution {
  id: string;
  amount: string;
  date: string;
  org: string;
  campaign: string;
  invoice: string;
}

export interface AdminStats {
  totalUsers: number;
  totalMovies: number;
  totalDonations: number;
  totalPurchaseRevenue: number;
  totalRevenue: number;
  recentLogs: { id: string; action: string; date: string; user: string }[];
}

class ApiClient {
  private getHeaders(isJson = true) {
    const headers: Record<string, string> = {};
    if (isJson) {
      headers['Content-Type'] = 'application/json';
    }
    // Access token is sent as cookie by browser, but we can also set headers if needed.
    return headers;
  }

  // Resilient fetch wrapper without fallback
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Merge credentials and method
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(!options.body ? false : true),
        ...options.headers,
      },
      credentials: 'include', // Include access/refresh cookies automatically
    });

    if (!response.ok) {
      throw new Error(`API response error ${response.status}`);
    }

    return await response.json() as T;
  }

  // AUTH API
  async getProfile(): Promise<any> {
    return this.request('/auth/me');
  }

  async getProfileStats(): Promise<UserProfile> {
    return this.request<UserProfile>('/users/me/profile');
  }

  // MOVIES API
  async getFeaturedMovie(): Promise<Movie> {
    const raw = await this.request<any>('/movies/featured');
    return normalizeMovie(raw);
  }

  // Returns raw movie records (admin management relies on the unmapped fields).
  async getAllMovies(): Promise<any[]> {
    return this.request<any[]>('/movies');
  }

  // Browse-friendly catalog: raw records mapped into the flat `Movie` shape.
  async getCatalog(): Promise<Movie[]> {
    const raw = await this.request<any[]>('/movies');
    return Array.isArray(raw) ? raw.map(normalizeMovie) : [];
  }

  // ADMIN API
  async getAdminStats(): Promise<AdminStats> {
    return this.request<AdminStats>('/admin/stats');
  }

  async getMovieCategories(): Promise<any[]> {
    return this.request<any[]>('/movies/categories');
  }

  async getMovieDetails(id: string): Promise<Movie> {
    const raw = await this.request<any>(`/movies/${id}`);
    return normalizeMovie(raw);
  }

  async searchMovies(query: string): Promise<any[]> {
    const q = query.trim();
    if (!q) return [];
    return this.request<any[]>(`/movies/search?q=${encodeURIComponent(q)}`);
  }

  // FAVORITES API
  async getFavorites(): Promise<Movie[]> {
    const raw = await this.request<any[]>('/favorites');
    return Array.isArray(raw) ? raw.map(normalizeMovie) : [];
  }

  async addFavorite(movieId: string): Promise<any> {
    return this.request('/favorites/' + movieId, { method: 'POST' });
  }

  async removeFavorite(movieId: string): Promise<any> {
    return this.request('/favorites/' + movieId, { method: 'DELETE' });
  }

  // WATCH HISTORY API
  async getWatchHistory(): Promise<any[]> {
    return this.request<any[]>('/watch-history');
  }

  async updateWatchProgress(movieId: string, progressSecs: number): Promise<any> {
    return this.request('/watch-history', {
      method: 'POST',
      body: JSON.stringify({ movieId, progressSecs }),
    });
  }

  // PURCHASES API
  async buyMovie(movieId: string): Promise<any> {
    return this.request('/purchases/buy', {
      method: 'POST',
      body: JSON.stringify({ movieId }),
    });
  }

  async rentMovie(movieId: string): Promise<any> {
    return this.request('/purchases/rent', {
      method: 'POST',
      body: JSON.stringify({ movieId }),
    });
  }

  async getMyLibrary(): Promise<Movie[]> {
    const raw = await this.request<any[]>('/purchases/my-library');
    return Array.isArray(raw) ? raw.map(normalizeMovie) : [];
  }

  // DONATIONS API
  async submitDonation(amount: number): Promise<any> {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async getMyContributions(): Promise<Contribution[]> {
    return this.request<Contribution[]>('/donations/my-contributions');
  }

  async getPlaybackSource(movieId: string): Promise<any> {
    const url = `${API_BASE_URL}/movies/${movieId}/playback`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      const errorMsg = await response.json().then((d) => d.message).catch(() => 'Unauthorized playback access');
      throw new Error(errorMsg);
    }
    return response.json();
  }

  // MINISTRIES API
  async getMinistries(): Promise<any[]> {
    return this.request<any[]>('/ministries');
  }

  async getMinistryById(id: string): Promise<any> {
    return this.request<any>(`/ministries/${id}`);
  }
}

export const api = new ApiClient();
export default api;
