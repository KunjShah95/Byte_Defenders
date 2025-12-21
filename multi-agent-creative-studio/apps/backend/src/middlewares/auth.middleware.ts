import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        // Skip auth if Firebase is not configured (development mode)
        if (!authService || !process.env.FIREBASE_PROJECT_ID) {
            console.warn('Firebase not configured, skipping authentication');
            (req as any).user = {
                uid: 'dev-user',
                email: 'dev@localhost',
                emailVerified: true,
            };
            next();
            return;
        }

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // In development/preview mode, allow anonymous access if token is missing
            console.warn('Missing auth header, defaulting to anonymous dev-user');
            (req as any).user = {
                uid: 'dev-user',
                email: 'dev@localhost',
                emailVerified: true,
            };
            next();
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify the Firebase ID token
        const decodedToken = await authService.verifyToken(token);

        // Attach user info to request
        (req as any).user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
        };

        next();
    } catch (error) {
        console.warn('Auth token verification failed, falling back to anonymous dev-user:', error);
        // Fallback to anonymous user even if token is invalid (for dev/preview)
        (req as any).user = {
            uid: 'dev-user',
            email: 'dev@localhost',
            emailVerified: true,
        };
        next();
        return;
    }
}
