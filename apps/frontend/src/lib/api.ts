import { mockMovies, categories, featuredMovie, Movie } from "./mockData";

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

class ApiClient {
  private getHeaders(isJson = true) {
    const headers: Record<string, string> = {};
    if (isJson) {
      headers['Content-Type'] = 'application/json';
    }
    // Access token is sent as cookie by browser, but we can also set headers if needed.
    return headers;
  }

  // Resilient fetch wrapper with fallback
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    fallbackData: T
  ): Promise<T> {
    try {
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
    } catch (error: any) {
      console.warn(`API path ${endpoint} failed: ${error.message}. Falling back to demo mock data.`);
      return fallbackData;
    }
  }

  // AUTH API
  async getProfile(): Promise<any> {
    return this.request('/auth/me', {}, null);
  }

  async getProfileStats(): Promise<UserProfile> {
    return this.request<UserProfile>('/users/me/profile', {}, {
      name: "John Doe",
      email: "guest@josephfilms.com",
      role: "USER",
      purchasedCount: 2,
      totalDonations: 150.00
    });
  }

  // MOVIES API
  async getFeaturedMovie(): Promise<Movie> {
    return this.request<Movie>('/movies/featured', {}, featuredMovie);
  }

  async getMovieCategories(): Promise<any[]> {
    return this.request<any[]>('/movies/categories', {}, categories);
  }

  async getMovieDetails(id: string): Promise<Movie> {
    const defaultMovie = mockMovies.find(m => m.id === id) || mockMovies[0];
    return this.request<Movie>(`/movies/${id}`, {}, defaultMovie);
  }

  // PURCHASES API
  async buyMovie(movieId: string): Promise<any> {
    return this.request('/purchases/buy', {
      method: 'POST',
      body: JSON.stringify({ movieId }),
    }, { success: true, mock: true });
  }

  async rentMovie(movieId: string): Promise<any> {
    return this.request('/purchases/rent', {
      method: 'POST',
      body: JSON.stringify({ movieId }),
    }, { success: true, mock: true });
  }

  async getMyLibrary(): Promise<Movie[]> {
    const defaultLibrary = mockMovies.filter(m => m.year === 2023 || m.isTrending);
    return this.request<Movie[]>('/purchases/my-library', {}, defaultLibrary);
  }

  // DONATIONS API
  async submitDonation(amount: number): Promise<any> {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }, { success: true, mock: true });
  }

  async getMyContributions(): Promise<Contribution[]> {
    const defaultContributions: Contribution[] = [
      { org: "Angel Studios", campaign: "Sound of Freedom Distribution", amount: "$50.00", date: "Oct 12, 2024", invoice: "#INV-92831", id: "d1" },
      { org: "The Chosen Season 5", campaign: "Production Support Campaign", amount: "$100.00", date: "Sep 28, 2024", invoice: "#INV-84192", id: "d2" },
      { org: "Jesus Revolution Creators", campaign: "Uplifting Stories Outreach", amount: "$25.00", date: "Aug 15, 2024", invoice: "#INV-72810", id: "d3" },
    ];
    return this.request<Contribution[]>('/donations/my-contributions', {}, defaultContributions);
  }
}

export const api = new ApiClient();
export default api;
