export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-1871f.up.railway.app';

class AdminApiClient {
  private getHeaders(isJson = true) {
    const headers: Record<string, string> = {};
    if (isJson) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // For FormData, do not set Content-Type so browser sets it with boundary
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
    if (!isFormData && options.body && typeof options.body === 'string') {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Admin API error ${response.status}: ${err}`);
    }

    return await response.json() as T;
  }

  // MOVIES CRUD
  async createMovie(data: FormData | any): Promise<any> {
    const isFormData = data instanceof FormData;
    return this.request('/admin/movies', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  }

  async updateMovie(id: string, data: FormData | any): Promise<any> {
    const isFormData = data instanceof FormData;
    return this.request(`/admin/movies/${id}`, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
    });
  }

  async deleteMovie(id: string): Promise<any> {
    return this.request(`/admin/movies/${id}`, {
      method: 'DELETE',
    });
  }

  // USERS, ORDERS, DONATIONS, MINISTRIES
  async getUsers(): Promise<any[]> {
    return this.request<any[]>('/admin/users');
  }

  async getOrders(): Promise<any[]> {
    return this.request<any[]>('/admin/orders');
  }

  async getDonations(): Promise<any[]> {
    return this.request<any[]>('/admin/donations');
  }

  async getMinistries(): Promise<any[]> {
    return this.request<any[]>('/admin/ministries');
  }

  async getAnalytics(): Promise<any> {
    return this.request<any>('/admin/analytics');
  }
}

export const adminApi = new AdminApiClient();
export default adminApi;
