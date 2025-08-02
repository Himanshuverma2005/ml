from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from recommender import get_recommender, MovieRecommender

# Initialize FastAPI app
app = FastAPI(
    title="Bollywood Movie Recommendation API",
    description="A machine learning-based movie recommendation system that suggests Bollywood movies based on mood, weather, and day type.",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class RecommendationRequest(BaseModel):
    mood: str
    weather: str
    day: str

class MovieRecommendation(BaseModel):
    movie_title: str
    confidence: float
    input_parameters: dict
    year: Optional[int] = None
    genre: Optional[str] = None
    description: Optional[str] = None

class MultipleRecommendationRequest(BaseModel):
    mood: str
    weather: str
    day: str
    num_recommendations: Optional[int] = 3

class MultipleMovieRecommendation(BaseModel):
    movie_title: str
    confidence: float
    rank: int
    year: Optional[int] = None
    genre: Optional[str] = None
    description: Optional[str] = None

class AvailableOptionsResponse(BaseModel):
    moods: List[str]
    weather: List[str]
    days: List[str]

# Global recommender instance
recommender: MovieRecommender = None

@app.on_event("startup")
async def startup_event():
    """Initialize the recommender on startup."""
    global recommender
    try:
        recommender = get_recommender()
        print("Movie recommendation API started successfully!")
    except Exception as e:
        print(f"Error starting API: {e}")
        print("Please ensure you have trained the model first by running train_model.py")

@app.get("/", response_model=dict)
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Bollywood Movie Recommendation API",
        "version": "1.0.0",
        "endpoints": {
            "GET /options": "Get available mood, weather, and day options",
            "POST /recommend": "Get a single movie recommendation",
            "POST /recommendations": "Get multiple movie recommendations",
            "GET /health": "Health check endpoint"
        }
    }

@app.get("/health", response_model=dict)
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "message": "Movie recommendation API is running"
    }

@app.get("/options", response_model=AvailableOptionsResponse)
async def get_available_options():
    """Get available options for mood, weather, and day."""
    try:
        if recommender is None:
            raise HTTPException(status_code=500, detail="Recommender not initialized")
        
        options = recommender.get_available_options()
        return AvailableOptionsResponse(**options)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting options: {str(e)}")

@app.post("/recommend", response_model=MovieRecommendation)
async def recommend_movie(request: RecommendationRequest):
    """
    Get a single movie recommendation based on mood, weather, and day.
    
    Example request:
    {
        "mood": "Happy",
        "weather": "Sunny", 
        "day": "Weekend"
    }
    """
    try:
        if recommender is None:
            raise HTTPException(status_code=500, detail="Recommender not initialized")
        
        recommendation = recommender.recommend_movie(
            mood=request.mood,
            weather=request.weather,
            day=request.day
        )
        
        return MovieRecommendation(**recommendation)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in recommendation: {str(e)}")

@app.post("/recommendations", response_model=List[MultipleMovieRecommendation])
async def get_multiple_recommendations(request: MultipleRecommendationRequest):
    """
    Get multiple movie recommendations based on mood, weather, and day.
    
    Example request:
    {
        "mood": "Happy",
        "weather": "Sunny",
        "day": "Weekend", 
        "num_recommendations": 5
    }
    """
    try:
        if recommender is None:
            raise HTTPException(status_code=500, detail="Recommender not initialized")
        
        # Validate num_recommendations
        if request.num_recommendations < 1 or request.num_recommendations > 10:
            raise HTTPException(
                status_code=400, 
                detail="num_recommendations must be between 1 and 10"
            )
        
        recommendations = recommender.get_multiple_recommendations(
            mood=request.mood,
            weather=request.weather,
            day=request.day,
            num_recommendations=request.num_recommendations
        )
        
        return [MultipleMovieRecommendation(**rec) for rec in recommendations]
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in recommendations: {str(e)}")

@app.get("/model-info", response_model=dict)
async def get_model_info():
    """Get information about the trained model."""
    try:
        if recommender is None:
            raise HTTPException(status_code=500, detail="Recommender not initialized")
        
        # Get some basic model information
        options = recommender.get_available_options()
        
        return {
            "model_type": "Random Forest Classifier",
            "features": ["mood", "weather", "day"],
            "target": "movie_title",
            "available_options": options,
            "total_movies": len(options.get("movies", [])),
            "status": "loaded"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting model info: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
