# 🚀 Easy Deployment Guide (No CLI Required)

Since you don't have the `gcloud` CLI installed, we will use the **Web Consoles** for a much easier setup.

## Part 1: Push Your Code to GitHub

First, ensure all your latest changes (including the `firebase.json` I just created) are on GitHub.

1. Open your terminal in VS Code.
2. Run these commands:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

---

## Part 2: Backend Deployment (Google Cloud Run)

We will let Google Cloud build your app directly from GitHub.

1. **Go to Google Cloud Run:** [console.cloud.google.com/run](https://console.cloud.google.com/run)
2. Click **Create Service**.
3. **Service Strategy:** Select **"Continuously deploy new revisions from a source repository"**.
4. **Click "Set up with Cloud Build"**:
   - **Repository Provider:** GitHub.
   - **Repository:** Select your `Byte_Defenders` (or `multi-agent-creative-studio`) repo.
   - **Branch:** `main` (or `master`).
   - **Build Type:** Select **"Dockerfile"**.
   - **Source location:** `/multi-agent-creative-studio/Dockerfile` (Make sure this path is correct relative to your repo root. If your repo root *is* the studio folder, just usage `/Dockerfile`).
5. **Configuration:**
   - **Service Name:** `byte-defenders-backend`
   - **Region:** `us-central1` (or one close to you).
   - **Authentication:** select **"Allow unauthenticated invocations"** (so your frontend can reach it).
6. **Environment Variables:**
   - Expand the **"Container, Networking, Security"** section.
   - Go to the **Variables** tab.
   - Add your keys here:
     - `OPENAI_API_KEY`: ...
     - `GEMINI_API_KEY`: ...
     - `CORS_ORIGIN`: `*` (Use `*` for now to test, later change to your frontend URL).
7. Click **Create**.

*Google will now build your container. This takes nearly 3-5 minutes. Once done, you will get a URL like `https://byte-defenders-backend-xyz.a.run.app`.*

---

## Part 3: Frontend Deployment (Firebase Hosting)

We will use `npx` to run Firebase commands without installing them globally.

1. **Login:**
   ```bash
   npx firebase login
   ```
   *(Follow the link in the browser to login)*

2. **Update API URL:**
   - Copy the **Backend URL** from Part 2.
   - Open `.env.production` in your `frontend` folder (create it if missing).
   - Add:
     ```env
     VITE_API_URL=https://your-backend-url-from-step-2.a.run.app
     ```

3. **Build & Deploy:**
   ```bash
   cd frontend
   npm install
   npm run build
   npx firebase deploy --only hosting
   ```

---

## Part 4: Final Connection

1. Once the frontend is deployed, you will get a URL like `https://your-project.web.app`.
2. Go back to **Google Cloud Run** -> **Edit**.
3. Update the `CORS_ORIGIN` variable to this new frontend URL (remove `*`).
4. **Deploy New Revision**.

You are done! 🎉
