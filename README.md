# 🎬 ML-Powered Bollywood Movie Recommendation App

A complete full-stack application that uses machine learning to recommend Bollywood movies based on your mood, weather, and day type. Now with enhanced movie metadata including year, genre, and detailed descriptions!

## 🌟 Features

### 🤖 ML-Powered Recommendations
- **Random Forest Classifier** trained on enhanced CSV dataset with 415+ entries
- **Real-time predictions** based on mood, weather, and day
- **Confidence scores** for each recommendation
- **Multiple recommendations** with ranking
- **Enhanced movie metadata** including year, genre, and descriptions

### 🎨 Beautiful UI
- **Modern React frontend** with Tailwind CSS
- **Responsive design** that works on all devices
- **Smooth animations** and transitions
- **Real-time connection status** indicator
- **Enhanced movie cards** with detailed information

### 🔧 Robust Backend
- **FastAPI** for high-performance API
- **Automatic model training** from enhanced CSV data
- **Smart CSV parsing** with comma handling in descriptions
- **CORS enabled** for frontend integration
- **Comprehensive error handling**
- **Enhanced metadata support** for movies

## 🚀 Quick Start

### Option 1: One-Command Startup
```bash
python start_app.py
```
This will start both backend and frontend automatically!

### Option 2: Manual Startup

#### 1. Start the ML Backend
```bash
cd backend
pip install -r requirements.txt
python start_backend.py
```

#### 2. Start the React Frontend
```bash
cd project
npm install
npm run dev
```

#### 3. Open the App
Visit `http://localhost:5173` in your browser

## 📁 Project Structure

```
ml/
├── backend/                          # ML Backend (Python/FastAPI)
│   ├── app.py                       # FastAPI application with enhanced metadata
│   ├── recommender.py               # ML recommendation logic with metadata
│   ├── train_model.py               # Enhanced model training script
│   ├── start_backend.py             # Backend startup script
│   ├── test_api.py                  # API testing script
│   ├── requirements.txt             # Python dependencies
│   ├── README.md                    # Backend documentation
│   ├── movie_recommendation_dataset.csv  # Enhanced training data
│   ├── movie_metadata.json          # Movie metadata with year, genre, description
│   └── encoder_mappings.json        # Encoder mappings
├── project/                         # React Frontend
│   ├── src/
│   │   ├── components/              # UI components
│   │   ├── services/                # API service with metadata support
│   │   ├── utils/                   # ML recommender integration
│   │   └── App.tsx                  # Main app component
│   ├── package.json                 # Node.js dependencies
│   └── FRONTEND_INTEGRATION.md      # Frontend documentation
└── start_app.py                     # Complete app startup script
```

## 🎯 How It Works

### 1. User Input
- Select your current mood (Happy, Relaxed, Melancholic, etc.)
- Choose the weather (Sunny, Rainy, Cloudy, Snowy)
- Day type is auto-detected (Weekday/Weekend)

### 2. ML Processing
- Frontend sends request to FastAPI backend
- Random Forest model processes the inputs
- Returns movie recommendations with confidence scores and metadata

### 3. Results Display
- Shows recommended movies with AI confidence
- Displays enhanced movie information (year, genre, description)
- Ranks recommendations by confidence level
- Beautiful movie cards with detailed metadata

## 🔧 API Endpoints

### Backend API (http://localhost:8000)
- `GET /` - API information
- `GET /health` - Health check
- `GET /options` - Available moods, weather, days
- `POST /recommend` - Single movie recommendation with metadata
- `POST /recommendations` - Multiple movie recommendations with metadata
- `GET /model-info` - Model information

### API Documentation
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎨 UI Components

### Enhanced Components
- **MoodSelector**: 6 mood options with icons
- **WeatherSelector**: 4 weather conditions
- **DaySelector**: Auto-detected weekday/weekend
- **MovieCard**: Shows AI confidence, ranking, year, genre, and description
- **Connection Status**: Real-time backend status

### New Features
- **Enhanced Movie Metadata**: Real year, genre, and descriptions
- **AI Confidence Bars**: Visual confidence indicators
- **Ranking Badges**: Shows recommendation rank (#1, #2, etc.)
- **Fallback Mode**: Works even if backend is unavailable
- **Error Handling**: Clear feedback for issues

## 🧪 Testing

### Test the Complete App
1. Start both backend and frontend
2. Select different moods, weather, and days
3. Verify recommendations change appropriately
4. Check confidence scores and rankings
5. Verify movie metadata (year, genre, description) is displayed
6. Test fallback mode by stopping backend

### API Testing
```bash
cd backend
python test_api.py
```

## 📊 ML Model Details

### Enhanced Dataset
- **415+ movie entries** with mood-weather-day combinations
- **Enhanced metadata**: year (1993-2023), genre (Hollywood/Bollywood), descriptions
- **Smart CSV parsing** handles commas in descriptions
- **Data quality checks** with missing value detection

### Algorithm
- **Random Forest Classifier** with 100 trees
- **Feature Engineering**: Label encoding for categorical variables
- **Training**: 80% training, 20% testing split
- **Performance**: Fast predictions with confidence scores
- **Enhanced filtering**: Removes movies with single occurrences for better training

### Features
- **Mood**: 6 categories (Happy, Relaxed, Melancholic, etc.)
- **Weather**: 4 categories (Sunny, Rainy, Cloudy, Snowy)
- **Day**: 2 categories (Weekday, Weekend)

### Output
- **Movie Recommendations**: Based on input combinations
- **Enhanced Metadata**: Year, genre, and detailed descriptions
- **Confidence Scores**: 0-1 scale showing prediction confidence
- **Ranking**: Multiple recommendations ordered by confidence

## 🚀 Deployment

### Frontend Deployment
```bash
cd project
npm run build
# Deploy dist/ folder to Vercel, Netlify, etc.
```

### Backend Deployment
```bash
cd backend
# Deploy to Heroku, Railway, or cloud platform
# Update CORS settings for your domain
```

### Environment Variables
Create `.env` file in `project/` directory:
```env
VITE_API_URL=http://localhost:8000
```

## 🔧 Troubleshooting

### Common Issues
1. **Backend not connecting**: Check if `python start_backend.py` is running
2. **Port conflicts**: Change ports in `app.py` or `vite.config.ts`
3. **Model not found**: Run `python train_model.py` first
4. **CORS errors**: Backend has CORS enabled for localhost
5. **CSV parsing issues**: Enhanced parser handles commas in descriptions

### Debug Mode
- Check browser console for API errors
- Backend logs show request details
- Frontend shows connection status indicator

## 📈 Performance

### Frontend
- **Vite**: Fast development and build times
- **Tailwind CSS**: Optimized CSS bundle
- **React**: Efficient component rendering

### Backend
- **FastAPI**: High-performance async API
- **ML Model**: Loads once on startup
- **Response Time**: < 100ms per recommendation
- **Enhanced Metadata**: Real movie information

## 🎉 What's Next

### Potential Enhancements
1. **User Accounts**: Save preferences and favorite movies
2. **More Movies**: Expand dataset with more Bollywood films
3. **Advanced ML**: Try neural networks or collaborative filtering
4. **Mobile App**: React Native version
5. **Social Features**: Share recommendations with friends
6. **Movie Posters**: Integrate movie poster APIs
7. **User Ratings**: Collect and use user feedback

### Technical Improvements
1. **Caching**: Redis for recommendation caching
2. **Real-time**: WebSocket for live updates
3. **A/B Testing**: Compare different ML models
4. **Analytics**: Track user preferences and model performance
5. **Database**: Store movie metadata in database
6. **Image Processing**: Extract movie posters automatically

## 📚 Documentation

- **Backend**: `backend/README.md`
- **Frontend**: `project/FRONTEND_INTEGRATION.md`
- **API Docs**: http://localhost:8000/docs
- **Quick Start**: `backend/QUICK_START.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

🎬 **Your ML-powered Bollywood movie recommendation app is ready to use with enhanced movie metadata!**

**Happy watching! 🍿** 