# 🔧 Backend Setup & Troubleshooting Guide

## Current Issue: Network Error on "Generate Idea"

### Root Cause
The frontend is getting a **401 Unauthorized** error when clicking "Generate Idea" because:
1. Backend server is not running on port 3000
2. Firebase Admin SDK needs proper configuration
3. Google API key is required for AI generation

---

## ✅ Quick Fix Steps

### Step 1: Move Firebase Service Account Key

The Firebase service account key has been downloaded. Move it to the backend directory:

```cmd
# Find the downloaded file
dir "%USERPROFILE%\Downloads\marine-order-*.json"

# Move it to the backend directory (replace the exact filename)
move "%USERPROFILE%\Downloads\marine-order-481405-m2-firebase-adminsdk-*.json" "c:\Byte_Defenders\multi-agent-creative-studio\firebase-service-account.json"
```

### Step 2: Get Google API Key

You need a Google AI API key to use Gemini:

1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Copy the key

### Step 3: Update .env File

Edit `c:\Byte_Defenders\multi-agent-creative-studio\.env` and replace:

```bash
GOOGLE_API_KEY=your_google_api_key_here
```

with your actual Google API key:

```bash
GOOGLE_API_KEY=AIza...your_actual_key_here
```

### Step 4: Start the Backend Server

```cmd
cd c:\Byte_Defenders\multi-agent-creative-studio
npm run dev
```

You should see:
```
Backend Starting...
CORS Config: http://localhost:8080,http://localhost:5173,http://localhost:5175,http://localhost:3000
Firebase Admin initialized successfully from service account file
Server started successfully { port: 3000, env: 'development' }
```

### Step 5: Test the Backend

Open a new terminal and test:

```cmd
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-20T...",
  "uptime": 123.456
}
```

### Step 6: Test Frontend

1. Make sure frontend is running on http://localhost:5175 (default Vite port)
2. Go to http://localhost:5175/create
3. Enter a prompt and click "Generate with AI Agents"
4. You should see the session being created and processed

---

## 🔍 Troubleshooting

### Error: "Firebase Admin credentials missing"

**Solution:** Make sure `firebase-service-account.json` exists in the backend directory:
```cmd
dir c:\Byte_Defenders\multi-agent-creative-studio\firebase-service-account.json
```

### Error: "GOOGLE_API_KEY is required"

**Solution:** 
1. Get API key from https://aistudio.google.com/app/apikey
2. Update `.env` file with the key

### Error: "Port 3000 is already in use"

**Solution:** Kill the process using port 3000:
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Error: "Cannot find module 'firebase-service-account.json'"

**Solution:** The file path is relative. Make sure you're running the server from the correct directory:
```cmd
cd c:\Byte_Defenders\multi-agent-creative-studio
npm run dev
```

### Still getting 401 Unauthorized?

**Check:**
1. Backend server is running on port 3000
2. You're logged in on the frontend (check top-right corner)
3. Firebase credentials are valid
4. Check browser console for detailed error messages

---

## 📝 Configuration Files

### Backend .env Location
`c:\Byte_Defenders\multi-agent-creative-studio\.env`

### Frontend .env Location
`c:\Byte_Defenders\frontend\.env`

### Firebase Service Account
`c:\Byte_Defenders\multi-agent-creative-studio\firebase-service-account.json`

---

## 🚀 Normal Startup Process

1. **Terminal 1 - Backend:**
   ```cmd
   cd c:\Byte_Defenders\multi-agent-creative-studio
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```cmd
   cd c:\Byte_Defenders\frontend
   npm run dev
   ```

3. **Access the app:** http://localhost:5175 (or check the port shown in the terminal)

---

## 📊 Architecture Overview

```
Frontend (Port 5175 - Vite default)
    ↓ HTTP Request to /api/v1/*
    Vite Proxy (/api → http://localhost:3000/api)
    ↓ Forwards to http://localhost:3000/api/v1/*
    Backend (Port 3000)
    ↓ Verifies Firebase Token
    Firebase Admin SDK
    ↓ Calls AI API
    Google Gemini API
```

---

## 🔐 Security Notes

- Never commit `.env` files to git
- Never commit `firebase-service-account.json` to git
- Keep your Google API key private
- Rotate keys if they're exposed

---

## 📞 Need More Help?

If you're still experiencing issues:
1. Check the backend console logs
2. Check the browser console (F12)
3. Check the Network tab in browser DevTools
4. Look for specific error messages and search for solutions
