
import { Request, Response } from 'express';
import { MultiAgentOrchestrator } from '../services/multiAgentOrchestrator.service';
import { Logger } from '../utils/logger';
import { sendSuccess, sendError } from '../utils/response';

const orchestrator = MultiAgentOrchestrator.getInstance();
const logger = Logger.getLogger('WorkflowsAPI');

export async function runWorkflow(req: Request, res: Response): Promise<void> {
    try {
        const { sessionId } = req.params;
        const { mode, tasks, initialContext } = req.body; // mode: 'parallel' | 'sequential'

        if (!sessionId) {
            sendError(res, 'sessionId is required in params', 400);
            return;
        }

        if (!mode || !tasks || !Array.isArray(tasks)) {
            sendError(res, 'mode and tasks (array) are required in body', 400);
            return;
        }

        let results;
        if (mode === 'parallel') {
            results = await orchestrator.runParallel(sessionId, tasks, { sessionId });
        } else if (mode === 'sequential') {
            results = await orchestrator.runSequential(sessionId, tasks, initialContext);
        } else {
            sendError(res, 'Invalid mode. Use parallel or sequential', 400);
            return;
        }

        sendSuccess(res, { sessionId, mode, results });
    } catch (error) {
        logger.error('Workflow execution failed', error);
        sendError(res, 'Workflow execution failed', 500, String(error));
    }
}
