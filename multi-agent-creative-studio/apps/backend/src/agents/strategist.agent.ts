/**
 * Strategist Agent - Plans strategy, defines constraints, and sets direction
 * Runs before idea generation to provide a solid strategic foundation
 */
import { AgentRunnerService } from '../services/agentRunner.service';
import { Logger } from '../utils/logger';

export class StrategistAgent {
  private agentRunner = AgentRunnerService.getInstance();
  private logger = Logger.getLogger('StrategistAgent');

  async developStrategy(sessionId: string, topic: string, context?: Record<string, any>) {
    this.logger.info(`Developing strategy for topic: ${topic}`, { sessionId });

    const request = {
      sessionId,
      agentType: 'strategist' as const,
      input: {
        topic,
        goals: context?.goals || [],
        constraints: context?.constraints || [],
        domain: context?.domain || '',
      },
      context,
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Define success criteria for the project
   */
  async defineSuccessCriteria(sessionId: string, topic: string, goals: string[]) {
    this.logger.info(`Defining success criteria for topic: ${topic}`, { sessionId });

    const request = {
      sessionId,
      agentType: 'strategist' as const,
      input: {
        topic,
        goals,
        task: 'success_criteria',
      },
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Analyze market landscape and identify opportunities
   */
  async marketAnalysis(sessionId: string, topic: string) {
    this.logger.info(`Analyzing market for topic: ${topic}`, { sessionId });

    const request = {
      sessionId,
      agentType: 'strategist' as const,
      input: {
        topic,
        task: 'market_analysis',
      },
    };

    return await this.agentRunner.executeAgent(request);
  }
}
