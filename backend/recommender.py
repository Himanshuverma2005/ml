import joblib
import json
import numpy as np
from typing import Dict, List, Optional

class MovieRecommender:
    """
    Movie recommendation system using trained ML model.
    """
    
    def __init__(self):
        self.model = None
        self.mood_encoder = None
        self.weather_encoder = None
        self.day_encoder = None
        self.movie_encoder = None
        self.movie_metadata = None
        self.encoder_mappings = None
        self.load_model()
    
    def load_model(self):
        """Load the trained model and encoders."""
        try:
            self.model = joblib.load('model.pkl')
            self.mood_encoder = joblib.load('mood_encoder.pkl')
            self.weather_encoder = joblib.load('weather_encoder.pkl')
            self.day_encoder = joblib.load('day_encoder.pkl')
            self.movie_encoder = joblib.load('movie_encoder.pkl')
            
            # Load movie metadata
            with open('movie_metadata.json', 'r') as f:
                self.movie_metadata = json.load(f)
            
            # Load encoder mappings
            with open('encoder_mappings.json', 'r') as f:
                self.encoder_mappings = json.load(f)
                
            print("Model and encoders loaded successfully!")
            
        except FileNotFoundError as e:
            print(f"Error loading model files: {e}")
            print("Please run train_model.py first to train the model.")
            raise
    
    def get_available_options(self) -> Dict[str, List[str]]:
        """Get available options for mood, weather, and day."""
        return {
            'moods': list(self.encoder_mappings['mood'].values()),
            'weather': list(self.encoder_mappings['weather'].values()),
            'days': list(self.encoder_mappings['day'].values())
        }
    
    def recommend_movie(self, mood: str, weather: str, day: str) -> Dict:
        """
        Recommend a movie based on mood, weather, and day.
        
        Args:
            mood: User's mood (e.g., 'Happy', 'Relaxed', 'Melancholic')
            weather: Current weather (e.g., 'Sunny', 'Rainy', 'Cloudy', 'Snowy')
            day: Day type (e.g., 'Weekday', 'Weekend')
            
        Returns:
            Dictionary containing recommended movie information
        """
        try:
            # Validate inputs
            if mood not in self.encoder_mappings['mood'].values():
                raise ValueError(f"Invalid mood: {mood}. Available moods: {list(self.encoder_mappings['mood'].values())}")
            
            if weather not in self.encoder_mappings['weather'].values():
                raise ValueError(f"Invalid weather: {weather}. Available weather: {list(self.encoder_mappings['weather'].values())}")
            
            if day not in self.encoder_mappings['day'].values():
                raise ValueError(f"Invalid day: {day}. Available days: {list(self.encoder_mappings['day'].values())}")
            
            # Encode inputs
            mood_encoded = self.mood_encoder.transform([mood])[0]
            weather_encoded = self.weather_encoder.transform([weather])[0]
            day_encoded = self.day_encoder.transform([day])[0]
            
            # Prepare feature vector
            features = np.array([[mood_encoded, weather_encoded, day_encoded]])
            
            # Get prediction
            movie_encoded = self.model.predict(features)[0]
            movie_title = self.movie_encoder.inverse_transform([movie_encoded])[0]
            
            # Get movie metadata
            movie_info = next((movie for movie in self.movie_metadata if movie['movie_title'] == movie_title), None)
            
            return {
                'movie_title': movie_title,
                'confidence': self._get_confidence_score(features, movie_encoded),
                'input_parameters': {
                    'mood': mood,
                    'weather': weather,
                    'day': day
                },
                'year': movie_info.get('year') if movie_info else None,
                'genre': movie_info.get('genre') if movie_info else None,
                'description': movie_info.get('description') if movie_info else None
            }
                
        except Exception as e:
            raise Exception(f"Error in recommendation: {str(e)}")
    
    def _get_confidence_score(self, features: np.ndarray, predicted_class: int) -> float:
        """Get confidence score for the prediction."""
        try:
            # Get prediction probabilities
            probabilities = self.model.predict_proba(features)[0]
            confidence = probabilities[predicted_class]
            return float(confidence)
        except:
            return 0.5  # Default confidence if probability calculation fails
    
    def get_multiple_recommendations(self, mood: str, weather: str, day: str, num_recommendations: int = 3) -> List[Dict]:
        """
        Get multiple movie recommendations based on mood, weather, and day.
        
        Args:
            mood: User's mood
            weather: Current weather
            day: Day type
            num_recommendations: Number of recommendations to return
            
        Returns:
            List of recommended movies
        """
        try:
            # Encode inputs
            mood_encoded = self.mood_encoder.transform([mood])[0]
            weather_encoded = self.weather_encoder.transform([weather])[0]
            day_encoded = self.day_encoder.transform([day])[0]
            
            # Prepare feature vector
            features = np.array([[mood_encoded, weather_encoded, day_encoded]])
            
            # Get prediction probabilities
            probabilities = self.model.predict_proba(features)[0]
            
            # Get top N predictions
            top_indices = np.argsort(probabilities)[::-1][:num_recommendations]
            
            recommendations = []
            for idx in top_indices:
                movie_title = self.movie_encoder.inverse_transform([idx])[0]
                movie_info = next((movie for movie in self.movie_metadata if movie['movie_title'] == movie_title), None)
                
                recommendation = {
                    'movie_title': movie_title,
                    'confidence': float(probabilities[idx]),
                    'rank': len(recommendations) + 1,
                    'year': movie_info.get('year') if movie_info else None,
                    'genre': movie_info.get('genre') if movie_info else None,
                    'description': movie_info.get('description') if movie_info else None
                }
                recommendations.append(recommendation)
            
            return recommendations
            
        except Exception as e:
            raise Exception(f"Error in multiple recommendations: {str(e)}")

# Global recommender instance
recommender = None

def get_recommender() -> MovieRecommender:
    """Get or create the global recommender instance."""
    global recommender
    if recommender is None:
        recommender = MovieRecommender()
    return recommender
