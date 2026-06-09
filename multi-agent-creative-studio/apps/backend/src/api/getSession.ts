/**
 * Get Session API - Retrieve session details and status
 */
import { Request, Response } from 'express';
import { MemoryService } from '../services/memory.service';
import { Logger } from '../utils/logger';
import { sendSuccess, sendError } from '../utils/response';

const memoryService = MemoryService.getInstance();
const logger = Logger.getLogger('GetSessionAPI');

export async function getSession(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      sendError(res, 'sessionId is required', 400);
      return;
    }

    const sessionData = await memoryService.retrieve(sessionId, 'sessionData');
    if (!sessionData) {
      sendError(res, 'Session not found', 404);
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

    sendSuccess(res, response);
  } catch (error) {
    logger.error('Failed to get session', error);
    sendError(res, 'Failed to retrieve session', 500, String(error));
  }
}
