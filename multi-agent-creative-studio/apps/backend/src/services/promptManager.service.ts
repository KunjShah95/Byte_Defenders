/**
 * Prompt Manager Service - Advanced prompt management and optimization
 */
import {
  ideaAgentPrompts,
  criticAgentPrompts,
  refinerAgentPrompts,
  presenterAgentPrompts,
  researcherAgentPrompts,
  coderAgentPrompts,
  strategistAgentPrompts,
  qualityAssuranceAgentPrompts,
  getPromptTemplate,
  PromptContext,
  PromptTemplate,
} from '../prompts/templates';
import { Logger } from '../utils/logger';

export interface PromptConfig {
  agentType: string;
  templateName: string;
  context: PromptContext;
  dynamicAdjustment?: boolean;
}

export interface OptimizedPrompt {
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
  model?: string;
}

export class PromptManagerService {
  private static instance: PromptManagerService;
  private logger = Logger.getLogger('PromptManagerService');

  private promptMap: Record<string, any> = {
    idea: ideaAgentPrompts,
    critic: criticAgentPrompts,
    refiner: refinerAgentPrompts,
    presenter: presenterAgentPrompts,
    researcher: researcherAgentPrompts,
    coder: coderAgentPrompts,
    strategist: strategistAgentPrompts,
    'quality-assurance': qualityAssuranceAgentPrompts,
  };

  private constructor() { }

  static getInstance(): PromptManagerService {
    if (!PromptManagerService.instance) {
      PromptManagerService.instance = new PromptManagerService();
    }
    return PromptManagerService.instance;
  }

  /**
   * Build optimized prompt for agent execution
   */
  buildOptimizedPrompt(config: PromptConfig): OptimizedPrompt {
    const agentPrompts = this.promptMap[config.agentType];
    if (!agentPrompts) {
      throw new Error(`Unknown agent type: ${config.agentType}`);
    }

    const template = agentPrompts[config.templateName as keyof typeof agentPrompts] as any;
    if (!template) {
      throw new Error(
        `Unknown template for ${config.agentType}: ${config.templateName}`,
      );
    }

    const { systemPrompt, userPrompt } = getPromptTemplate(
      agentPrompts as any,
      config.templateName,
      config.context,
    );

    let temperature = (template as any).temperature || 0.7;
    let maxTokens = (template as any).maxTokens || 1500;

    // Dynamic adjustment based on context
    if (config.dynamicAdjustment) {
      ({ temperature, maxTokens } = this.adjustPromptParameters(
        config.agentType,
        config.context,
        temperature,
        maxTokens,
      ));
    }

    this.logger.debug('Prompt optimized', {
      agentType: config.agentType,
      template: config.templateName,
      temperature,
      maxTokens,
    });

    return {
      systemPrompt,
      userPrompt,
      temperature,
      maxTokens,
    };
  }

  /**
   * Dynamically adjust prompt parameters based on context
   */
  private adjustPromptParameters(
    agentType: string,
    context: PromptContext,
    baseTemperature: number,
    baseMaxTokens: number,
  ): { temperature: number; maxTokens: number } {
    let temperature = baseTemperature;
    let maxTokens = baseMaxTokens;

    // Increase creativity for idea generation with constraints
    if (agentType === 'idea' && context.constraints && context.constraints.length > 0) {
      temperature = Math.min(temperature + 0.1, 1.0);
    }

    // Decrease temperature for more critical analysis
    if (agentType === 'critic') {
      temperature = Math.max(temperature - 0.1, 0.5);
    }

    // Increase tokens for complex refinement
    if (agentType === 'refiner' && context.feedback) {
      maxTokens = Math.ceil(baseMaxTokens * 1.2);
    }

    // Adjust for different audience complexity
    if (context.audience) {
      if (context.audience.includes('Executive') || context.audience.includes('C-level')) {
        maxTokens = Math.ceil(baseMaxTokens * 0.8); // More concise
      } else if (
        context.audience.includes('Technical') ||
        context.audience.includes('Engineering')
      ) {
        maxTokens = Math.ceil(baseMaxTokens * 1.1); // More detailed
      }
    }

    return { temperature, maxTokens };
  }

  /**
   * Get available templates for agent
   */
  getAvailableTemplates(agentType: string) {
    const agentPrompts = this.promptMap[agentType];
    if (!agentPrompts) {
      return [];
    }

    return Object.entries(agentPrompts).map(([key, template]: [string, any]) => ({
      id: key,
      name: template.name,
      temperature: template.temperature,
      maxTokens: template.maxTokens,
    }));
  }

  /**
   * Get recommended template for context
   */
  getRecommendedTemplate(
    agentType: string,
    context: PromptContext,
  ): string {
    const recommendations: Record<string, Record<string, string>> = {
      idea: {
        default: 'creative',
        domain_specific: 'domainSpecific',
        user_focused: 'userCentric',
        quick: 'brainstorm',
      },
      critic: {
        default: 'thorough',
        feasibility: 'feasibility',
        market: 'marketAnalysis',
        risks: 'riskAnalysis',
      },
      refiner: {
        default: 'improvement',
        iterative: 'iterative',
        combine: 'synthesis',
        specification: 'specification',
      },
      presenter: {
        default: 'detailed',
        executive: 'executive',
        quick: 'pitch',
        technical: 'detailed',
        visual: 'visual',
      },
      strategist: {
        default: 'strategic',
        competitive: 'competitive',
        metrics: 'successCriteria',
      },
      'quality-assurance': {
        default: 'validation',
        feasibility: 'feasibilityCheck',
      },
      researcher: {
        default: 'general',
      },
      coder: {
        default: 'implementation',
      },
    };

    const agentRecs = recommendations[agentType] || {};

    // Infer best template from context
    if (context.audience?.includes('Executive') && agentType === 'presenter') {
      return agentRecs.executive || agentRecs.default;
    }

    if (agentType === 'idea' && context.constraints && context.constraints.length > 0) {
      return agentRecs.domain_specific || agentRecs.default;
    }

    return agentRecs.default || 'default';
  }

  /**
   * Validate prompt configuration
   */
  validatePromptConfig(config: PromptConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Object.keys(this.promptMap).includes(config.agentType)) {
      errors.push(`Invalid agent type: ${config.agentType}`);
    }

    const agentPrompts = this.promptMap[config.agentType];
    if (!agentPrompts[config.templateName as keyof typeof agentPrompts]) {
      errors.push(
        `Invalid template "${config.templateName}" for agent "${config.agentType}"`,
      );
    }

    if (!config.context) {
      errors.push('Context is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Build few-shot examples into prompt
   */
  addExamplesToPrompt(
    basePrompt: OptimizedPrompt,
    includeExamples: boolean = true,
  ): OptimizedPrompt {
    if (!includeExamples) {
      return basePrompt;
    }

    // Examples will be added by the agent runner during execution
    return basePrompt;
  }

  /**
   * Chain prompts for multi-step processes
   */
  buildPromptChain(
    steps: Array<{
      agentType: string;
      template: string;
      context: PromptContext;
    }>,
  ): OptimizedPrompt[] {
    return steps.map((step) =>
      this.buildOptimizedPrompt({
        agentType: step.agentType,
        templateName: step.template,
        context: step.context,
        dynamicAdjustment: true,
      }),
    );
  }

  /**
   * Get prompt statistics
   */
  getPromptStats() {
    const stats = {
      totalAgents: Object.keys(this.promptMap).length,
      totalTemplates: 0,
      agentBreakdown: {} as Record<string, number>,
    };

    Object.entries(this.promptMap).forEach(([agent, templates]) => {
      const count = Object.keys(templates).length;
      stats.totalTemplates += count;
      stats.agentBreakdown[agent] = count;
    });

    return stats;
  }

  /**
   * Export all prompts for documentation
   */
  registerAgentPrompts(agentType: string, prompts: Record<string, any>) {
    this.promptMap[agentType] = prompts;
    this.logger.info(`Registered prompts for agent: ${agentType}`);
  }

  exportAllPrompts() {
    return this.promptMap;
  }
}
