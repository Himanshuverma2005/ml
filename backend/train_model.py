import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
import csv

def clean_csv_file():
    """
    Clean the CSV file by properly handling descriptions with commas.
    """
    print("Cleaning CSV file...")
    
    # Read the raw file and fix the parsing issues
    cleaned_rows = []
    
    try:
        with open('movie_recommendation_dataset.csv', 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            header = next(reader)  # Get the header
            cleaned_rows.append(header)
            
            for row in reader:
                if len(row) >= 7:  # We expect at least 7 columns
                    # The first 6 columns should be: movie_title, mood, weather, day, year, genre
                    # Everything after that should be part of the description
                    movie_title = row[0]
                    mood = row[1]
                    weather = row[2]
                    day = row[3]
                    year = row[4]
                    genre = row[5]
                    
                    # Combine all remaining columns as description
                    description = ','.join(row[6:]) if len(row) > 6 else ''
                    
                    cleaned_rows.append([movie_title, mood, weather, day, year, genre, description])
                else:
                    print(f"Skipping malformed row: {row}")
                    
    except UnicodeDecodeError:
        # Try with latin-1 encoding
        with open('movie_recommendation_dataset.csv', 'r', encoding='latin-1') as file:
            reader = csv.reader(file)
            header = next(reader)
            cleaned_rows.append(header)
            
            for row in reader:
                if len(row) >= 7:
                    movie_title = row[0]
                    mood = row[1]
                    weather = row[2]
                    day = row[3]
                    year = row[4]
                    genre = row[5]
                    description = ','.join(row[6:]) if len(row) > 6 else ''
                    cleaned_rows.append([movie_title, mood, weather, day, year, genre, description])
                else:
                    print(f"Skipping malformed row: {row}")
    
    # Write the cleaned data to a temporary file
    with open('movie_recommendation_dataset_cleaned.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerows(cleaned_rows)
    
    print("CSV file cleaned successfully!")

def train_recommendation_model():
    """
    Train a movie recommendation model using the CSV data.
    The model predicts movie titles based on mood, weather, and day.
    """
    
    # First clean the CSV file
    clean_csv_file()
    
    # Load the cleaned data
    print("Loading cleaned data...")
    try:
        df = pd.read_csv('movie_recommendation_dataset_cleaned.csv', encoding='utf-8')
    except Exception as e:
        print(f"Error reading cleaned CSV file: {e}")
        return
    
    # Display basic info
    print(f"Dataset shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    print(f"Unique movies: {df['movie_title'].nunique()}")
    print(f"Unique moods: {df['mood'].unique()}")
    print(f"Unique weather: {df['weather'].unique()}")
    print(f"Unique days: {df['day'].unique()}")
    
    # Check for missing values
    print(f"\nMissing values:")
    print(df.isnull().sum())
    
    # Remove any rows with missing values in required columns
    required_columns = ['movie_title', 'mood', 'weather', 'day']
    df = df.dropna(subset=required_columns)
    print(f"Dataset shape after removing missing values: {df.shape}")
    
    # Create label encoders for categorical variables
    mood_encoder = LabelEncoder()
    weather_encoder = LabelEncoder()
    day_encoder = LabelEncoder()
    movie_encoder = LabelEncoder()
    
    # Encode categorical variables
    df['mood_encoded'] = mood_encoder.fit_transform(df['mood'])
    df['weather_encoded'] = weather_encoder.fit_transform(df['weather'])
    df['day_encoded'] = day_encoder.fit_transform(df['day'])
    df['movie_encoded'] = movie_encoder.fit_transform(df['movie_title'])
    
    # Prepare features and target
    X = df[['mood_encoded', 'weather_encoded', 'day_encoded']]
    y = df['movie_encoded']
    
    # Check for movies that appear only once (can't be stratified)
    movie_counts = df['movie_title'].value_counts()
    movies_with_single_occurrence = movie_counts[movie_counts == 1].index.tolist()
    
    if movies_with_single_occurrence:
        print(f"Found {len(movies_with_single_occurrence)} movies with only 1 occurrence:")
        for movie in movies_with_single_occurrence[:5]:  # Show first 5
            print(f"  - {movie}")
        if len(movies_with_single_occurrence) > 5:
            print(f"  ... and {len(movies_with_single_occurrence) - 5} more")
        
        # Remove movies that appear only once
        df_filtered = df[~df['movie_title'].isin(movies_with_single_occurrence)]
        
        # Retrain encoders on filtered data
        mood_encoder = LabelEncoder()
        weather_encoder = LabelEncoder()
        day_encoder = LabelEncoder()
        movie_encoder = LabelEncoder()
        
        # Encode categorical variables on filtered data
        df_filtered['mood_encoded'] = mood_encoder.fit_transform(df_filtered['mood'])
        df_filtered['weather_encoded'] = weather_encoder.fit_transform(df_filtered['weather'])
        df_filtered['day_encoded'] = day_encoder.fit_transform(df_filtered['day'])
        df_filtered['movie_encoded'] = movie_encoder.fit_transform(df_filtered['movie_title'])
        
        X = df_filtered[['mood_encoded', 'weather_encoded', 'day_encoded']]
        y = df_filtered['movie_encoded']
        
        print(f"Dataset shape after removing single-occurrence movies: {df_filtered.shape}")
        print(f"Unique movies after filtering: {df_filtered['movie_title'].nunique()}")
    else:
        # Use original data if no single-occurrence movies
        df_filtered = df
        X = df_filtered[['mood_encoded', 'weather_encoded', 'day_encoded']]
        y = df_filtered['movie_encoded']
    
    # Split the data - use stratify only if we have enough samples per class
    try:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        print("Using stratified train-test split")
    except ValueError as e:
        print(f"Stratified split failed: {e}")
        print("Using random train-test split instead")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
    
    # Train Random Forest model
    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Model accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    
    # Get unique classes in test set
    test_classes = np.unique(y_test)
    test_class_names = movie_encoder.inverse_transform(test_classes)
    
    try:
        print(classification_report(y_test, y_pred, target_names=test_class_names))
    except Exception as e:
        print(f"Could not generate full classification report: {e}")
        print("Showing basic accuracy metrics instead")
        print(f"Test set contains {len(test_classes)} unique movies")
        print(f"Predicted {len(np.unique(y_pred))} unique movies")
    
    # Save the model and encoders
    print("Saving model and encoders...")
    joblib.dump(model, 'model.pkl')
    joblib.dump(mood_encoder, 'mood_encoder.pkl')
    joblib.dump(weather_encoder, 'weather_encoder.pkl')
    joblib.dump(day_encoder, 'day_encoder.pkl')
    joblib.dump(movie_encoder, 'movie_encoder.pkl')
    
    # Save movie metadata with all available information
    movie_metadata = df_filtered[['movie_title', 'year', 'genre', 'description']].drop_duplicates(subset=['movie_title']).to_dict('records')
    with open('movie_metadata.json', 'w', encoding='utf-8') as f:
        json.dump(movie_metadata, f, indent=2, ensure_ascii=False)
    
    # Save encoder mappings for API
    encoder_mappings = {
        'mood': {i: label for i, label in enumerate(mood_encoder.classes_)},
        'weather': {i: label for i, label in enumerate(weather_encoder.classes_)},
        'day': {i: label for i, label in enumerate(day_encoder.classes_)},
        'movies': {i: label for i, label in enumerate(movie_encoder.classes_)}
    }
    
    with open('encoder_mappings.json', 'w', encoding='utf-8') as f:
        json.dump(encoder_mappings, f, indent=2, ensure_ascii=False)
    
    print("Model training completed!")
    print("Files saved:")
    print("- model.pkl (trained model)")
    print("- mood_encoder.pkl (mood label encoder)")
    print("- weather_encoder.pkl (weather label encoder)")
    print("- day_encoder.pkl (day label encoder)")
    print("- movie_encoder.pkl (movie label encoder)")
    print("- movie_metadata.json (movie metadata with year, genre, description)")
    print("- encoder_mappings.json (encoder mappings)")

if __name__ == "__main__":
    train_recommendation_model() 