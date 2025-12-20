/**
 * Simple in-memory rate limiter middleware
 * Rate limits are applied per IP address per windowMs.
 */
import { Request, Response, NextFunction } from 'express';

type RateInfo = {
  count: number;
  windowStart: number;
};

export function rateLimiter(windowMs: number, maxRequests: number) {
  const store: Map<string, RateInfo> = new Map();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || (req.connection?.remoteAddress || 'Unknown');
    const now = Date.now();
    const info = store.get(ip);

    if (!info) {
      store.set(ip, { count: 1, windowStart: now });
      return next();
    }

    // Reset window if time elapsed
    if (now - info.windowStart > windowMs) {
      store.set(ip, { count: 1, windowStart: now });
      return next();
    }

    if (info.count >= maxRequests) {
      res.status(429).json({ error: 'Too many requests, please try again later.' });
      return;
    }

    info.count += 1;
    next();
  };
}
