# 🚀 Quick Start Guide

## Backend Connection Refused Error Fix

If you see this error:
```
http proxy error: /api/v1/sessions
AggregateError [ECONNREFUSED]
```

**The backend server is not running!**

## ✅ Solution: Start the Backend Server

### Option 1: Use the Batch Script (Windows)
```cmd
start-backend.bat
```

### Option 2: Manual Start
```cmd
cd multi-agent-creative-studio
npm run dev
```

You should see:
```
Backend Starting...
CORS Config: http://localhost:5175,http://localhost:3000,...
Server started successfully { port: 3000, env: 'development' }
```

### Option 3: PowerShell
```powershell
cd multi-agent-creative-studio
npm run dev
```

## 🔍 Verify Backend is Running

Open a new terminal and test:
```cmd
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": 123.456
}
```

## 📋 Complete Startup Process

You need **TWO terminals** running:

### Terminal 1 - Backend Server
```cmd
cd c:\Byte_Defenders\multi-agent-creative-studio
npm run dev
```

**Keep this terminal open!** The backend must stay running.

### Terminal 2 - Frontend Server
```cmd
cd c:\Byte_Defenders\frontend
npm run dev
```

## 🌐 Access Your Application

Once both servers are running:
- **Frontend**: http://localhost:5175
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## ⚠️ Common Issues

### Port 3000 Already in Use
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Missing Dependencies
```cmd
cd multi-agent-creative-studio
npm install
```

### Missing .env File
Create `multi-agent-creative-studio/.env` with:
```env
PORT=3000
NODE_ENV=development
GOOGLE_API_KEY=your_key_here
```

## 📝 Notes

- **Always start the backend BEFORE the frontend**
- **Keep both terminals open** while developing
- The backend must be running for API calls to work
- Check the backend console for detailed error messages

