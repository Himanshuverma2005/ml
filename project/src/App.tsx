import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MoodSelector } from './components/MoodSelector';
import { WeatherSelector } from './components/WeatherSelector';
import { DaySelector } from './components/DaySelector';
import { RecommendationButton } from './components/RecommendationButton';
import { MovieCard } from './components/MovieCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { mlRecommender, Mood, Weather, DayType, ScoredMovie } from './utils/mlRecommender';

function App() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<Weather | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayType | null>(null);
  const [recommendations, setRecommendations] = useState<ScoredMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Auto-detect day type based on current day
    const today = new Date();
    const dayOfWeek = today.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    setSelectedDay(isWeekend ? 'Weekend' : 'Weekday');

    // Check API connection
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      const connected = await mlRecommender.checkConnection();
      setApiConnected(connected);
      if (!connected) {
        console.warn('ML Backend not connected. Using fallback recommendations.');
      }
    } catch (error) {
      console.error('Failed to check API connection:', error);
      setApiConnected(false);
    }
  };

  const canGetRecommendations = selectedMood && selectedWeather && selectedDay;

  const getRecommendations = async () => {
    if (!canGetRecommendations) return;

    setLoading(true);
    setShowRecommendations(false);
    setError(null);

    try {
      let recs: ScoredMovie[] = [];

      if (apiConnected) {
        // Use ML-powered backend
        recs = await mlRecommender.getMultipleRecommendations({
          mood: selectedMood,
          weather: selectedWeather,
          day: selectedDay
        }, 6);
      } else {
        // Use fallback recommendations
        recs = mlRecommender.getFallbackRecommendations(6);
      }

      setRecommendations(recs);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      setError('Failed to get recommendations. Please try again.');
      // Use fallback recommendations
      const fallbackRecs = mlRecommender.getFallbackRecommendations(6);
      setRecommendations(fallbackRecs);
      setShowRecommendations(true);
    } finally {
      setLoading(false);
    }
  };

  const resetSelections = () => {
    setSelectedMood(null);
    setSelectedWeather(null);
    const today = new Date();
    const dayOfWeek = today.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    setSelectedDay(isWeekend ? 'Weekend' : 'Weekday');
    setShowRecommendations(false);
    setRecommendations([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        {/* API Connection Status */}
        {apiConnected !== null && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
              apiConnected 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                apiConnected ? 'bg-green-400' : 'bg-yellow-400'
              }`}></div>
              {apiConnected 
                ? '🤖 ML-Powered Recommendations Active' 
                : '⚠️ Using Fallback Recommendations (ML Backend Unavailable)'
              }
            </div>
          </div>
        )}
        
        {!showRecommendations ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <MoodSelector 
              selectedMood={selectedMood} 
              onMoodSelect={setSelectedMood} 
            />
            
            <WeatherSelector 
              selectedWeather={selectedWeather} 
              onWeatherSelect={setSelectedWeather} 
            />
            
            <DaySelector 
              selectedDay={selectedDay} 
              onDaySelect={setSelectedDay} 
            />
            
            <div className="pt-4">
              <RecommendationButton
                onClick={getRecommendations}
                disabled={!canGetRecommendations}
                loading={loading}
              />
            </div>
            
            {loading && <LoadingSpinner />}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Perfect Movies for Your {selectedMood} {selectedWeather} {selectedDay}!
              </h2>
              <p className="text-gray-300 mb-6">
                {apiConnected 
                  ? 'Here are your AI-powered recommendations based on your current mood and situation'
                  : 'Here are some great movie suggestions for your current mood and situation'
                }
              </p>
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <button
                onClick={resetSelections}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                Try Different Preferences
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((movie, index) => (
                <div key={movie.id} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <MovieCard movie={movie} showScore={true} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default App;