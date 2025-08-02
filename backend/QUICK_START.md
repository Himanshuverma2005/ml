# 🚀 Quick Start Guide

Get your Bollywood Movie Recommendation Backend running in 3 simple steps!

## Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 2: Start the Backend

```bash
python start_backend.py
```

This will:
- ✅ Check if your CSV file exists
- 🤖 Train the ML model (if needed)
- 🌐 Start the FastAPI server
- 📚 Open API documentation

## Step 3: Test the API

Once the server is running, you can:

### Visit the API Documentation
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Test with curl
```bash
# Get a movie recommendation
curl -X POST "http://localhost:8000/recommend" \
     -H "Content-Type: application/json" \
     -d '{"mood": "Happy", "weather": "Sunny", "day": "Weekend"}'
```

### Test with Python
```python
import requests

response = requests.post("http://localhost:8000/recommend", json={
    "mood": "Happy",
    "weather": "Sunny", 
    "day": "Weekend"
})
print(response.json())
```

## Available Inputs

### Moods
- Happy, Relaxed, Melancholic, Romantic, Excited, Adventurous

### Weather
- Sunny, Rainy, Cloudy, Snowy

### Days
- Weekday, Weekend

## Example Response

```json
{
    "movie_title": "3 Idiots",
    
    "confidence": 0.85,
    "input_parameters": {
        "mood": "Happy",
        "weather": "Sunny",
        "day": "Weekend"
    }
}
```

## Troubleshooting

- **Port 8000 in use**: Kill the process or change port in `app.py`
- **Model training fails**: Check your CSV file format
- **Import errors**: Make sure all dependencies are installed

## Next Steps

1. **Frontend Integration**: Connect your React frontend to the API
2. **Customization**: Modify the model parameters in `train_model.py`
3. **Deployment**: Deploy to cloud platforms like Heroku, AWS, or Railway

---

🎬 **Your ML-powered movie recommendation system is ready!** 