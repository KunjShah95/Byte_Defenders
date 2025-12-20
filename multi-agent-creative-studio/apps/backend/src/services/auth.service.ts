import * as admin from 'firebase-admin';
import { config } from '../config';

export class AuthService {
    private static instance: AuthService;

    private constructor() {
        if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: config.firebase.projectId,
                        clientEmail: config.firebase.clientEmail,
                        privateKey: config.firebase.privateKey,
                    }),
                });
            }
            console.log('Firebase Admin initialized successfully');
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
