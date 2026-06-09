/**
 * Get Result API - Retrieve the final creative output
 */
import { Request, Response } from 'express';
import { MemoryService } from '../services/memory.service';
import { Logger } from '../utils/logger';
import { sendSuccess, sendError } from '../utils/response';

const memoryService = MemoryService.getInstance();
const logger = Logger.getLogger('GetResultAPI');

export async function getResult(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      sendError(res, 'sessionId is required', 400);
      return;
    }

    const allMemory = await memoryService.getAll(sessionId);

    if (!allMemory || Object.keys(allMemory).length === 0) {
      sendError(res, 'Session not found', 404);
      return;
    }

    const result = {
      sessionId,
      initialIdea: allMemory.initialIdea,
      criticisms: allMemory.criticisms,
      refinedIdea: allMemory.refinedIdea,
      presentation: allMemory.presentation,
      refinementIterations: allMemory.refinementIterations,
      executionHistory: allMemory.executionHistory || [],
      summary: {
        hasInitialIdea: !!allMemory.initialIdea,
        hasCriticisms: !!allMemory.criticisms && allMemory.criticisms.length > 0,
        hasRefinedIdea: !!allMemory.refinedIdea,
        hasPresentation: !!allMemory.presentation,
        refinementCount: allMemory.refinementIterations?.length || 0,
      },
    };

    logger.info('Result retrieved', { sessionId });

    sendSuccess(res, result);
  } catch (error) {
    logger.error('Failed to get result', error);
    sendError(res, 'Failed to retrieve result', 500, String(error));
  }
}
