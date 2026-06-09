/**
 * Create Session API - Initialize a new creative session
 */
import { Request, Response } from 'express';
import { validateCreateSessionInput } from '../middlewares/validation';
import { MemoryService } from '../services/memory.service';
import { Logger } from '../utils/logger';
import { UUIDUtil } from '../utils/uuid';
import { CreateSessionInput, SessionResponse } from '../models/session.model';
import { sendSuccess, sendError } from '../utils/response';

const memoryService = MemoryService.getInstance();
const logger = Logger.getLogger('CreateSessionAPI');

export async function createSession(req: Request, res: Response): Promise<void> {
  try {
    const { valid, errors, data } = validateCreateSessionInput(req.body);
    if (!valid) {
      sendError(res, 'Invalid input', 400, errors);
      return;
    }

    const { userId, title, description, metadata } = data as CreateSessionInput;

    if (!userId || !title) {
      sendError(res, 'userId and title are required', 400);
      return;
    }

    const sessionId = UUIDUtil.generateWithPrefix('session');
    const now = new Date();

    const session: SessionResponse = {
      id: sessionId,
      userId,
      title,
      description,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      progress: 0,
      currentAgent: 'waiting',
      metadata: metadata || {},
    };

    // Initialize memory for this session with userId
    await memoryService.initializeSession(sessionId, userId);
    await memoryService.store(sessionId, 'sessionData', session);

    logger.info('Session created', { sessionId, userId });

    sendSuccess(res, session, 201);
  } catch (error) {
    logger.error('Failed to create session', error);
    sendError(res, 'Failed to create session', 500, String(error));
  }
}
