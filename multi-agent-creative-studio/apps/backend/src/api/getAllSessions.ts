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
    // For now, return empty array since we don't have a way to list all sessions
    // In a production system, you'd query by userId from the database
    // This is a placeholder implementation
    const user = (req as any).user;
    
    if (!user || !user.uid) {
      res.status(401).json({
        error: 'Unauthorized',
      });
      return;
    }

    // TODO: Implement proper session listing by userId
    // For now, return empty array to prevent errors
    logger.info('Get all sessions called', { userId: user.uid });
    
    res.status(200).json([]);
  } catch (error) {
    logger.error('Failed to get all sessions', error);
    res.status(500).json({
      error: 'Failed to retrieve sessions',
      details: String(error),
    });
  }
}

