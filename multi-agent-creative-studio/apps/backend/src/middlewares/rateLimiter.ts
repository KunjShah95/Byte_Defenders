/**
 * Simple in-memory rate limiter middleware
 * Rate limits are applied per IP address per windowMs.
 * Stale entries are periodically cleaned up to prevent memory leaks.
 */
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

type RateInfo = {
  count: number;
  windowStart: number;
};

export function rateLimiter(windowMs: number, maxRequests: number) {
  const store: Map<string, RateInfo> = new Map();

  // Periodically purge stale entries to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [ip, info] of store) {
      if (info.windowStart < cutoff) {
        store.delete(ip);
      }
    }
  }, windowMs * 2); // Clean up every 2 windows

  // Allow the interval to be garbage-collected if the module is ever hot-reloaded
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

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
      sendError(res, 'Too many requests, please try again later.', 429);
      return;
    }

    info.count += 1;
    next();
  };
}
