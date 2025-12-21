/**
 * Get All Sessions API - Retrieve all sessions for a user
 */
import { Request, Response } from 'express';
import { MemoryService } from '../services/memory.service';
import { Logger } from '../utils/logger';

const memoryService = MemoryService.getInstance();
const logger = Logger.getLogger('GetAllSessionsAPI');

export async function getAllSessions(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as any).user;
    
    if (!user || !user.uid) {
      res.status(401).json({
        error: 'Unauthorized',
      });
      return;
    }

    // Get all sessions from the file adapter
    const allSessions = await memoryService.getAllUserSessions(user.uid);
    
    logger.info('Get all sessions called', { userId: user.uid, count: allSessions.length });
    
    res.status(200).json(allSessions);
  } catch (error) {
    logger.error('Failed to get all sessions', error);
    res.status(500).json({
      error: 'Failed to retrieve sessions',
      details: String(error),
    });
  }
}

