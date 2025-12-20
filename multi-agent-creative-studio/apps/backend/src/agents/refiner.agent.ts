/**
 * Refiner Agent - Improves and refines ideas
 */
import { AgentRunnerService } from '../services/agentRunner.service';
import { MemoryService } from '../services/memory.service';
import { Logger } from '../utils/logger';

export class RefinerAgent {
  private agentRunner = AgentRunnerService.getInstance();
  private memoryService = MemoryService.getInstance();
  private logger = Logger.getLogger('RefinerAgent');

  async refineIdea(sessionId: string, idea: string, feedback: string, context?: Record<string, any>) {
    this.logger.info('Refining idea based on feedback', { sessionId });

    const previousContext = this.memoryService.getAll(sessionId);

    const request = {
      sessionId,
      agentType: 'refiner' as const,
      input: {
        originalIdea: idea,
        feedback,
        improvementFocus: context?.improvementFocus || [],
      },
      context: {
        ...previousContext,
        ...context,
      },
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Enhance specific aspects of an idea
   */
  async enhanceAspect(sessionId: string, idea: string, aspect: string) {
    this.logger.info(`Enhancing ${aspect} aspect of idea`, { sessionId });

    const request = {
      sessionId,
      agentType: 'refiner' as const,
      input: {
        idea,
        aspectToEnhance: aspect,
        task: 'aspect_enhancement',
      },
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Iterate on an idea multiple times
   */
  async iterateIdea(sessionId: string, initialIdea: string, iterations: number = 3) {
    this.logger.info(`Iterating idea ${iterations} times`, { sessionId });

    let currentIdea = initialIdea;
    const iterations_results = [];

    for (let i = 0; i < iterations; i++) {
      const refined = await this.refineIdea(
        sessionId,
        currentIdea,
        `Iteration ${i + 1}: Further refine and improve this idea.`,
      );

      iterations_results.push(refined);
      currentIdea = refined.output.text;
    }

    return iterations_results;
  }

  /**
   * Combine multiple ideas into one
   */
  async combineIdeas(sessionId: string, ideas: string[]) {
    this.logger.info(`Combining ${ideas.length} ideas into one`, { sessionId });

    const request = {
      sessionId,
      agentType: 'refiner' as const,
      input: {
        ideas,
        task: 'combine',
      },
    };

    return await this.agentRunner.executeAgent(request);
  }
}
