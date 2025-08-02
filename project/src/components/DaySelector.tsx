import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { DayType } from '../utils/mlRecommender';

interface DaySelectorProps {
  selectedDay: DayType | null;
  onDaySelect: (day: DayType) => void;
}

const dayOptions = [
  { id: 'Weekday' as DayType, label: 'Weekday', icon: Clock, color: 'bg-blue-500', description: 'Monday - Friday' },
  { id: 'Weekend' as DayType, label: 'Weekend', icon: Calendar, color: 'bg-purple-500', description: 'Saturday - Sunday' }
];

export const DaySelector: React.FC<DaySelectorProps> = ({ selectedDay, onDaySelect }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">What type of day is it?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dayOptions.map((day) => {
          const Icon = day.icon;
          const isSelected = selectedDay === day.id;
          
          return (
            <button
              key={day.id}
              onClick={() => onDaySelect(day.id)}
              className={`
                relative p-6 rounded-xl transition-all duration-300 transform hover:scale-105
                ${isSelected 
                  ? `${day.color} text-white shadow-lg scale-105` 
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40'
                }
              `}
            >
              <div className="flex items-center space-x-4">
                <Icon size={32} />
                <div className="text-left">
                  <div className="font-medium text-lg">{day.label}</div>
                  <div className="text-sm opacity-75">{day.description}</div>
                </div>
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