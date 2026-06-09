# Deployment Guide

This guide covers deploying both the frontend and backend applications.

## 🔒 Environment Variables

### Important: Keep .env files secure

✅ **Added to .gitignore:**

- `.env` (all variants)
- `.env.local`
- `.env.development`
- `.env.production`
- `.env.test`

⚠️ **Never commit these files to Git!**

---

## 🚀 Backend Deployment Options

### Option 1: Deploy to Render (Recommended - Free Tier Available)

1. **Create account:** [render.com](https://render.com)

2. **Create new Web Service:**
   - Connect your GitHub repository
   - Root Directory: `multi-agent-creative-studio`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node

3. **Set Environment Variables in Render Dashboard:**

   ```env
   NODE_ENV=production
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ANTHROPIC_API_KEY=your_anthropic_key
   OPENAI_API_KEY=your_openai_key
   GEMINI_API_KEY=your_gemini_key
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

4. **Deploy!** Render will build and deploy automatically.

---

### Option 2: Deploy to Railway.app

1. **Create account:** [railway.app](https://railway.app)

2. **New Project → Deploy from GitHub:**
   - Select your repository
   - Root Directory: `multi-agent-creative-studio`
   - Railway auto-detects Node.js

3. **Add Environment Variables:**
   - Go to Variables tab
   - Add all variables from `.env`

4. **Configure Start Command:**
   - Settings → Start Command: `npm run dev` (or `npm start` for production)

---

### Option 3: Deploy to Vercel

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Deploy from backend directory:**

   ```bash
   cd multi-agent-creative-studio
   vercel
   ```

3. **Add environment variables:**

   ```bash
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_SERVICE_KEY
   # ... add all other env vars
   ```

4. **Redeploy:**

   ```bash
   vercel --prod
   ```

---

### Option 4: Deploy to DigitalOcean App Platform

1. **Create account:** [digitalocean.com](https://digitalocean.com)

2. **Create App → GitHub:**
   - Select repository
   - Source Directory: `multi-agent-creative-studio`
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`

3. **Add environment variables** in App Settings

4. **Deploy**

---

### Option 5: Docker Deployment (Any Cloud Provider)

**Build and push to Docker Hub:**

```bash
cd multi-agent-creative-studio
docker build -t your-username/byte-defenders-backend .
docker push your-username/byte-defenders-backend
```

**Deploy to:**

- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **Heroku Container Registry**

**Docker run command:**

```bash
docker run -p 3000:3000 \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_SERVICE_KEY=your_key \
  # ... other env vars
  your-username/byte-defenders-backend
```

---

## 🎨 Frontend Deployment Options

### Option 1: Deploy to Vercel (Recommended - Best for React/Vite)

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Deploy from frontend directory:**

   ```bash
   cd frontend
   vercel
   ```

3. **Add environment variables:**

   ```bash
   vercel env add VITE_API_URL
   vercel env add VITE_FIREBASE_API_KEY
   vercel env add VITE_FIREBASE_AUTH_DOMAIN
   # ... add all VITE_ prefixed vars
   ```

4. **Production deploy:**

   ```bash
   vercel --prod
   ```

**Or use Vercel Dashboard:**

- Go to [vercel.com](https://vercel.com)
- Import Git Repository
- Select `frontend` as root directory
- Add environment variables
- Deploy!

---

### Option 2: Deploy to Netlify

1. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   ```

2. **Build and deploy:**

   ```bash
   cd frontend
   npm run build
   netlify deploy --prod
   ```

**Or use Netlify Dashboard:**

- Connect GitHub repository
- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variables in Site Settings

---

### Option 3: Deploy to Firebase Hosting

1. **Install Firebase CLI:**

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase:**

   ```bash
   cd frontend
   firebase init hosting
   ```

3. **Configure firebase.json:**

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [{
         "source": "**",
         "destination": "/index.html"
       }]
     }
   }
   ```

4. **Build and deploy:**

   ```bash
   npm run build
   firebase deploy
   ```

---

### Option 4: Deploy to GitHub Pages

1. **Install gh-pages:**

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json:**

   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/Byte_Defenders"
   }
   ```

3. **Deploy:**

   ```bash
   npm run deploy
   ```

---

### Option 5: Deploy to Cloudflare Pages

1. **Create account:** [pages.cloudflare.com](https://pages.cloudflare.com)

2. **Connect GitHub repository**

3. **Configure build:**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `frontend`

4. **Add environment variables**

5. **Deploy**

---

## 🔗 Connect Frontend to Backend

After deploying both:

1. **Update Frontend Environment:**

   ```env
   VITE_API_URL=https://your-backend-url.com
   ```

2. **Update Backend CORS:**

   ```env
   CORS_ORIGIN=https://your-frontend-url.com
   ```

3. **Redeploy both applications**

---

## ✅ Pre-Deployment Checklist

### Backend

- [ ] All environment variables set
- [ ] Database (Supabase) configured and accessible
- [ ] API keys tested and valid
- [ ] CORS configured for frontend domain
- [ ] Build succeeds: `npm run build`
- [ ] Health check endpoint working

### Frontend

- [ ] `VITE_API_URL` points to production backend
- [ ] Firebase config is correct
- [ ] All environment variables set
- [ ] Build succeeds: `npm run build`
- [ ] Preview build locally: `npm run preview`

---

## 🔍 Testing Deployment

### Backend Health Check

```bash
curl https://your-backend-url.com/api/v1/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-12-21T..."
}
```

### Frontend Connectivity

1. Open browser developer console
2. Check Network tab for API calls
3. Verify authentication works
4. Test creating a session

---

## 🛠️ Troubleshooting

### Common Issues

**1. CORS Errors:**

- Ensure `CORS_ORIGIN` in backend matches frontend URL
- Check if backend is running

**2. Environment Variables Not Working:**

- Vite requires `VITE_` prefix for frontend vars
- Redeploy after adding env vars
- Clear build cache

**3. API Connection Failed:**

- Verify `VITE_API_URL` is correct
- Check backend health endpoint
- Verify network/firewall rules

**4. Build Failures:**

- Check Node.js version compatibility
- Clear `node_modules` and reinstall
- Check build logs for specific errors

**5. Database Connection Issues:**

- Verify Supabase URL and keys
- Check IP allowlist in Supabase
- Test connection locally first

---

## 📊 Monitoring

After deployment, monitor:

1. **Application Logs** (in hosting platform dashboard)
2. **API Response Times**
3. **Error Rates**
4. **Database Queries** (Supabase dashboard)
5. **User Analytics** (Firebase Analytics)

---

## 🔄 CI/CD Setup (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd multi-agent-creative-studio && npm install
      - run: cd multi-agent-creative-studio && npm run build
      # Add deployment step for your platform

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
      # Add deployment step for your platform
```

---

## 💰 Cost Comparison

| Platform | Free Tier | Best For |
|----------|-----------|----------|
| **Vercel** | ✅ 100GB bandwidth | Frontend (React/Vite) |
| **Netlify** | ✅ 100GB bandwidth | Frontend (Static sites) |
| **Render** | ✅ 750 hours/month | Backend (Node.js) |
| **Railway** | $5 credit/month | Backend (Full-stack) |
| **Firebase** | ✅ 10GB storage | Frontend + Auth |
| **DigitalOcean** | ❌ $5/month minimum | Backend (More control) |

---

## 🎯 Recommended Setup

For this project, I recommend:

1. **Backend:** Render or Railway (free tier)
2. **Frontend:** Vercel or Netlify (free tier)
3. **Database:** Supabase (free tier)
4. **Storage/Auth:** Firebase (free tier)

**Total Cost: $0/month** (within free tier limits)

---

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Node.js Deployment Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Environment Variables Security](https://12factor.net/config)

---

## 🆘 Need Help?

If you encounter issues:

1. Check platform-specific documentation
2. Review application logs
3. Test locally first
4. Check GitHub Issues

---

**Happy Deploying! 🚀**
