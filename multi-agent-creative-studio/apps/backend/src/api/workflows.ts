
import { Request, Response } from 'express';
import { MultiAgentOrchestrator } from '../services/multiAgentOrchestrator.service';
import { Logger } from '../utils/logger';

const orchestrator = MultiAgentOrchestrator.getInstance();
const logger = Logger.getLogger('WorkflowsAPI');

export async function runWorkflow(req: Request, res: Response): Promise<void> {
    try {
        const { sessionId } = req.params;
        const { mode, tasks, initialContext } = req.body; // mode: 'parallel' | 'sequential'

        if (!sessionId) {
            res.status(400).json({ error: 'sessionId is required in params' });
            return;
        }

        if (!mode || !tasks || !Array.isArray(tasks)) {
            res.status(400).json({ error: 'mode and tasks (array) are required in body' });
            return;
        }

        let results;
        if (mode === 'parallel') {
            results = await orchestrator.runParallel(sessionId, tasks);
        } else if (mode === 'sequential') {
            results = await orchestrator.runSequential(sessionId, tasks, initialContext);
        } else {
            res.status(400).json({ error: 'Invalid mode. Use parallel or sequential' });
            return;
        }

        res.json({ sessionId, mode, results });
    } catch (error) {
        logger.error('Workflow execution failed', error);
        res.status(500).json({ error: 'Workflow execution failed', details: String(error) });
    }
}
