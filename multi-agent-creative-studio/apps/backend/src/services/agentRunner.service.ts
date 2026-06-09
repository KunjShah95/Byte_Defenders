/**
 * Agent Runner Service - Orchestrates agent execution with advanced prompt management
 */
import { Logger } from '../utils/logger';
import { GenAIService } from './genai.service';
import { MemoryService } from './memory.service';
import { PromptManagerService } from './promptManager.service';
import { EventBus } from '../events/eventBus';
import { AgentOutput, AgentExecutionRequest } from '../models/agentOutput.model';
import { UUIDUtil } from '../utils/uuid';

export interface AgentConfig {
  name: string;
  type: string;
  defaultTemplate: string;
  temperature?: number;
  maxTokens?: number;
}

export class AgentRunnerService {
  private static instance: AgentRunnerService;
  private genAIService = GenAIService.getInstance();
  private memoryService = MemoryService.getInstance();
  private promptManager = PromptManagerService.getInstance();
  private eventBus = EventBus.getInstance();
  private agents: Map<string, AgentConfig> = new Map();
  private logger = Logger.getLogger('AgentRunnerService');

  private constructor() {
    this.initializeDefaultAgents();
  }

  static getInstance(): AgentRunnerService {
    if (!AgentRunnerService.instance) {
      AgentRunnerService.instance = new AgentRunnerService();
    }
    return AgentRunnerService.instance;
  }

  /**
   * Initialize default agent configurations with prompt templates
   */
  private initializeDefaultAgents(): void {
    this.agents.set('idea', {
      name: 'Idea Generator',
      type: 'idea',
      defaultTemplate: 'creative',
      temperature: 0.9,
      maxTokens: 5000, // Increased for very comprehensive idea generation with multiple detailed ideas
    });

    this.agents.set('critic', {
      name: 'Critic',
      type: 'critic',
      defaultTemplate: 'thorough',
      temperature: 0.7,
      maxTokens: 4500, // Increased for very detailed, multi-dimensional critique
    });

    this.agents.set('refiner', {
      name: 'Refiner',
      type: 'refiner',
      defaultTemplate: 'improvement',
      temperature: 0.7,
      maxTokens: 4500, // Increased for comprehensive refinement with multiple improvements
    });

    this.agents.set('presenter', {
      name: 'Presenter',
      type: 'presenter',
      defaultTemplate: 'detailed',
      temperature: 0.6,
      maxTokens: 4500, // Increased for complete presentations with all sections
    });

    this.agents.set('researcher', {
      name: 'Researcher',
      type: 'researcher',
      defaultTemplate: 'general',
      temperature: 0.5,
      maxTokens: 4500, // Increased for thorough, well-researched analysis
    });

    this.agents.set('coder', {
      name: 'Coder',
      type: 'coder',
      defaultTemplate: 'implementation',
      temperature: 0.2,
      maxTokens: 6000, // Increased for complete, production-ready code with comments
    });

    this.agents.set('strategist', {
      name: 'Strategist',
      type: 'strategist',
      defaultTemplate: 'strategic',
      temperature: 0.6,
      maxTokens: 4500,
    });

    this.agents.set('quality-assurance', {
      name: 'Quality Assurance',
      type: 'quality-assurance',
      defaultTemplate: 'validation',
      temperature: 0.4,
      maxTokens: 4000,
    });
  }

  /**
   * Execute an agent with advanced prompt management
   */
  async executeAgent(request: AgentExecutionRequest): Promise<AgentOutput> {
    const startTime = Date.now();
    const agentConfig = this.agents.get(request.agentType);

    if (!agentConfig) {
      throw new Error(`Unknown agent type: ${request.agentType}`);
    }

    this.logger.info(`Executing agent: ${agentConfig.name}`, { sessionId: request.sessionId });

    try {
      // Get recommended template based on context
      const templateName = this.promptManager.getRecommendedTemplate(
        request.agentType,
        request.context || {},
      );

      // Build optimized prompt
      const optimizedPrompt = this.promptManager.buildOptimizedPrompt({
        agentType: request.agentType,
        templateName,
        context: {
          ...request.input,
          ...request.context,
        },
        dynamicAdjustment: true,
      });

      // Call GenAI service with optimized prompt
      const aiResponse = await this.genAIService.generateText({
        systemPrompt: optimizedPrompt.systemPrompt,
        userPrompt: optimizedPrompt.userPrompt,
        temperature: optimizedPrompt.temperature,
        maxTokens: optimizedPrompt.maxTokens,
        context: request.context,
      });

      // Create agent output
      const agentOutput: AgentOutput = {
        id: UUIDUtil.generateWithPrefix('output'),
        sessionId: request.sessionId,
        agentName: agentConfig.name,
        agentType: request.agentType,
        input: request.input,
        output: {
          text: aiResponse.text,
          metadata: aiResponse.metadata,
        },
        reasoning: aiResponse.reasoning,
        timestamp: new Date(),
        duration: Date.now() - startTime,
        success: true,
      };

      // Store in memory with complete context
      this.memoryService.pushContext(
        request.sessionId,
        agentConfig.name,
        {
          agentType: request.agentType,
          input: request.input,
          output: agentOutput.output,
          reasoning: agentOutput.reasoning,
          duration: agentOutput.duration,
          template: templateName,
          originalIdea: request.input?.topic || request.input,
          idea: request.input?.topic || request.input,
          topic: request.input?.topic,
        },
        request.agentType,
      );

      // Publish event
      await this.eventBus.publish(`agent:${request.agentType}:completed`, agentOutput);

      this.logger.info(`Agent completed: ${agentConfig.name}`, {
        sessionId: request.sessionId,
        duration: agentOutput.duration,
        template: templateName,
      });

      return agentOutput;
    } catch (error) {
      const duration = Date.now() - startTime;

      const failedOutput: AgentOutput = {
        id: UUIDUtil.generateWithPrefix('output'),
        sessionId: request.sessionId,
        agentName: agentConfig.name,
        agentType: request.agentType,
        input: request.input,
        output: {},
        timestamp: new Date(),
        duration,
        success: false,
        error: String(error),
      };

      await this.eventBus.publish(`agent:${request.agentType}:failed`, failedOutput);

      this.logger.error(`Agent failed: ${agentConfig.name}`, error);

      throw error;
    }
  }

  /**
   * Register custom agent
   */
  registerAgent(config: AgentConfig): void {
    this.agents.set(config.type, config);
    this.logger.info(`Agent registered: ${config.name}`, { type: config.type });
  }

  /**
   * Get agent configuration
   */
  getAgent(type: string): AgentConfig | undefined {
    return this.agents.get(type);
  }

  /**
   * Get all agents
   */
  getAllAgents(): Map<string, AgentConfig> {
    return new Map(this.agents);
  }
}
