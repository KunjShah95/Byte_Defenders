/**
 * Presenter Agent - Formats ideas for presentation
 */
import { AgentRunnerService } from '../services/agentRunner.service';
import { MemoryService } from '../services/memory.service';
import { Logger } from '../utils/logger';

export class PresenterAgent {
  private agentRunner = AgentRunnerService.getInstance();
  private memoryService = MemoryService.getInstance();
  private logger = Logger.getLogger('PresenterAgent');

  async presentIdea(sessionId: string, idea: string, audience?: string, context?: Record<string, any>) {
    this.logger.info('Creating presentation for idea', { sessionId });

    const previousContext = this.memoryService.getAll(sessionId);

    const request = {
      sessionId,
      agentType: 'presenter' as const,
      input: {
        idea,
        targetAudience: audience || 'general',
        format: context?.format || 'comprehensive',
      },
      context: {
        ...previousContext,
        ...context,
      },
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Create an executive summary
   */
  async createSummary(sessionId: string, idea: string) {
    this.logger.info('Creating executive summary', { sessionId });

    const request = {
      sessionId,
      agentType: 'presenter' as const,
      input: {
        idea,
        task: 'executive_summary',
      },
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Create a detailed pitch
   */
  async createPitch(sessionId: string, idea: string, context?: Record<string, any>) {
    this.logger.info('Creating pitch presentation', { sessionId });

    const request = {
      sessionId,
      agentType: 'presenter' as const,
      input: {
        idea,
        task: 'pitch',
        duration: context?.duration || '5 minutes',
      },
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Create a visual outline
   */
  async createOutline(sessionId: string, idea: string) {
    this.logger.info('Creating visual outline', { sessionId });

    const request = {
      sessionId,
      agentType: 'presenter' as const,
      input: {
        idea,
        task: 'visual_outline',
      },
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Generate talking points
   */
  async generateTalkingPoints(sessionId: string, idea: string) {
    this.logger.info('Generating talking points', { sessionId });

    const request = {
      sessionId,
      agentType: 'presenter' as const,
      input: {
        idea,
        task: 'talking_points',
      },
    };

    return await this.agentRunner.executeAgent(request);
  }
}
