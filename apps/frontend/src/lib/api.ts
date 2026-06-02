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
  year: number;
  rentPrice: number;
  buyPrice: number;
  director?: string;
  cast?: string[];
  genres?: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-1871f.up.railway.app';

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
    return this.request<Movie>('/movies/featured');
  }

  async getAllMovies(): Promise<any[]> {
    return this.request<any[]>('/movies');
  }

  // ADMIN API
  async getAdminStats(): Promise<AdminStats> {
    return this.request<AdminStats>('/admin/stats');
  }

  async getMovieCategories(): Promise<any[]> {
    return this.request<any[]>('/movies/categories');
  }

  async getMovieDetails(id: string): Promise<Movie> {
    return this.request<Movie>(`/movies/${id}`);
  }

  async searchMovies(query: string): Promise<any[]> {
    const q = query.trim();
    if (!q) return [];
    return this.request<any[]>(`/movies/search?q=${encodeURIComponent(q)}`);
  }

  // FAVORITES API
  async getFavorites(): Promise<any[]> {
    return this.request<any[]>('/favorites');
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
    return this.request<Movie[]>('/purchases/my-library');
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
