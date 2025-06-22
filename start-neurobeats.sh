#!/bin/bash

echo "🎵 Starting NeuroBeats - Your AI-Powered Music Experience 🎵"
echo "=================================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please make sure you have a .env file with your API keys."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔍 Testing API connections..."
node test-app.js
echo ""

echo "🚀 Starting development server..."
echo "📱 Open your browser and go to: http://localhost:5173"
echo "🎧 Enjoy exploring music with AI-powered recommendations!"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================================="

npm run dev