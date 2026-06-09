/**
 * Creative Workflow - Orchestrates the multi-agent creative process
 * Uses MultiAgentOrchestrator for dependency management, retry logic, and status tracking
 */
import { MultiAgentOrchestrator, AgentTask } from '../services/multiAgentOrchestrator.service';
import { MemoryService } from '../services/memory.service';
import { EventBus } from '../events/eventBus';
import { Logger } from '../utils/logger';
import { UUIDUtil } from '../utils/uuid';
import { IdeaAgent } from '../agents/idea.agent';
import { CriticAgent } from '../agents/critic.agent';
import { RefinerAgent } from '../agents/refiner.agent';
import { PresenterAgent } from '../agents/presenter.agent';
import { ResearcherAgent } from '../agents/researcher.agent';
import { StrategistAgent } from '../agents/strategist.agent';
import { QualityAssuranceAgent } from '../agents/quality-assurance.agent';

export interface WorkflowConfig {
  topic: string;
  iterations?: number;
  autoRefine?: boolean;
  includePresentation?: boolean;
  includeResearch?: boolean;
  includeStrategy?: boolean;
  includeQualityAssurance?: boolean;
  audience?: string;
  goals?: string[];
  constraints?: string[];
}

export interface AgentOutputData {
  text?: string;
  content?: string;
  reasoning?: string;
  metadata?: Record<string, unknown>;
  score?: number;
  [key: string]: unknown;
}

export interface WorkflowResult {
  sessionId: string;
  strategy?: AgentOutputData;
  research?: AgentOutputData;
  initialIdea: AgentOutputData;
  criticisms: Record<string, unknown>[];
  refinedIdea: AgentOutputData;
  qualityAssurance?: AgentOutputData;
  presentation?: AgentOutputData;
  executionHistory: ExecutionHistoryEntry[];
  totalDuration: number;
}

export interface ExecutionHistoryEntry {
  agent: string;
  agentType?: string;
  context: Record<string, unknown>;
  timestamp?: Date;
}

export class CreativeWorkflow {
  private ideaAgent = new IdeaAgent();
  private criticAgent = new CriticAgent();
  private refinerAgent = new RefinerAgent();
  private presenterAgent = new PresenterAgent();
  private researcherAgent = new ResearcherAgent();
  private strategistAgent = new StrategistAgent();
  private qualityAssuranceAgent = new QualityAssuranceAgent();
  private orchestrator = MultiAgentOrchestrator.getInstance();
  private memoryService = MemoryService.getInstance();
  private eventBus = EventBus.getInstance();
  private logger = Logger.getLogger('CreativeWorkflow');

  /**
   * Build a sequential pipeline of agent tasks for the orchestrator
   */
  private buildAgentPipeline(sessionId: string, config: WorkflowConfig): AgentTask[] {
    const tasks: AgentTask[] = [];

    // Step 0: Research the topic (optional)
    if (config.includeResearch) {
      tasks.push({
        id: 'research',
        agentType: 'researcher',
        name: 'Researcher',
        input: {
          topic: config.topic,
          context: config,
        },
        dependencies: [],
      });
    }

    // Step 1: Develop strategy (optional)
    if (config.includeStrategy) {
      tasks.push({
        id: 'strategy',
        agentType: 'strategist',
        name: 'Strategist',
        input: {
          topic: config.topic,
          goals: config.goals || [],
          constraints: config.constraints || [],
        },
        dependencies: config.includeResearch ? ['research'] : [],
      });
    }

    // Step 2: Generate initial idea (always)
    const ideaDependencies: string[] = [];
    if (config.includeResearch) ideaDependencies.push('research');
    if (config.includeStrategy) ideaDependencies.push('strategy');

    tasks.push({
      id: 'idea',
      agentType: 'idea',
      name: 'Idea Generator',
      input: {
        topic: config.topic,
        requirements: config.goals || [],
        constraints: config.constraints || [],
      },
      dependencies: ideaDependencies,
    });

    // Step 3: Critique the idea (always)
    tasks.push({
      id: 'critique',
      agentType: 'critic',
      name: 'Critic',
      input: {
        idea: '', // Will be populated by context pass-through
        focusAreas: ['feasibility', 'relevance', 'originality', 'market_viability'],
      },
      dependencies: ['idea'],
    });

    // Step 4: Refine based on critique (always)
    tasks.push({
      id: 'refinement',
      agentType: 'refiner',
      name: 'Refiner',
      input: {
        feedback: '',
      },
      dependencies: ['critique'],
    });

    // Step 5: Quality assurance (optional)
    if (config.includeQualityAssurance) {
      tasks.push({
        id: 'quality-assurance',
        agentType: 'quality-assurance',
        name: 'Quality Assurance',
        input: {
          criteria: {
            goals: config.goals || [],
            constraints: config.constraints || [],
            hasCritique: true,
            hasRefinement: true,
          },
        },
        dependencies: ['refinement'],
      });
    }

    // Step 6: Present the final result (optional)
    if (config.includePresentation) {
      const presentationDeps = config.includeQualityAssurance
        ? ['quality-assurance', 'refinement']
        : ['refinement'];

      tasks.push({
        id: 'presentation',
        agentType: 'presenter',
        name: 'Presenter',
        input: {
          targetAudience: config.audience || 'general',
          format: 'comprehensive',
        },
        dependencies: presentationDeps,
      });
    }

    return tasks;
  }

  /**
   * Execute the creative process using MultiAgentOrchestrator for proper orchestration
   */
  async executeCreativeProcess(sessionId: string, config: WorkflowConfig): Promise<WorkflowResult> {
    const startTime = Date.now();
    this.logger.info('Starting creative workflow with orchestrator', { sessionId, config });

    // Initialize memory for this session
    await this.memoryService.initializeSession(sessionId);

    // Publish workflow start event
    await this.eventBus.publish('workflow:started', {
      sessionId,
      config,
      timestamp: new Date(),
    });

    try {
      // Build the agent pipeline
      const pipelineTasks = this.buildAgentPipeline(sessionId, config);

      this.logger.info(`Built pipeline with ${pipelineTasks.length} agents`, {
        sessionId,
        agents: pipelineTasks.map(t => t.name),
      });

      // Emit granular agent:started events for each agent in the pipeline
      for (const task of pipelineTasks) {
        await this.eventBus.publish('agent:started', {
          sessionId,
          agent: task.name,
          agentType: task.agentType,
          step: pipelineTasks.indexOf(task) + 1,
          totalSteps: pipelineTasks.length,
          timestamp: new Date(),
        });
      }

      // Run the pipeline through the orchestrator with sequential execution
      // The orchestrator handles retry logic, dependency management, and status tracking
      const results = await this.orchestrator.runSequential(
        sessionId,
        pipelineTasks,
        { topic: config.topic, config },
      );

      // Map orchestrator results back to named outputs
      // Keys match the agentType values set in buildAgentPipeline()
      const resultMap = new Map(results.map(r => [r.agentType, r]));

      // Check for iterative refinement (auto-refine with multiple iterations)
      let refinedIdea = resultMap.get('refiner');
      if (config.autoRefine && config.iterations && config.iterations > 1 && refinedIdea) {
        this.logger.info(`Performing iterative refinement (${config.iterations} iterations)`, { sessionId });

        const iterationTasks: AgentTask[] = [];
        for (let i = 1; i < (config.iterations || 1); i++) {
          await this.eventBus.publish('agent:started', {
            sessionId,
            agent: 'Refiner',
            agentType: 'refiner',
            step: pipelineTasks.length + i,
            iteration: true,
            timestamp: new Date(),
          });

          iterationTasks.push({
            id: `refinement-iter-${i}`,
            agentType: 'refiner',
            name: `Refiner (Iteration ${i})`,
            input: { feedback: `Iteration ${i}: Further refine and improve this idea.` },
            dependencies: i === 1 ? ['refinement'] : [`refinement-iter-${i - 1}`],
          });
        }

        if (iterationTasks.length > 0) {
          const iterResults = await this.orchestrator.runSequential(sessionId, iterationTasks);
          const lastIter = iterResults[iterResults.length - 1];
          if (lastIter) refinedIdea = lastIter;
        }
      }

      // Emit completion events for all agents (orchestrator handles individual status)
      for (const result of results) {
        await this.eventBus.publish(`agent:${result.agentType}:completed`, {
          sessionId,
          agent: result.agentName,
          agentType: result.agentType,
          output: result,
          timestamp: new Date(),
        });
      }

      const totalDuration = Date.now() - startTime;

      // Build the workflow result
      const workflowResult: WorkflowResult = {
        sessionId,
        strategy: (resultMap.get('strategist')?.output as AgentOutputData | undefined),
        research: (resultMap.get('researcher')?.output as AgentOutputData | undefined),
        initialIdea: resultMap.get('idea')?.output as AgentOutputData,
        criticisms: resultMap.get('critic') ? [resultMap.get('critic') as unknown as Record<string, unknown>] : ([] as Record<string, unknown>[]),
        refinedIdea: (refinedIdea?.output || resultMap.get('refiner')?.output) as AgentOutputData,
        qualityAssurance: (resultMap.get('quality-assurance')?.output as AgentOutputData | undefined),
        presentation: (resultMap.get('presenter')?.output as AgentOutputData | undefined),
        executionHistory: (await this.memoryService.getExecutionHistory(sessionId)) as ExecutionHistoryEntry[],
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
        result: workflowResult,
        timestamp: new Date(),
      });

      this.logger.info('Creative workflow completed successfully via orchestrator', {
        sessionId,
        duration: totalDuration,
        agentsUsed: results.length,
      });

      return workflowResult;
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
   * Quick workflow - Just generate and refine once (minimal pipeline)
   */
  async quickProcess(sessionId: string, topic: string): Promise<WorkflowResult> {
    return this.executeCreativeProcess(sessionId, {
      topic,
      iterations: 1,
      autoRefine: false,
      includePresentation: false,
      includeResearch: false,
      includeStrategy: false,
      includeQualityAssurance: false,
    });
  }

  /**
   * Full workflow - Research, strategize, generate, critique, refine, QA, and present
   */
  async fullProcess(sessionId: string, config: Omit<WorkflowConfig, 'iterations'>): Promise<WorkflowResult> {
    return this.executeCreativeProcess(sessionId, {
      ...config,
      iterations: 3,
      autoRefine: true,
      includePresentation: true,
      includeResearch: true,
      includeStrategy: true,
      includeQualityAssurance: true,
    });
  }

  /**
   * Custom workflow - Flexible pipeline with optional agents
   */
  async customProcess(
    sessionId: string,
    steps: Array<{
      type: 'strategy' | 'research' | 'idea' | 'critique' | 'refine' | 'qa' | 'present';
      params: Record<string, any>;
    }>,
  ): Promise<any[]> {
    await this.memoryService.initializeSession(sessionId);
    const results = [];

    for (const step of steps) {
      try {
        let result;
        switch (step.type) {
          case 'strategy':
            result = await this.strategistAgent.developStrategy(sessionId, step.params.topic, step.params);
            break;
          case 'research':
            result = await this.researcherAgent.research(sessionId, step.params.topic, step.params);
            break;
          case 'idea':
            result = await this.ideaAgent.generateIdea(sessionId, step.params.topic, step.params);
            break;
          case 'critique':
            result = await this.criticAgent.critique(sessionId, step.params.idea, step.params);
            break;
          case 'refine':
            result = await this.refinerAgent.refineIdea(
              sessionId,
              step.params.idea,
              step.params.feedback,
              step.params,
            );
            break;
          case 'qa':
            result = await this.qualityAssuranceAgent.validateOutput(sessionId, step.params.idea, step.params.criteria || {}, step.params);
            break;
          case 'present':
            result = await this.presenterAgent.presentIdea(sessionId, step.params.idea, step.params.audience, step.params);
            break;
        }
        results.push(result);
      } catch (error) {
        this.logger.error(`Step ${step.type} failed`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Legacy method - maintained for backward compatibility
   * Runs agents directly without orchestrator
   */
  async legacyProcess(sessionId: string, config: WorkflowConfig): Promise<Record<string, unknown>> {
    this.logger.warn('Using legacy process (no orchestrator)', { sessionId });

    const startTime = Date.now();
    await this.memoryService.initializeSession(sessionId);

    // Legacy step-by-step execution
    await this.eventBus.publish('agent:started', {
      sessionId, agent: 'Idea Generator', agentType: 'idea', step: 1, timestamp: new Date(),
    });
    const initialIdea = await this.ideaAgent.generateIdea(sessionId, config.topic);
    await this.eventBus.publish('agent:idea:completed', {
      sessionId, agent: 'Idea Generator', agentType: 'idea', output: initialIdea, timestamp: new Date(),
    });

    await this.eventBus.publish('agent:started', {
      sessionId, agent: 'Critic', agentType: 'critic', step: 2, timestamp: new Date(),
    });
    const criticisms = [await this.criticAgent.critique(sessionId, initialIdea.output.text)];
    await this.eventBus.publish('agent:critic:completed', {
      sessionId, agent: 'Critic', agentType: 'critic', output: criticisms[0], timestamp: new Date(),
    });

    await this.eventBus.publish('agent:started', {
      sessionId, agent: 'Refiner', agentType: 'refiner', step: 3, timestamp: new Date(),
    });
    const feedbackText = criticisms.map((c: any) => c.output.text).join('\n');
    let refinedIdea = await this.refinerAgent.refineIdea(sessionId, initialIdea.output.text, feedbackText);
    await this.eventBus.publish('agent:refiner:completed', {
      sessionId, agent: 'Refiner', agentType: 'refiner', output: refinedIdea, timestamp: new Date(),
    });

    let presentation;
    if (config.includePresentation) {
      await this.eventBus.publish('agent:started', {
        sessionId, agent: 'Presenter', agentType: 'presenter', step: 4, timestamp: new Date(),
      });
      presentation = await this.presenterAgent.presentIdea(sessionId, refinedIdea.output.text, config.audience);
      await this.eventBus.publish('agent:presenter:completed', {
        sessionId, agent: 'Presenter', agentType: 'presenter', output: presentation, timestamp: new Date(),
      });
    }

    const totalDuration = Date.now() - startTime;
    return {
      sessionId, initialIdea: initialIdea.output, criticisms: criticisms.map((c: any) => c.output),
      refinedIdea: refinedIdea.output, presentation: presentation?.output || undefined,
      executionHistory: await this.memoryService.getExecutionHistory(sessionId), totalDuration,
    };
  }
}
