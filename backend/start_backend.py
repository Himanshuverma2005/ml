#!/usr/bin/env python3
"""
Startup script for the Bollywood Movie Recommendation Backend.
This script will:
1. Check if the model exists, if not train it
2. Start the FastAPI server
"""

import os
import sys
import subprocess
import time

def check_model_files():
    """Check if all required model files exist."""
    required_files = [
        'model.pkl',
        'mood_encoder.pkl', 
        'weather_encoder.pkl',
        'day_encoder.pkl',
        'movie_encoder.pkl',
        'movie_metadata.json',
        'encoder_mappings.json'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    return missing_files

def train_model():
    """Train the recommendation model."""
    print("🚀 Training the recommendation model...")
    print("This may take a few moments...")
    
    try:
        result = subprocess.run([sys.executable, 'train_model.py'], 
                              capture_output=True, text=True, check=True)
        print("✅ Model training completed successfully!")
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print("❌ Model training failed!")
        print(f"Error: {e.stderr}")
        return False

def start_server():
    """Start the FastAPI server."""
    print("🌐 Starting the FastAPI server...")
    print("Server will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        subprocess.run([sys.executable, 'app.py'], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")

def main():
    """Main startup function."""
    print("🎬 Bollywood Movie Recommendation Backend")
    print("=" * 50)
    
    # Check if CSV file exists
    if not os.path.exists('movie_recommendation_dataset.csv'):
        print("❌ csv not found!")
        print("Please ensure the CSV file is in the backend directory.")
        return
    
    # Check if model files exist
    missing_files = check_model_files()
    
    if missing_files:
        print(f"📋 Missing model files: {', '.join(missing_files)}")
        print("Training new model...")
        
        if not train_model():
            print("❌ Failed to train model. Exiting.")
            return
    else:
        print("✅ Model files found. Skipping training.")
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main() 