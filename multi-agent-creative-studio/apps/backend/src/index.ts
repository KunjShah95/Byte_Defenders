/**
 * Main Application Entry Point
 */
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { rateLimiter } from './middlewares/rateLimiter';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config';
import { Logger } from './utils/logger';
import { CreativeWorkflow } from './workflows/creative.workflow';
import { EventBus } from './events/eventBus';
import { AuthService } from './services/auth.service';
import { authMiddleware } from './middlewares/auth.middleware';
import { createSession } from './api/createSession';
import { getSession } from './api/getSession';
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

const app: Express = express();

console.log('Backend Starting...');
console.log('CORS Config:', config.cors.origin);

// Initialize Services
AuthService.getInstance();
const eventBus = EventBus.getInstance();
const logger = Logger.getLogger('Main');

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next) => {
  const reqId = (req as any).requestId;
  logger.info(`${req.method} ${req.path}`, { requestId: reqId });
  next();
});


// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// API v1 Routes

// Session Management
app.post('/api/v1/sessions', authMiddleware, createSession);
app.get('/api/v1/sessions/:sessionId', authMiddleware, getSession);

// Workflow Execution
app.post('/api/v1/sessions/:sessionId/workflow/quick', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { topic } = req.body;

    if (!topic) {
      res.status(400).json({ error: 'topic is required' });
      return;
    }

    const workflow = new CreativeWorkflow();
    const result = await workflow.quickProcess(sessionId, topic);

    res.json(result);
  } catch (error) {
    logger.error('Quick workflow failed', error);
    res.status(500).json({
      error: 'Workflow execution failed',
      details: String(error),
    });
  }
});

app.post('/api/v1/sessions/:sessionId/workflow/full', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { topic, audience } = req.body;

    if (!topic) {
      res.status(400).json({ error: 'topic is required' });
      return;
    }

    const workflow = new CreativeWorkflow();
    const result = await workflow.fullProcess(sessionId, {
      topic,
      audience: audience || 'general',
    });

    res.json(result);
  } catch (error) {
    logger.error('Full workflow failed', error);
    res.status(500).json({
      error: 'Workflow execution failed',
      details: String(error),
    });
  }
});

app.post('/api/v1/sessions/:sessionId/workflow/custom', authMiddleware, runWorkflow);

// Results
app.get('/api/v1/sessions/:sessionId/result', authMiddleware, getResult);
app.get('/api/v1/sessions/:sessionId/explainability', authMiddleware, getExplainability);


// Prompt Management
app.get('/api/v1/prompts/stats', getPromptStats);
app.get('/api/v1/prompts/:agentType/templates', getAvailablePrompts);
app.get('/api/v1/prompts/:agentType/recommended', getRecommendedTemplate);
app.post('/api/v1/prompts/build', buildPrompt);
app.get('/api/v1/prompts/export/all', exportAllPrompts);

// Event subscription endpoint (for real-time updates)
app.get('/api/v1/events/subscribe', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Subscribe to all events
  const unsubscribe = eventBus.subscribe('*', (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  // Clean up on disconnect
  req.on('close', () => {
    unsubscribe();
    res.end();
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  logger.error('Unhandled error', err);
  res.status(500).json({
    error: 'Internal Server Error',
    details: config.nodeEnv === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  logger.info(`Server started successfully`, {
    port: PORT,
    env: config.nodeEnv,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;
