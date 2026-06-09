/**
 * Main Application Entry Point
 */
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { rateLimiter } from './middlewares/rateLimiter';
import { sseLimiter } from './middlewares/sseLimiter';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config';
import { Logger } from './utils/logger';
import { CreativeWorkflow } from './workflows/creative.workflow';
import { EventBus } from './events/eventBus';
import { AuthService } from './services/auth.service';
import { authMiddleware } from './middlewares/auth.middleware';
import { createSession } from './api/createSession';
import { getSession } from './api/getSession';
import { getAllSessions } from './api/getAllSessions';
import { getResult } from './api/getResult';
import { getExplainability } from './api/getExplainability';
import { runWorkflow } from './api/workflows';
import {
  getAvailablePrompts,
  getPromptStats,
  buildPrompt,
  getRecommendedTemplate,
  exportAllPrompts,
} from './api/prompts';
import { UUIDUtil } from './utils/uuid';
import { asyncHandler } from './utils/asyncHandler';
import { sendSuccess, sendError } from './utils/response';
import { getConfig } from './api/health';

const app: Express = express();

// Initialize Services
AuthService.getInstance();
const eventBus = EventBus.getInstance();
const logger = Logger.getLogger('Main');

logger.info('Backend starting', { port: config.port, cors: config.cors.origin });
logger.info('CORS origins', config.cors.origin);

// Apply CORS
app.use(cors(config.cors));

// Attach a per-request ID for tracing
app.use((req: Request, res: Response, next: any) => {
  (req as any).requestId = uuidv4();
  next();
});

// Apply rate limiting per IP
app.use(rateLimiter(config.rateLimit.windowMs, config.rateLimit.maxRequests));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next) => {
  const reqId = (req as any).requestId;
  logger.info(`${req.method} ${req.path}`, { requestId: reqId });
  next();
});


// Health check endpoint — simple liveness probe
app.get('/health', (req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'healthy',
    uptime: process.uptime(),
  });
});

// Config diagnostics endpoint — shows which env vars are configured (no secrets revealed)
app.get('/api/v1/health/config', asyncHandler(getConfig));

// Auth diagnostic: check if a given Firebase token is valid
app.post('/api/v1/health/auth-check', asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    sendError(res, 'token is required in request body', 400);
    return;
  }
  try {
    const { authService } = await import('./services/auth.service');
    const decoded = await authService.verifyToken(token);
    sendSuccess(res, {
      valid: true,
      uid: decoded.uid,
      email: decoded.email,
    });
  } catch (err) {
    sendSuccess(res, {
      valid: false,
      error: String(err),
    });
  }
}));

// Welcome route
app.get('/', (req: Request, res: Response) => {
  sendSuccess(res, {
    message: 'Welcome to the Byte Defenders API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      sessions: '/api/v1/sessions'
    }
  });
});

// API v1 Routes

// Session Management
app.post('/api/v1/sessions', authMiddleware, asyncHandler(createSession));
app.get('/api/v1/sessions', authMiddleware, asyncHandler(getAllSessions));
app.get('/api/v1/sessions/:sessionId', authMiddleware, asyncHandler(getSession));

// Workflow Execution
app.post('/api/v1/sessions/:sessionId/workflow/quick', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { topic } = req.body;

  if (!topic) {
    sendError(res, 'topic is required', 400);
    return;
  }

  const workflow = new CreativeWorkflow();
  const result = await workflow.quickProcess(sessionId, topic);

  sendSuccess(res, result);
}));

app.post('/api/v1/sessions/:sessionId/workflow/full', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { topic, audience } = req.body;

  if (!topic) {
    sendError(res, 'topic is required', 400);
    return;
  }

  const workflow = new CreativeWorkflow();
  const result = await workflow.fullProcess(sessionId, {
    topic,
    audience: audience || 'general',
  });

  sendSuccess(res, result);
}));

app.post('/api/v1/sessions/:sessionId/workflow/custom', authMiddleware, asyncHandler(runWorkflow));

// Results
app.get('/api/v1/sessions/:sessionId/result', authMiddleware, asyncHandler(getResult));
app.get('/api/v1/sessions/:sessionId/explainability', authMiddleware, asyncHandler(getExplainability));


// Prompt Management
app.get('/api/v1/prompts/stats', asyncHandler(getPromptStats));
app.get('/api/v1/prompts/:agentType/templates', asyncHandler(getAvailablePrompts));
app.get('/api/v1/prompts/:agentType/recommended', asyncHandler(getRecommendedTemplate));
app.post('/api/v1/prompts/build', asyncHandler(buildPrompt));
app.get('/api/v1/prompts/export/all', asyncHandler(exportAllPrompts));

// Event subscription endpoint (for real-time updates)
app.get('/api/v1/events/subscribe', authMiddleware, sseLimiter(5), (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string | undefined;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial connection event
  res.write(`data: ${JSON.stringify({ type: 'connected', data: { sessionId } })}\n\n`);

  // Subscribe to all events
  const unsubAll = eventBus.subscribe('*', (event: any) => {
    // If sessionId filter is set, only forward matching events
    if (sessionId && event?.sessionId && event.sessionId !== sessionId) return;
    if (sessionId && event?.data?.sessionId && event.data.sessionId !== sessionId) return;

    try {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    } catch {
      // Client may have disconnected
    }
  });

  // Also keep a heartbeat so the connection stays alive
  const heartbeat = setInterval(() => {
    try {
      res.write(`:heartbeat\n\n`);
    } catch {
      clearInterval(heartbeat);
    }
  }, 15000);

  // Clean up on disconnect
  req.on('close', () => {
    unsubAll();
    clearInterval(heartbeat);
    res.end();
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  sendError(res, 'Not Found', 404, { path: req.path });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  const errorDetails = {
    message: err.message || 'Internal Server Error',
    stack: err.stack,
    name: err.name,
    ...(err.response?.data && { apiError: err.response.data }),
  };

  logger.error('Unhandled error', {
    error: errorDetails,
    path: req.path,
    method: req.method,
    requestId: (req as any).requestId,
  });

  // Don't send response if headers already sent
  if (res.headersSent) {
    return next(err);
  }

  sendError(
    res,
    'Internal Server Error',
    err.status || 500,
    config.nodeEnv === 'development' ? { details: errorDetails, stack: err.stack } : undefined,
    (req as any).requestId,
  );
});

// Start server
const PORT = config.port;
logger.info(`Attempting to start server on port ${PORT}`);
const server = app.listen(PORT, () => {
  logger.info(`Server is now listening on port ${PORT}`);
  logger.info(`Server started successfully`, {
    port: PORT,
    env: config.nodeEnv,
  });
});

// Graceful shutdown
function shutdownGracefully(signal: string) {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
process.on('SIGINT', () => shutdownGracefully('SIGINT'));

// Handle unhandled promise rejections gracefully (don't crash on unhandled rejections)
process.on('unhandledRejection', (reason) => {
  logger.warn('Unhandled promise rejection', { reason: String(reason) });
});

export default app;
