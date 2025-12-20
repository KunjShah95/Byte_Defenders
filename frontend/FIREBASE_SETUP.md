# Firebase Configuration Setup Guide

## 🔐 Securing Your Firebase Credentials

Your Firebase configuration has been properly secured using environment variables. Here's what was set up:

### ✅ What's Been Done

1. **Environment Variables Created** - All Firebase credentials are now stored in `.env`
2. **Firebase Config Updated** - `src/lib/firebase.ts` now reads from environment variables
3. **Analytics Added** - Firebase Analytics is now properly configured
4. **Git Protection** - `.env` is added to `.gitignore` to prevent credential leaks
5. **Example Template** - `.env.example` created for team members

### 📋 Environment Variables

The following environment variables are configured in your `.env` file:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 🚀 Getting Started

1. **Copy the example file** (for new team members):
   ```bash
   cp .env.example .env
   ```

2. **Add your Firebase credentials** to `.env`

3. **Restart your dev server** to load the new environment variables:
   ```bash
   npm run dev
   ```

### 🔥 Firebase Services Available

Your Firebase configuration now supports:

- ✅ **Authentication** - Google Sign-In and other auth methods
- ✅ **Analytics** - User behavior tracking and insights
- ✅ **Storage** - File uploads and downloads
- ✅ **Firestore** - Real-time database (can be added)
- ✅ **Cloud Functions** - Serverless backend (can be added)

### 📦 Usage in Your App

Import Firebase services from `src/lib/firebase.ts`:

```typescript
import { auth, googleProvider, analytics } from '@/lib/firebase';

// Use authentication
import { signInWithPopup } from 'firebase/auth';
await signInWithPopup(auth, googleProvider);

// Use analytics
import { logEvent } from 'firebase/analytics';
if (analytics) {
  logEvent(analytics, 'page_view');
}
```

### ⚠️ Security Best Practices

- ✅ Never commit `.env` to version control
- ✅ Use `.env.example` for documentation
- ✅ Rotate API keys if accidentally exposed
- ✅ Set up Firebase Security Rules for production
- ✅ Enable App Check for additional security

### 🔧 Troubleshooting

**Environment variables not loading?**
- Restart your dev server after changing `.env`
- Ensure variables start with `VITE_` prefix (required by Vite)
- Check that `.env` is in the project root

**Firebase not initializing?**
- Verify all required variables are set in `.env`
- Check browser console for Firebase errors
- Ensure Firebase packages are installed: `npm install firebase`

### 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

**Project:** Orchestra Studio  
**Firebase Project ID:** marine-order-481405-m2
