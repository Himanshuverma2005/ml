import React from 'react';
import { Star, Clock, User } from 'lucide-react';
import { ScoredMovie } from '../utils/mlRecommender';

interface MovieCardProps {
  movie: ScoredMovie;
  showScore?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, showScore = false }) => {

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 group">
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold mb-2">{movie.title}</h3>
          <p className="text-sm opacity-80">Movie Recommendation</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-black/70 rounded-full px-2 py-1 flex items-center space-x-1">
          <Star size={14} className="text-yellow-400 fill-current" />
          <span className="text-white text-sm font-medium">{movie.year || '2020'}</span>
        </div>
        {showScore && (
          <div className="absolute top-4 left-4 bg-purple-600 rounded-full px-3 py-1">
            <span className="text-white text-sm font-bold">{Math.round(movie.confidence * 100)}%</span>
          </div>
        )}
        {movie.rank && (
          <div className="absolute bottom-4 left-4 bg-orange-600 rounded-full px-3 py-1">
            <span className="text-white text-sm font-bold">#{movie.rank}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{movie.title}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
          <span>{movie.year || '2020'}</span>
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span className="truncate">{movie.genres[0]}</span>
            </div>
          )}
        </div>

        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-white/20 rounded-full text-xs text-white"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <p className="text-gray-300 text-sm line-clamp-3 mb-4">
          {movie.description || 'A great Bollywood movie recommendation for your current mood and situation.'}
        </p>

        {showScore && (
          <div className="border-t border-white/20 pt-4 mt-4">
            <h4 className="text-sm font-semibold text-white mb-2">AI Confidence:</h4>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.round(movie.confidence * 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-300">
              {Math.round(movie.confidence * 100)}% confidence in this recommendation
            </div>
          </div>
        )}
      </div>
    </div>
  );
};