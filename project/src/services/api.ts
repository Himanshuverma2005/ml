// API service for connecting with the ML-powered backend

export interface MovieRecommendation {
  movie_title: string;
  confidence: number;
  input_parameters: {
    mood: string;
    weather: string;
    day: string;
  };
  year?: number;
  genre?: string;
  description?: string;
}

export interface MultipleMovieRecommendation {
  movie_title: string;
  confidence: number;
  rank: number;
  year?: number;
  genre?: string;
  description?: string;
}

export interface AvailableOptions {
  moods: string[];
  weather: string[];
  days: string[];
}

export interface RecommendationRequest {
  mood: string;
  weather: string;
  day: string;
}

export interface MultipleRecommendationRequest extends RecommendationRequest {
  num_recommendations?: number;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    // Use environment variable or default to localhost
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get available options (moods, weather, days)
  async getAvailableOptions(): Promise<AvailableOptions> {
    return this.makeRequest<AvailableOptions>('/options');
  }

  // Get a single movie recommendation
  async getRecommendation(request: RecommendationRequest): Promise<MovieRecommendation> {
    return this.makeRequest<MovieRecommendation>('/recommend', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get multiple movie recommendations
  async getMultipleRecommendations(
    request: MultipleRecommendationRequest
  ): Promise<MultipleMovieRecommendation[]> {
    return this.makeRequest<MultipleMovieRecommendation[]>('/recommendations', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.makeRequest<{ status: string; message: string }>('/health');
  }

  // Get model information
  async getModelInfo(): Promise<any> {
    return this.makeRequest('/model-info');
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService(); 