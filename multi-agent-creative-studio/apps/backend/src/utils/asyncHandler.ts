/**
 * Async Handler Utility - Wraps async route handlers to catch errors
 * This ensures Express error middleware catches async errors properly
 */
import { Request, Response, NextFunction } from 'express';

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | Promise<any> | void | any;

/**
 * Wraps an async route handler to catch errors and pass them to Express error middleware
 */
export function asyncHandler(fn: AsyncRequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = fn(req, res, next);
      // If it's a promise, catch errors
      if (result && typeof result.catch === 'function') {
        result.catch(next);
      }
    } catch (error) {
      // Synchronous errors are caught here
      next(error);
    }
  };
}

