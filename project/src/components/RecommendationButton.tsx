import React from 'react';
import { Wand2, Loader } from 'lucide-react';

interface RecommendationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const RecommendationButton: React.FC<RecommendationButtonProps> = ({ 
  onClick, 
  disabled = false,
  loading = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
    >
      <div className="flex items-center justify-center space-x-2">
        {loading ? (
          <Loader size={24} className="animate-spin" />
        ) : (
          <Wand2 size={24} />
        )}
        <span>
          {loading ? 'Finding Perfect Movies...' : 'Get My Recommendations'}
        </span>
      </div>
    </button>
  );
};