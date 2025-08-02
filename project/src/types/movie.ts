export interface Movie {
  id: number;
  title: string;
  genres: string[];
  rating: number;
  year: number;
  director: string;
  description: string;
  poster: string;
  duration: number;
  moodScore: {
    happy: number;
    sad: number;
    excited: number;
    relaxed: number;
    romantic: number;
    adventurous: number;
  };
  weatherScore: {
    sunny: number;
    rainy: number;
    cloudy: number;
    snowy: number;
  };
  dayScore: {
    weekday: number;
    weekend: number;
  };
}