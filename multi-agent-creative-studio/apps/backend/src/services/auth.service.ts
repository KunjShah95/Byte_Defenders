import * as admin from 'firebase-admin';
import { config } from '../config';

export class AuthService {
    private static instance: AuthService;

    private constructor() {
        // Initialize Firebase Admin using environment variables
        if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
            try {
                if (!admin.apps.length) {
                    admin.initializeApp({
                        credential: admin.credential.cert({
                            projectId: config.firebase.projectId,
                            clientEmail: config.firebase.clientEmail,
                            privateKey: config.firebase.privateKey,
                        }),
                    });
                }
                console.log('Firebase Admin initialized successfully from environment variables');
            } catch (error) {
                console.error('Error initializing Firebase Admin:', error);
                console.warn('Firebase Admin initialization failed');
            }
        } else {
            console.warn('Firebase Admin credentials missing in environment variables. Auth middleware will be disabled.');
            console.warn('Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
        }
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async verifyToken(token: string) {
        try {
            return await admin.auth().verifyIdToken(token);
        } catch (error) {
            console.error('Error verifying Firebase ID token:', error);
            throw error;
        }
    }
}

export const authService = AuthService.getInstance();
