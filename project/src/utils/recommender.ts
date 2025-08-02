import { Movie } from '../types/movie';
import { movies } from '../data/movies';

export type Mood = 'happy' | 'sad' | 'excited' | 'relaxed' | 'romantic' | 'adventurous';
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'snowy';
export type DayType = 'weekday' | 'weekend';

export interface RecommendationInput {
  mood: Mood;
  weather: Weather;
  dayType: DayType;
  preferences?: {
    moodWeight: number;
    weatherWeight: number;
    dayWeight: number;
    ratingWeight: number;
  };
}

export interface ScoredMovie extends Movie {
  totalScore: number;
  breakdown: {
    moodScore: number;
    weatherScore: number;
    dayScore: number;
    ratingScore: number;
  };
}

export class MovieRecommender {
  private static instance: MovieRecommender;
  private movieDatabase: Movie[] = movies;

  private constructor() {}

  static getInstance(): MovieRecommender {
    if (!MovieRecommender.instance) {
      MovieRecommender.instance = new MovieRecommender();
    }
    return MovieRecommender.instance;
  }

  private normalizeScore(score: number, max: number = 10): number {
    return Math.min(score / max, 1);
  }

  private calculateMovieScore(movie: Movie, input: RecommendationInput): ScoredMovie {
    const weights = input.preferences || {
      moodWeight: 0.4,
      weatherWeight: 0.3,
      dayWeight: 0.2,
      ratingWeight: 0.1
    };

    // Calculate individual scores
    const moodScore = this.normalizeScore(movie.moodScore[input.mood]);
    const weatherScore = this.normalizeScore(movie.weatherScore[input.weather]);
    const dayScore = this.normalizeScore(movie.dayScore[input.dayType]);
    const ratingScore = this.normalizeScore(movie.rating, 10);

    // Apply weights and calculate total score
    const totalScore = 
      moodScore * weights.moodWeight +
      weatherScore * weights.weatherWeight +
      dayScore * weights.dayWeight +
      ratingScore * weights.ratingWeight;

    return {
      ...movie,
      totalScore: Math.round(totalScore * 100) / 100,
      breakdown: {
        moodScore: Math.round(moodScore * 100) / 100,
        weatherScore: Math.round(weatherScore * 100) / 100,
        dayScore: Math.round(dayScore * 100) / 100,
        ratingScore: Math.round(ratingScore * 100) / 100
      }
    };
  }

  recommend(input: RecommendationInput, limit: number = 6): ScoredMovie[] {
    // Score all movies
    const scoredMovies = this.movieDatabase.map(movie => 
      this.calculateMovieScore(movie, input)
    );

    // Sort by total score (descending) and return top recommendations
    return scoredMovies
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);
  }

  getRandomRecommendations(limit: number = 3): Movie[] {
    const shuffled = [...this.movieDatabase].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }
}

export const recommender = MovieRecommender.getInstance();