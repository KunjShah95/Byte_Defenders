import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { config } from '../config';
import { sendError } from '../utils/response';
import { Logger } from '../utils/logger';

const logger = Logger.getLogger('AuthMiddleware');

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const isDev = config.nodeEnv === 'development';
    const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';
    const isDevOrTest = isDev || isTest;

    try {
        // Skip auth if Firebase is not configured (in development or test mode)
        if (!authService || !process.env.FIREBASE_PROJECT_ID) {
            if (!isDevOrTest) {
                sendError(res, 'Firebase not configured on server', 500);
                return;
            }
            logger.warn('Firebase not configured, skipping authentication (dev/test mode)');
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
            // In development or test mode, allow anonymous access if token is missing
            if (isDevOrTest) {
                logger.warn('Missing auth header, defaulting to anonymous dev-user (dev/test mode)');
                (req as any).user = {
                    uid: 'dev-user',
                    email: 'dev@localhost',
                    emailVerified: true,
                };
                next();
                return;
            }
            sendError(res, 'Missing or invalid authorization header', 401);
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
        logger.warn('Auth token verification failed', error);
        // In development or test mode, fallback to anonymous user; otherwise, return 401
        if (isDevOrTest) {
            logger.warn('Falling back to anonymous dev-user due to auth error (dev/test mode)');
            (req as any).user = {
                uid: 'dev-user',
                email: 'dev@localhost',
                emailVerified: true,
            };
            next();
            return;
        }
        sendError(res, 'Invalid authentication token', 401);
        return;
    }
}
