
/**
 * Coder Agent - Generates code implementation
 */
import { AgentRunnerService } from '../services/agentRunner.service';
import { Logger } from '../utils/logger';

export class CoderAgent {
    private agentRunner = AgentRunnerService.getInstance();
    private logger = Logger.getLogger('CoderAgent');

    async implement(sessionId: string, task: string, techStack: string, requirements: string[], context?: Record<string, any>) {
        this.logger.info(`Implementing task: ${task}`, { sessionId });

        const request = {
            sessionId,
            agentType: 'coder' as const,
            input: {
                task,
                techStack,
                requirements,
            },
            context: context || {},
        };

        return await this.agentRunner.executeAgent(request);
    }
}
