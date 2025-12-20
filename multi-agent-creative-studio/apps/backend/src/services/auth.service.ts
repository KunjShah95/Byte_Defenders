import * as admin from 'firebase-admin';
import { config } from '../config';

export class AuthService {
    private static instance: AuthService;

    private constructor() {
        // Try to load from service account file first
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

        if (serviceAccountPath) {
            try {
                if (!admin.apps.length) {
                    const serviceAccount = require(serviceAccountPath);
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                    });
                }
                console.log('Firebase Admin initialized successfully from service account file');
            } catch (error) {
                console.error('Error loading Firebase service account file:', error);
                console.warn('Firebase Admin initialization failed');
            }
        } else if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
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
        } else {
            console.warn('Firebase Admin credentials missing, auth middleware will be disabled or fail');
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
