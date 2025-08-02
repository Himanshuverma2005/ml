import React from 'react';
import { Film } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center animate-pulse">
          <Film size={32} className="text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-4 border-purple-400 animate-ping"></div>
      </div>
      <p className="text-white mt-4 text-lg font-medium">Analyzing your preferences...</p>
      <p className="text-gray-300 text-sm mt-2">Our AI is finding the perfect movies for you</p>
    </div>
  );
};