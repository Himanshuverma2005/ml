import { apiService, MovieRecommendation, MultipleMovieRecommendation } from '../services/api';

export type Mood = 'Happy' | 'Relaxed' | 'Melancholic' | 'Romantic' | 'Excited' | 'Adventurous';
export type Weather = 'Sunny' | 'Rainy' | 'Cloudy' | 'Snowy';
export type DayType = 'Weekday' | 'Weekend';

export interface RecommendationInput {
  mood: Mood;
  weather: Weather;
  day: DayType;
}

export interface ScoredMovie {
  id: string;
  title: string;
  poster: string;
  confidence: number;
  rank?: number;
  year?: number;
  genres?: string[];
  description?: string;
}

export class MLMovieRecommender {
  private static instance: MLMovieRecommender;
  private isConnected: boolean = false;
  private connectionChecked: boolean = false;

  private constructor() { }

  static getInstance(): MLMovieRecommender {
    if (!MLMovieRecommender.instance) {
      MLMovieRecommender.instance = new MLMovieRecommender();
    }
    return MLMovieRecommender.instance;
  }

  // Check if backend is connected
  async checkConnection(): Promise<boolean> {
    if (this.connectionChecked) {
      return this.isConnected;
    }

    try {
      this.isConnected = await apiService.testConnection();
      this.connectionChecked = true;
      return this.isConnected;
    } catch (error) {
      console.error('Failed to connect to ML backend:', error);
      this.isConnected = false;
      this.connectionChecked = true;
      return false;
    }
  }

  // Get available options from backend
  async getAvailableOptions(): Promise<{ moods: Mood[]; weather: Weather[]; days: DayType[] } | null> {
    try {
      const options = await apiService.getAvailableOptions();
      return {
        moods: options.moods as Mood[],
        weather: options.weather as Weather[],
        days: options.days as DayType[]
      };
    } catch (error) {
      console.error('Failed to get available options:', error);
      return null;
    }
  }

  // Convert API recommendation to frontend format
  private convertRecommendation(rec: MovieRecommendation): ScoredMovie {
    return {
      id: rec.movie_title, // Use title as ID for now
      title: rec.movie_title,
      poster: '', // No poster URL needed
      confidence: rec.confidence,
      year: rec.year || 2020,
      genres: rec.genre ? [rec.genre] : ['Bollywood/Hollywood'],
      description: rec.description || `A great movie for your ${rec.input_parameters.mood.toLowerCase()} mood on a ${rec.input_parameters.weather.toLowerCase()} ${rec.input_parameters.day.toLowerCase()}.`
    };
  }

  // Convert multiple recommendations to frontend format
  private convertMultipleRecommendations(recs: MultipleMovieRecommendation[]): ScoredMovie[] {
    return recs.map(rec => ({
      id: rec.movie_title,
      title: rec.movie_title,
      poster: '', // No poster URL needed
      confidence: rec.confidence,
      rank: rec.rank,
      year: rec.year || 2020,
      genres: rec.genre ? [rec.genre] : ['Bollywood/Hollywood'],
      description: rec.description || `Ranked #${rec.rank} with ${Math.round(rec.confidence * 100)}% confidence.`
    }));
  }

  // Get single recommendation
  async getRecommendation(input: RecommendationInput): Promise<ScoredMovie | null> {
    try {
      const recommendation = await apiService.getRecommendation({
        mood: input.mood,
        weather: input.weather,
        day: input.day
      });

      return this.convertRecommendation(recommendation);
    } catch (error) {
      console.error('Failed to get recommendation:', error);
      return null;
    }
  }

  // Get multiple recommendations
  async getMultipleRecommendations(
    input: RecommendationInput,
    limit: number = 6
  ): Promise<ScoredMovie[]> {
    try {
      const recommendations = await apiService.getMultipleRecommendations({
        mood: input.mood,
        weather: input.weather,
        day: input.day,
        num_recommendations: Math.min(limit, 10) // API limit is 10
      });

      return this.convertMultipleRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to get multiple recommendations:', error);
      return [];
    }
  }

  // Get model information
  async getModelInfo(): Promise<any> {
    try {
      return await apiService.getModelInfo();
    } catch (error) {
      console.error('Failed to get model info:', error);
      return null;
    }
  }

  // Fallback recommendations (if API is not available)
  getFallbackRecommendations(limit: number = 6): ScoredMovie[] {
    const fallbackMovies: ScoredMovie[] = [
      {
        id: '3-idiots',
        title: '3 Idiots',
        poster: '', // No poster URL needed
        confidence: 0.85,
        year: 2009,
        genres: ['Comedy', 'Drama'],
        description: 'A comedy about three engineering students and their journey through college.'
      },
      {
        id: 'lagaan',
        title: 'Lagaan',
        poster: '', // No poster URL needed
        confidence: 0.82,
        year: 2001,
        genres: ['Drama', 'Sport'],
        description: 'A period drama about a cricket match between British officers and Indian villagers.'
      },
      {
        id: 'dil-chahta-hai',
        title: 'Dil Chahta Hai',
        poster: '', // No poster URL needed
        confidence: 0.78,
        year: 2001,
        genres: ['Drama', 'Romance'],
        description: 'A coming-of-age story about three friends and their relationships.'
      },
      {
        id: 'jab-we-met',
        title: 'Jab We Met',
        poster: '', // No poster URL needed
        confidence: 0.75,
        year: 2007,
        genres: ['Romance', 'Comedy'],
        description: 'A romantic comedy about two strangers who meet on a train journey.'
      },
      {
        id: 'queen',
        title: 'Queen',
        poster: '', // No poster URL needed
        confidence: 0.72,
        year: 2014,
        genres: ['Comedy', 'Drama'],
        description: 'A woman embarks on her honeymoon alone after her fiancé calls off their wedding.'
      },
      {
        id: 'pk',
        title: 'PK',
        poster: '', // No poster URL needed
        confidence: 0.70,
        year: 2014,
        genres: ['Comedy', 'Drama'],
        description: 'An alien who comes to Earth on a research mission gets lost in Rajasthan.'
      }
    ];

    return fallbackMovies.slice(0, limit);
  }
}

// Export singleton instance
export const mlRecommender = MLMovieRecommender.getInstance(); 