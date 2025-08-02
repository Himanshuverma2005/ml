import React from 'react';
import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';
import { Weather } from '../utils/mlRecommender';

interface WeatherSelectorProps {
  selectedWeather: Weather | null;
  onWeatherSelect: (weather: Weather) => void;
}

const weatherOptions = [
  { id: 'Sunny' as Weather, label: 'Sunny', icon: Sun, color: 'bg-yellow-500', description: 'Clear skies' },
  { id: 'Cloudy' as Weather, label: 'Cloudy', icon: Cloud, color: 'bg-gray-500', description: 'Overcast' },
  { id: 'Rainy' as Weather, label: 'Rainy', icon: CloudRain, color: 'bg-blue-500', description: 'Wet weather' },
  { id: 'Snowy' as Weather, label: 'Snowy', icon: Snowflake, color: 'bg-blue-300', description: 'Winter wonderland' }
];

export const WeatherSelector: React.FC<WeatherSelectorProps> = ({ selectedWeather, onWeatherSelect }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">What's the weather like?</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {weatherOptions.map((weather) => {
          const Icon = weather.icon;
          const isSelected = selectedWeather === weather.id;
          
          return (
            <button
              key={weather.id}
              onClick={() => onWeatherSelect(weather.id)}
              className={`
                relative p-4 rounded-xl transition-all duration-300 transform hover:scale-105
                ${isSelected 
                  ? `${weather.color} text-white shadow-lg scale-105` 
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon size={24} />
                <span className="font-medium text-sm">{weather.label}</span>
                <span className="text-xs opacity-75">{weather.description}</span>
              </div>
              {isSelected && (
                <div className="absolute inset-0 rounded-xl bg-white/20 pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};