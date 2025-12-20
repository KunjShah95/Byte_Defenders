/**
 * Get Session API - Retrieve session details and status
 */
import { Request, Response } from 'express';
import { MemoryService } from '../services/memory.service';
import { Logger } from '../utils/logger';

const memoryService = MemoryService.getInstance();
const logger = Logger.getLogger('GetSessionAPI');

export async function getSession(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      res.status(400).json({
        error: 'sessionId is required',
      });
      return;
    }

    const sessionData = await memoryService.retrieve(sessionId, 'sessionData');
    if (!sessionData) {
      res.status(404).json({
        error: 'Session not found',
      });
      return;
    }

    const executionHistory = await memoryService.getExecutionHistory(sessionId);
    const allMemory = await memoryService.getAll(sessionId);


    const response = {
      ...sessionData,
      executionHistoryLength: executionHistory.length,
      currentProgress: allMemory.refinedIdea ? 100 : allMemory.criticisms ? 50 : 25,
      memorySnapshot: {
        hasInitialIdea: !!allMemory.initialIdea,
        hasCriticisms: !!allMemory.criticisms,
        hasRefinedIdea: !!allMemory.refinedIdea,
        hasPresentation: !!allMemory.presentation,
      },
    };

    logger.info('Session retrieved', { sessionId });

    res.status(200).json(response);
  } catch (error) {
    logger.error('Failed to get session', error);
    res.status(500).json({
      error: 'Failed to retrieve session',
      details: String(error),
    });
  }
}
