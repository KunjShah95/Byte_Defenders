#!/usr/bin/env bash
#
# Byte Defenders - Backend Startup Script
# Usage: ./start.sh
#
# This script validates prerequisites and starts the backend server.
# For Windows, use start-backend.bat instead.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================"
echo " Starting Backend Server"
echo "========================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "[ERROR] .env file not found!"
    echo ""
    echo "Please create .env file in $(pwd):"
    echo "  cp .env.example .env"
    echo ""
    echo "Then edit .env with your API keys."
    echo ""
    exit 1
fi

echo "[OK] .env file found"
echo ""

# Check if Google API key is set to placeholder
if grep -q "GOOGLE_API_KEY=your_google_api_key_here" ".env" 2>/dev/null; then
    echo "[WARNING] Google API key not configured!"
    echo ""
    echo "Please update the .env file with your Google API key:"
    echo "  1. Go to https://aistudio.google.com/app/apikey"
    echo "  2. Create a new API key"
    echo "  3. Replace GOOGLE_API_KEY=your_google_api_key_here in .env"
    echo ""
    read -r -p "Continue anyway? (y/n): " continue
    if [ "$continue" != "y" ] && [ "$continue" != "Y" ]; then
        exit 1
    fi
    echo ""
fi

echo "========================================"
echo " Starting Backend Server..."
echo "========================================"
echo ""
echo "Backend will start on http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

# Export default port if not set
export PORT="${PORT:-3000}"

npm run dev
