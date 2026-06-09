/**
 * Get All Sessions API - Retrieve all sessions for a user
 */
import { Request, Response } from 'express';
import { MemoryService } from '../services/memory.service';
import { Logger } from '../utils/logger';
import { sendSuccess, sendError } from '../utils/response';

const memoryService = MemoryService.getInstance();
const logger = Logger.getLogger('GetAllSessionsAPI');

export async function getAllSessions(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as any).user;
    
    if (!user || !user.uid) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    // Parse pagination params from query string
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));

    const result = await memoryService.getAllUserSessions(user.uid, { page, limit });
    
    logger.info('Get all sessions called', { 
      userId: user.uid, 
      count: result.sessions.length, 
      total: result.total, 
      page, 
      limit 
    });
    
    sendSuccess(res, result.sessions, 200, {
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    logger.error('Failed to get all sessions', error);
    sendError(res, 'Failed to retrieve sessions', 500, String(error));
  }
}

