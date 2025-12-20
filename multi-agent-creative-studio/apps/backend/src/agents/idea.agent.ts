/**
 * Idea Agent - Generates creative ideas
 */
import { AgentRunnerService } from '../services/agentRunner.service';
import { Logger } from '../utils/logger';

export class IdeaAgent {
  private agentRunner = AgentRunnerService.getInstance();
  private logger = Logger.getLogger('IdeaAgent');

  async generateIdea(sessionId: string, topic: string, context?: Record<string, any>) {
    this.logger.info(`Generating ideas for topic: ${topic}`, { sessionId });

    const request = {
      sessionId,
      agentType: 'idea' as const,
      input: {
        topic,
        requirements: context?.requirements || [],
        constraints: context?.constraints || [],
      },
      context,
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Brainstorm multiple ideas
   */
  async brainstorm(sessionId: string, topic: string, count: number = 3) {
    this.logger.info(`Brainstorming ${count} ideas for topic: ${topic}`, { sessionId });

    const ideas = [];
    for (let i = 0; i < count; i++) {
      const idea = await this.generateIdea(sessionId, topic);
      ideas.push(idea);
    }

    return ideas;
  }
}
