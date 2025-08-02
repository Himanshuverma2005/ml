# Bollywood Movie Recommendation Backend

A machine learning-based movie recommendation system that suggests Bollywood movies based on mood, weather, and day type. Now with enhanced movie metadata including year, genre, and detailed descriptions!

## Features

- **ML-Powered Recommendations**: Uses Random Forest Classifier trained on enhanced CSV data
- **Enhanced Movie Metadata**: Real year, genre, and detailed descriptions for each movie
- **Smart CSV Parsing**: Handles commas in movie descriptions automatically
- **RESTful API**: FastAPI-based endpoints for easy integration
- **Multiple Recommendations**: Get single or multiple movie suggestions
- **Confidence Scores**: Each recommendation comes with a confidence score
- **Input Validation**: Validates mood, weather, and day inputs
- **CORS Support**: Ready for frontend integration
- **Data Quality Checks**: Automatic handling of missing values and single-occurrence movies

## Project Structure

```
backend/
├── app.py                          # FastAPI application with enhanced metadata
├── recommender.py                  # ML recommendation logic with metadata support
├── train_model.py                  # Enhanced model training script
├── requirements.txt                # Python dependencies
├── movie_recommendation_dataset.csv  # Enhanced training data with year, genre, description
├── README.md                       # This file
└── Generated files (after training):
    ├── model.pkl                   # Trained model
    ├── mood_encoder.pkl            # Mood label encoder
    ├── weather_encoder.pkl         # Weather label encoder
    ├── day_encoder.pkl             # Day label encoder
    ├── movie_encoder.pkl           # Movie label encoder
    ├── movie_metadata.json         # Enhanced movie metadata
    └── encoder_mappings.json       # Encoder mappings
```

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Train the Model

First, train the recommendation model using your enhanced CSV data:

```bash
python train_model.py
```

This will:
- **Clean and parse** your CSV data (handles commas in descriptions)
- **Load and analyze** your enhanced dataset with 415+ entries
- **Remove single-occurrence movies** for better training
- **Train a Random Forest Classifier** with enhanced features
- **Save the trained model and encoders**
- **Generate enhanced metadata files** with year, genre, and descriptions

### 3. Start the API Server

```bash
python app.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### 1. Root Endpoint
- **GET** `/`
- Returns API information and available endpoints

### 2. Health Check
- **GET** `/health`
- Returns API health status

### 3. Get Available Options
- **GET** `/options`
- Returns available moods, weather conditions, and day types

### 4. Single Movie Recommendation
- **POST** `/recommend`
- **Request Body:**
```json
{
    "mood": "Happy",
    "weather": "Sunny",
    "day": "Weekend"
}
```
- **Response:**
```json
{
    "movie_title": "3 Idiots",
    "confidence": 0.85,
    "input_parameters": {
        "mood": "Happy",
        "weather": "Sunny",
        "day": "Weekend"
    },
    "year": 2009,
    "genre": "Bollywood",
    "description": "A comedy about three engineering students and their journey through college."
}
```

### 5. Multiple Movie Recommendations
- **POST** `/recommendations`
- **Request Body:**
```json
{
    "mood": "Happy",
    "weather": "Sunny",
    "day": "Weekend",
    "num_recommendations": 5
}
```
- **Response:**
```json
[
    {
        "movie_title": "3 Idiots",
        "confidence": 0.85,
        "rank": 1,
        "year": 2009,
        "genre": "Bollywood",
        "description": "A comedy about three engineering students and their journey through college."
    },
    {
        "movie_title": "Yeh Jawaani Hai Deewani",
        "confidence": 0.72,
        "rank": 2,
        "year": 2013,
        "genre": "Bollywood",
        "description": "A romantic drama about friendship, love, and life choices."
    }
]
```

### 6. Model Information
- **GET** `/model-info`
- Returns information about the trained model

## Available Input Options

Based on your enhanced CSV data, the following options are available:

### Moods
- Happy
- Relaxed
- Melancholic
- Romantic
- Excited
- Adventurous

### Weather
- Sunny
- Rainy
- Cloudy
- Snowy

### Days
- Weekday
- Weekend

## Enhanced Dataset Features

### Movie Metadata
- **Year Range**: 1993-2023
- **Genres**: Hollywood, Bollywood
- **Descriptions**: Detailed movie descriptions with proper comma handling
- **Data Quality**: 415+ entries with comprehensive mood-weather-day combinations

### Smart Data Processing
- **CSV Cleaning**: Automatically handles commas in descriptions
- **Encoding Support**: UTF-8 and Latin-1 encoding support
- **Missing Value Handling**: Automatic detection and removal
- **Single-occurrence Filtering**: Removes movies that appear only once for better training

## Usage Examples

### Using curl

```bash
# Get a single recommendation with enhanced metadata
curl -X POST "http://localhost:8000/recommend" \
     -H "Content-Type: application/json" \
     -d '{"mood": "Happy", "weather": "Sunny", "day": "Weekend"}'

# Get multiple recommendations with metadata
curl -X POST "http://localhost:8000/recommendations" \
     -H "Content-Type: application/json" \
     -d '{"mood": "Happy", "weather": "Sunny", "day": "Weekend", "num_recommendations": 3}'

# Get available options
curl -X GET "http://localhost:8000/options"
```

### Using Python requests

```python
import requests

# Single recommendation with enhanced metadata
response = requests.post("http://localhost:8000/recommend", json={
    "mood": "Happy",
    "weather": "Sunny", 
    "day": "Weekend"
})
recommendation = response.json()
print(f"Recommended movie: {recommendation['movie_title']}")
print(f"Year: {recommendation['year']}")
print(f"Genre: {recommendation['genre']}")
print(f"Description: {recommendation['description']}")

# Multiple recommendations with metadata
response = requests.post("http://localhost:8000/recommendations", json={
    "mood": "Happy",
    "weather": "Sunny",
    "day": "Weekend",
    "num_recommendations": 5
})
recommendations = response.json()
for rec in recommendations:
    print(f"{rec['rank']}. {rec['movie_title']} ({rec['year']}, {rec['genre']})")
    print(f"   Confidence: {rec['confidence']:.2f}")
    print(f"   Description: {rec['description']}")
```

## API Documentation

Once the server is running, you can access:
- **Interactive API docs**: `http://localhost:8000/docs`
- **ReDoc documentation**: `http://localhost:8000/redoc`

## Model Details

- **Algorithm**: Random Forest Classifier
- **Features**: mood, weather, day (encoded as categorical variables)
- **Target**: movie_title
- **Training**: 80% training, 20% testing split
- **Class Weight**: Balanced to handle class imbalance
- **Enhanced Filtering**: Removes single-occurrence movies for better training
- **Data Quality**: 415+ entries with comprehensive metadata

## Error Handling

The API includes comprehensive error handling:
- **400 Bad Request**: Invalid input parameters
- **500 Internal Server Error**: Model loading or prediction errors
- **Validation**: Input validation for mood, weather, and day values
- **CSV Parsing**: Robust handling of malformed CSV data
- **Encoding Issues**: Automatic fallback for different file encodings

## Frontend Integration

The API is ready for frontend integration with:
- **Enhanced Metadata**: Year, genre, and descriptions in responses
- **CORS enabled** for cross-origin requests
- **JSON request/response format**
- **Clear error messages**
- **Comprehensive documentation**

## Troubleshooting

1. **Model not found error**: Run `python train_model.py` first
2. **Port already in use**: Change the port in `app.py` or kill the existing process
3. **Import errors**: Ensure all dependencies are installed with `pip install -r requirements.txt`
4. **CSV file not found**: Ensure `movie_recommendation_dataset.csv` is in the backend directory
5. **CSV parsing errors**: The enhanced parser handles commas in descriptions automatically
6. **Encoding issues**: The system supports both UTF-8 and Latin-1 encodings

## Performance

- **Model Loading**: ~1-2 seconds on startup
- **Prediction Time**: ~10-50ms per recommendation
- **Memory Usage**: ~50-100MB (depending on dataset size)
- **Concurrent Requests**: FastAPI handles multiple requests efficiently
- **Enhanced Metadata**: Real movie information with year, genre, and descriptions 