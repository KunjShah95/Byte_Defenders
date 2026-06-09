/**
 * SSE Concurrent Connection Limiter
 *
 * Limits the number of concurrent SSE connections per IP address.
 * This prevents an attacker from opening hundreds of SSE connections
 * and exhausting server resources (heartbeat intervals, event bus listeners).
 */
import { Request, Response, NextFunction } from 'express';

export function sseLimiter(maxConcurrent: number = 5) {
  const connections: Map<string, number> = new Map();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'Unknown';
    const current = connections.get(ip) || 0;

    if (current >= maxConcurrent) {
      res.status(429).json({
        error: 'Too many concurrent SSE connections. Please close existing connections before opening new ones.',
      });
      return;
    }

    connections.set(ip, current + 1);

    // Decrement when the SSE connection closes
    req.on('close', () => {
      const remaining = (connections.get(ip) || 1) - 1;
      if (remaining <= 0) {
        connections.delete(ip);
      } else {
        connections.set(ip, remaining);
      }
    });

    next();
  };
}
