@echo off
echo ========================================
echo Starting Backend Server
echo ========================================
echo.
echo Backend will start on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

cd /d "%~dp0"
call npm run dev
