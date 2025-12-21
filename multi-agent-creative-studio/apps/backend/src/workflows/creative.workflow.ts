/**
 * Creative Workflow - Orchestrates the multi-agent creative process
 */
import {
  IdeaAgent,
  CriticAgent,
  RefinerAgent,
  PresenterAgent,
} from '../agents/index';
import { MemoryService } from '../services/memory.service';
import { EventBus } from '../events/eventBus';
import { Logger } from '../utils/logger';
import { UUIDUtil } from '../utils/uuid';

export interface WorkflowConfig {
  topic: string;
  iterations?: number;
  autoRefine?: boolean;
  includePresentation?: boolean;
  audience?: string;
}

export interface WorkflowResult {
  sessionId: string;
  initialIdea: any;
  criticisms: any[];
  refinedIdea: any;
  presentation?: any;
  executionHistory: any[];
  totalDuration: number;
}

export class CreativeWorkflow {
  private ideaAgent = new IdeaAgent();
  private criticAgent = new CriticAgent();
  private refinerAgent = new RefinerAgent();
  private presenterAgent = new PresenterAgent();
  private memoryService = MemoryService.getInstance();
  private eventBus = EventBus.getInstance();
  private logger = Logger.getLogger('CreativeWorkflow');

  /**
   * Execute the full creative workflow
   */
  async executeCreativeProcess(sessionId: string, config: WorkflowConfig): Promise<WorkflowResult> {
    const startTime = Date.now();
    this.logger.info('Starting creative workflow', { sessionId, config });

    // Initialize memory for this session
    await this.memoryService.initializeSession(sessionId);

    // Publish workflow start event
    await this.eventBus.publish('workflow:started', {
      sessionId,
      config,
      timestamp: new Date(),
    });

    try {
      // Step 1: Generate initial idea
      this.logger.info('Step 1: Generating initial idea', { sessionId });
      const initialIdea = await this.ideaAgent.generateIdea(sessionId, config.topic);
      await this.memoryService.store(sessionId, 'initialIdea', initialIdea);

      // Step 2: Critique the idea
      this.logger.info('Step 2: Critiquing idea', { sessionId });
      const criticisms = [
        await this.criticAgent.critique(sessionId, initialIdea.output.text),
      ];
      await this.memoryService.store(sessionId, 'criticisms', criticisms);

      // Step 3: Refine based on feedback
      this.logger.info('Step 3: Refining idea', { sessionId });
      const feedbackText = criticisms.map((c) => c.output.text).join('\n');
      let refinedIdea = await this.refinerAgent.refineIdea(
        sessionId,
        initialIdea.output.text,
        feedbackText,
      );

      // Step 4: Iterative refinement if enabled
      if (config.autoRefine && config.iterations && config.iterations > 1) {
        this.logger.info(`Step 4: Iterative refinement (${config.iterations} iterations)`, {
          sessionId,
        });
        const refinementResults = await this.refinerAgent.iterateIdea(
          sessionId,
          refinedIdea.output.text,
          config.iterations - 1,
        );
        refinedIdea = refinementResults[refinementResults.length - 1];
        await this.memoryService.store(sessionId, 'refinementIterations', refinementResults);
      }

      await this.memoryService.store(sessionId, 'refinedIdea', refinedIdea);

      // Step 5: Create presentation if enabled
      let presentation = null;
      if (config.includePresentation) {
        this.logger.info('Step 5: Creating presentation', { sessionId });
        presentation = await this.presenterAgent.presentIdea(
          sessionId,
          refinedIdea.output.text,
          config.audience,
        );
        await this.memoryService.store(sessionId, 'presentation', presentation);
      }

      const totalDuration = Date.now() - startTime;

      const result: WorkflowResult = {
        sessionId,
        initialIdea,
        criticisms,
        refinedIdea,
        presentation: presentation || undefined,
        executionHistory: await this.memoryService.getExecutionHistory(sessionId),
        totalDuration,
      };

      // Update session status to completed
      const sessionData = await this.memoryService.retrieve(sessionId, 'sessionData');
      if (sessionData) {
        sessionData.status = 'completed';
        sessionData.progress = 100;
        sessionData.updatedAt = new Date();
        await this.memoryService.store(sessionId, 'sessionData', sessionData);
      }

      // Publish workflow completed event
      await this.eventBus.publish('workflow:completed', {
        sessionId,
        result,
        timestamp: new Date(),
      });

      this.logger.info('Creative workflow completed successfully', {
        sessionId,
        duration: totalDuration,
      });

      return result;
    } catch (error) {
      this.logger.error('Creative workflow failed', error);
      
      // Update session status to failed
      const sessionData = await this.memoryService.retrieve(sessionId, 'sessionData');
      if (sessionData) {
        sessionData.status = 'failed';
        sessionData.updatedAt = new Date();
        await this.memoryService.store(sessionId, 'sessionData', sessionData);
      }

      await this.eventBus.publish('workflow:failed', {
        sessionId,
        error: String(error),
        timestamp: new Date(),
      });
      throw error;
    }
  }

  /**
   * Quick workflow - Just generate and refine once
   */
  async quickProcess(sessionId: string, topic: string): Promise<WorkflowResult> {
    return this.executeCreativeProcess(sessionId, {
      topic,
      iterations: 1,
      autoRefine: false,
      includePresentation: false,
    });
  }

  /**
   * Full workflow - Generate, critique, refine multiple times, and present
   */
  async fullProcess(sessionId: string, config: Omit<WorkflowConfig, 'iterations'>): Promise<WorkflowResult> {
    return this.executeCreativeProcess(sessionId, {
      ...config,
      iterations: 3,
      autoRefine: true,
      includePresentation: true,
    });
  }

  /**
   * Custom workflow - User-defined steps
   */
  async customProcess(
    sessionId: string,
    steps: Array<{
      type: 'idea' | 'critique' | 'refine' | 'present';
      params: Record<string, any>;
    }>,
  ): Promise<any[]> {
    await this.memoryService.initializeSession(sessionId);
    const results = [];

    for (const step of steps) {
      try {
        let result;
        if (step.type === 'idea') {
          result = await this.ideaAgent.generateIdea(sessionId, step.params.topic);
        } else if (step.type === 'critique') {
          result = await this.criticAgent.critique(sessionId, step.params.idea);
        } else if (step.type === 'refine') {
          result = await this.refinerAgent.refineIdea(
            sessionId,
            step.params.idea,
            step.params.feedback,
          );
        } else if (step.type === 'present') {
          result = await this.presenterAgent.presentIdea(sessionId, step.params.idea);
        }
        results.push(result);
      } catch (error) {
        this.logger.error(`Step ${step.type} failed`, error);
        throw error;
      }
    }

    return results;
  }
}
