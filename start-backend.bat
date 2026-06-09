@echo off
echo ========================================
echo Backend Setup Script
echo ========================================
echo.

:: Check if Firebase service account exists
if not exist "c:\Byte_Defenders\multi-agent-creative-studio\firebase-service-account.json" (
    echo [ERROR] Firebase service account file not found!
    echo.
    echo Please move the downloaded Firebase service account JSON file to:
    echo c:\Byte_Defenders\multi-agent-creative-studio\firebase-service-account.json
    echo.
    echo Run this command to find it:
    echo dir "%%USERPROFILE%%\Downloads\marine-order-*.json"
    echo.
    pause
    exit /b 1
)

echo [OK] Firebase service account file found
echo.

:: Check if .env file exists
if not exist "c:\Byte_Defenders\multi-agent-creative-studio\.env" (
    echo [ERROR] .env file not found!
    echo Please create .env file in c:\Byte_Defenders\multi-agent-creative-studio\
    pause
    exit /b 1
)

echo [OK] .env file found
echo.

:: Check if Google API key is set
findstr /C:"GOOGLE_API_KEY=your_google_api_key_here" "c:\Byte_Defenders\multi-agent-creative-studio\.env" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Google API key not configured!
    echo.
    echo Please update the .env file with your Google API key:
    echo 1. Go to https://aistudio.google.com/app/apikey
    echo 2. Create a new API key
    echo 3. Replace GOOGLE_API_KEY=your_google_api_key_here in .env
    echo.
    set /p continue="Continue anyway? (y/n): "
    if /i not "%continue%"=="y" exit /b 1
)

echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
echo.
echo Backend will start on http://localhost:3000
echo Setting PORT=3000 for this session
echo.

cd /d "c:\Byte_Defenders\multi-agent-creative-studio"
set PORT=3000
npm run dev
