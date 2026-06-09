/**
 * Standardized API Response Envelope
 *
 * All API endpoints should use these helpers to ensure consistent response shapes.
 *
 * Success envelope (2xx):
 *   { data: <payload>, meta?: { requestId?: string, timestamp: string, ... } }
 *
 * Error envelope (4xx/5xx):
 *   { error: string, details?: any, meta: { requestId?: string, status: number, timestamp: string } }
 */
import { Response } from 'express';

export interface ApiSuccessMeta {
  requestId?: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface ApiErrorBody {
  error: string;
  details?: unknown;
  meta: {
    requestId?: string;
    status: number;
    timestamp: string;
  };
}

/**
 * Send a success response with standardized envelope.
 * The payload is placed under `data` to keep the envelope consistent.
 * Backward-compat: callers that expect raw objects can destructure.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  status: number = 200,
  extraMeta?: Record<string, unknown>,
): void {
  const meta: ApiSuccessMeta = {
    timestamp: new Date().toISOString(),
    ...extraMeta,
  };
  res.status(status).json({ data, meta });
}

/**
 * Send an error response with standardized envelope.
 */
export function sendError(
  res: Response,
  message: string,
  status: number = 500,
  details?: unknown,
  requestId?: string,
): void {
  const body: ApiErrorBody = {
    error: message,
    details,
    meta: {
      status,
      timestamp: new Date().toISOString(),
      ...(requestId && { requestId }),
    },
  };
  res.status(status).json(body);
}
