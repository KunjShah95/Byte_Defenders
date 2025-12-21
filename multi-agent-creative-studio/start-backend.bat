@echo off
echo ========================================
echo Starting Backend Server
echo ========================================
echo.
echo Backend will start on http://localhost:3001
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

cd /d "%~dp0"
set PORT=3001
call npm run dev
