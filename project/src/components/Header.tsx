import React from 'react';
import { Film, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="inline-flex items-center justify-center space-x-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
          <Film size={32} className="text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Movie Night Buddy
        </h1>
        <Sparkles size={24} className="text-yellow-400 animate-pulse" />
      </div>
      <p className="text-gray-300 text-lg max-w-2xl mx-auto">
        Your AI-powered movie companion that recommends the perfect film based on your mood, weather, and the day of the week
      </p>
    </header>
  );
};