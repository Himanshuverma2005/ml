import React from 'react';
import { Heart, Smile, Zap, Coffee, Compass, Frown } from 'lucide-react';
import { Mood } from '../utils/mlRecommender';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
}

const moodOptions = [
  { id: 'Happy' as Mood, label: 'Happy', icon: Smile, color: 'bg-yellow-500', description: 'Feel-good vibes' },
  { id: 'Melancholic' as Mood, label: 'Melancholic', icon: Frown, color: 'bg-blue-600', description: 'Emotional depth' },
  { id: 'Excited' as Mood, label: 'Excited', icon: Zap, color: 'bg-orange-500', description: 'High energy' },
  { id: 'Relaxed' as Mood, label: 'Relaxed', icon: Coffee, color: 'bg-green-500', description: 'Chill & calm' },
  { id: 'Romantic' as Mood, label: 'Romantic', icon: Heart, color: 'bg-pink-500', description: 'Love stories' },
  { id: 'Adventurous' as Mood, label: 'Adventurous', icon: Compass, color: 'bg-purple-500', description: 'Epic journeys' }
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodSelect }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">What's your mood?</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {moodOptions.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.id;
          
          return (
            <button
              key={mood.id}
              onClick={() => onMoodSelect(mood.id)}
              className={`
                relative p-4 rounded-xl transition-all duration-300 transform hover:scale-105
                ${isSelected 
                  ? `${mood.color} text-white shadow-lg scale-105` 
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon size={24} />
                <span className="font-medium text-sm">{mood.label}</span>
                <span className="text-xs opacity-75">{mood.description}</span>
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