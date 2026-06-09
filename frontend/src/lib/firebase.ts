import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged as fbOnAuthStateChanged,
    signInWithPopup as fbSignInWithPopup,
    signOut as fbSignOut,
    User as FirebaseUser
} from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase is configured with real credentials (not placeholders/empty)
const isConfigured = !!(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your_api_key_here' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'your_project_id'
);

export const isMockAuth = !isConfigured;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let authInstance: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let googleProviderInstance: any;
let analyticsInstance: Analytics | null = null;

// Registry of authentication state change listeners for the mock Auth
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockListeners = new Set<(user: any) => void>();

// Define mock handlers
let onAuthStateChangedExport: typeof fbOnAuthStateChanged;
let signInWithPopupExport: typeof fbSignInWithPopup;
let signOutExport: typeof fbSignOut;

if (isConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        authInstance = getAuth(app);
        googleProviderInstance = new GoogleAuthProvider();
        
        if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
            analyticsInstance = getAnalytics(app);
        }

        onAuthStateChangedExport = fbOnAuthStateChanged;
        signInWithPopupExport = fbSignInWithPopup;
        signOutExport = fbSignOut;
    } catch (error) {
        console.error('Firebase failed to initialize. Falling back to mock auth.', error);
        setupMock();
    }
} else {
    console.warn('Firebase credentials missing. Mock authentication has been enabled.');
    setupMock();
}

function setupMock() {
    // Create a mock auth object that mirrors the standard shape needed by the frontend services
    authInstance = {
        app: { options: firebaseConfig },
        currentUser: {
            uid: 'dev-user',
            email: 'dev@localhost',
            displayName: 'Developer User',
            emailVerified: true,
            photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=dev',
            getIdToken: async () => 'mock-id-token',
        },
    };
    googleProviderInstance = {};        onAuthStateChangedExport = ((_auth: any, callback: (user: any) => void) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        mockListeners.add(callback);
        // Trigger initial callback asynchronously to let React mount first
        const timer = setTimeout(() => {
            callback(authInstance.currentUser);
        }, 50);

        return () => {
            mockListeners.delete(callback);
            clearTimeout(timer);
        };
    }) as unknown as typeof fbOnAuthStateChanged;

    signInWithPopupExport = (async (_auth: any, _provider: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        authInstance.currentUser = {
            uid: 'dev-user',
            email: 'dev@localhost',
            displayName: 'Developer User',
            emailVerified: true,
            photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=dev',
            getIdToken: async () => 'mock-id-token',
        };
        mockListeners.forEach(callback => callback(authInstance.currentUser));
        return {
            user: authInstance.currentUser as unknown as FirebaseUser,
            providerId: 'google.com',
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }) as unknown as typeof fbSignInWithPopup;

    signOutExport = (async (_auth: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        authInstance.currentUser = null;
        mockListeners.forEach(callback => callback(null));
    }) as unknown as typeof fbSignOut;
}

export {
    authInstance as auth,
    googleProviderInstance as googleProvider,
    analyticsInstance as analytics,
    onAuthStateChangedExport as onAuthStateChanged,
    signInWithPopupExport as signInWithPopup,
    signOutExport as signOut
};
