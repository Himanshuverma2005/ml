#!/usr/bin/env python3
"""
Startup script for the complete Movie Recommendation App.
This script will:
1. Start the ML backend
2. Start the React frontend
3. Open the app in your browser
"""

import os
import sys
import subprocess
import time
import webbrowser
import threading
from pathlib import Path

def start_backend():
    """Start the ML backend server."""
    print("🚀 Starting ML Backend...")
    backend_dir = Path("backend")
    
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return False
    
    try:
        # Change to backend directory and start the server
        os.chdir(backend_dir)
        subprocess.run([sys.executable, "start_backend.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Backend stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Backend failed to start: {e}")
        return False
    
    return True

def start_frontend():
    """Start the React frontend development server."""
    print("🌐 Starting React Frontend...")
    frontend_dir = Path("project")
    
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        return False
    
    try:
        # Change to frontend directory and start the dev server
        os.chdir(frontend_dir)
        subprocess.run(["npm", "run", "dev"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Frontend stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend failed to start: {e}")
        return False
    
    return True

def open_browser():
    """Open the app in the default browser."""
    print("🌍 Opening app in browser...")
    time.sleep(5)  # Wait for servers to start
    try:
        webbrowser.open("http://localhost:5173")
    except Exception as e:
        print(f"⚠️ Could not open browser automatically: {e}")
        print("Please open http://localhost:5173 manually")

def main():
    """Main startup function."""
    print("🎬 Movie Recommendation App")
    print("=" * 50)
    print("Starting both backend and frontend...")
    print()
    
    # Check if we're in the right directory
    if not Path("backend").exists() or not Path("project").exists():
        print("❌ Error: Please run this script from the root directory")
        print("   (where both 'backend' and 'project' folders are located)")
        return
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Wait a bit for backend to start
    time.sleep(3)
    
    # Start frontend in a separate thread
    frontend_thread = threading.Thread(target=start_frontend, daemon=True)
    frontend_thread.start()
    
    # Open browser
    browser_thread = threading.Thread(target=open_browser, daemon=True)
    browser_thread.start()
    
    print("\n🎉 App is starting up!")
    print("📱 Frontend: http://localhost:5173")
    print("🤖 Backend:  http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop all services")
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n👋 Shutting down...")
        print("Thank you for using the Movie Recommendation App!")

if __name__ == "__main__":
    main() 