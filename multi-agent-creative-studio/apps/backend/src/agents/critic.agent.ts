/**
 * Critic Agent - Provides constructive criticism
 */
import { AgentRunnerService } from '../services/agentRunner.service';
import { MemoryService } from '../services/memory.service';
import { Logger } from '../utils/logger';

export class CriticAgent {
  private agentRunner = AgentRunnerService.getInstance();
  private memoryService = MemoryService.getInstance();
  private logger = Logger.getLogger('CriticAgent');

  async critique(sessionId: string, idea: string, context?: Record<string, any>) {
    this.logger.info('Evaluating idea for weaknesses and improvements', { sessionId });

    // Get previous context from memory
    const previousContext = this.memoryService.getAll(sessionId);

    const request = {
      sessionId,
      agentType: 'critic' as const,
      input: {
        idea,
        focusAreas: context?.focusAreas || ['feasibility', 'relevance', 'originality'],
        criteria: context?.criteria || [],
      },
      context: {
        ...previousContext,
        ...context,
      },
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Score an idea based on multiple criteria
   */
  async scoreIdea(sessionId: string, idea: string, criteria: string[]) {
    this.logger.info('Scoring idea against criteria', { sessionId, criteriaCount: criteria.length });

    const request = {
      sessionId,
      agentType: 'critic' as const,
      input: {
        idea,
        task: 'score',
        criteria,
      },
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Identify risks and challenges
   */
  async identifyRisks(sessionId: string, idea: string) {
    this.logger.info('Identifying risks and challenges', { sessionId });

    const request = {
      sessionId,
      agentType: 'critic' as const,
      input: {
        idea,
        task: 'risk_analysis',
      },
    };

    return await this.agentRunner.executeAgent(request);
  }
}
