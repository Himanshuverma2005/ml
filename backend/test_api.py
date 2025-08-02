import requests
import json
import time

def test_api():
    """Test the movie recommendation API endpoints."""
    
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Bollywood Movie Recommendation API")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing health check...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return
    
    # Test 2: Get available options
    print("\n2. Testing available options...")
    try:
        response = requests.get(f"{base_url}/options")
        if response.status_code == 200:
            options = response.json()
            print("✅ Available options retrieved")
            print(f"   Moods: {options['moods']}")
            print(f"   Weather: {options['weather']}")
            print(f"   Days: {options['days']}")
        else:
            print(f"❌ Options request failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Options request error: {e}")
    
    # Test 3: Single recommendation
    print("\n3. Testing single recommendation...")
    try:
        payload = {
            "mood": "Happy",
            "weather": "Sunny",
            "day": "Weekend"
        }
        response = requests.post(f"{base_url}/recommend", json=payload)
        if response.status_code == 200:
            recommendation = response.json()
            print("✅ Single recommendation successful")
            print(f"   Movie: {recommendation['movie_title']}")
            print(f"   Confidence: {recommendation['confidence']:.2f}")
        
        else:
            print(f"❌ Single recommendation failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Single recommendation error: {e}")
    
    # Test 4: Multiple recommendations
    print("\n4. Testing multiple recommendations...")
    try:
        payload = {
            "mood": "Relaxed",
            "weather": "Rainy",
            "day": "Weekend",
            "num_recommendations": 3
        }
        response = requests.post(f"{base_url}/recommendations", json=payload)
        if response.status_code == 200:
            recommendations = response.json()
            print("✅ Multiple recommendations successful")
            for i, rec in enumerate(recommendations, 1):
                print(f"   {i}. {rec['movie_title']} (confidence: {rec['confidence']:.2f})")
        else:
            print(f"❌ Multiple recommendations failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Multiple recommendations error: {e}")
    
    # Test 5: Model info
    print("\n5. Testing model info...")
    try:
        response = requests.get(f"{base_url}/model-info")
        if response.status_code == 200:
            model_info = response.json()
            print("✅ Model info retrieved")
            print(f"   Model type: {model_info['model_type']}")
            print(f"   Features: {model_info['features']}")
            print(f"   Total movies: {model_info['total_movies']}")
        else:
            print(f"❌ Model info failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Model info error: {e}")
    
    # Test 6: Invalid input
    print("\n6. Testing invalid input...")
    try:
        payload = {
            "mood": "InvalidMood",
            "weather": "Sunny",
            "day": "Weekend"
        }
        response = requests.post(f"{base_url}/recommend", json=payload)
        if response.status_code == 400:
            print("✅ Invalid input properly rejected")
            print(f"   Error: {response.json()['detail']}")
        else:
            print(f"❌ Invalid input not properly handled: {response.status_code}")
    except Exception as e:
        print(f"❌ Invalid input test error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 API testing completed!")

if __name__ == "__main__":
    # Wait a bit for the server to start if needed
    print("Waiting for server to be ready...")
    time.sleep(2)
    test_api() 