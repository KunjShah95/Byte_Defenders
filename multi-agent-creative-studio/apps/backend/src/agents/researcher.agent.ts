
/**
 * Researcher Agent - Conducts research on topics
 */
import { AgentRunnerService } from '../services/agentRunner.service';
import { Logger } from '../utils/logger';

export class ResearcherAgent {
    private agentRunner = AgentRunnerService.getInstance();
    private logger = Logger.getLogger('ResearcherAgent');

    async research(sessionId: string, topic: string, context?: Record<string, any>) {
        this.logger.info(`Researching topic: ${topic}`, { sessionId });

        const request = {
            sessionId,
            agentType: 'researcher' as const,
            input: {
                topic,
            },
            context: context || {},
        };

        return await this.agentRunner.executeAgent(request);
    }
}
