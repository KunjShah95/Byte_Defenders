/**
 * Create Session API - Initialize a new creative session
 */
import { Request, Response } from 'express';
import { validateCreateSessionInput } from '../middlewares/validation';
import { MemoryService } from '../services/memory.service';
import { Logger } from '../utils/logger';
import { UUIDUtil } from '../utils/uuid';
import { CreateSessionInput, SessionResponse } from '../models/session.model';

const memoryService = MemoryService.getInstance();
const logger = Logger.getLogger('CreateSessionAPI');

export async function createSession(req: Request, res: Response): Promise<void> {
  try {
    const { valid, errors, data } = validateCreateSessionInput(req.body);
    if (!valid) {
      res.status(400).json({ error: 'Invalid input', details: errors });
      return;
    }

    const { userId, title, description, metadata } = data as CreateSessionInput;

    if (!userId || !title) {
      res.status(400).json({
        error: 'userId and title are required',
      });
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

    res.status(201).json(session);
  } catch (error) {
    logger.error('Failed to create session', error);
    res.status(500).json({
      error: 'Failed to create session',
      details: String(error),
    });
  }
}
