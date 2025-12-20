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
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Missing or invalid authorization header. Expected format: "Bearer <token>"'
            });
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
        console.error('Auth middleware error:', error);
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or expired token',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
