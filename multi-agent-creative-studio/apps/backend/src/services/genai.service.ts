/**
 * GenAI Service - Wrapper for AI/LLM interactions
 * Supports OpenAI, Google Generative AI, and other compatible APIs
 */
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Logger } from '../utils/logger';
import { config } from '../config';

export interface AIRequestOptions {
  systemPrompt?: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  context?: Record<string, any>;
  provider?: 'openai' | 'google' | 'mock';
}

export interface AIResponse {
  text: string;
  reasoning?: string;
  metadata?: Record<string, any>;
  provider?: string;
}

export class GenAIService {
  private static instance: GenAIService;
  private openaiKey: string;
  private googleKey: string;
  private baseURL: string;
  private model: string;
  private provider: string;
  private googleAI?: GoogleGenerativeAI;
  private logger = Logger.getLogger('GenAIService');

  private constructor() {
    this.openaiKey = config.genai.openaiKey;
    this.googleKey = config.genai.googleKey;
    this.baseURL = config.genai.baseURL;
    this.model = config.genai.model;
    this.provider = config.genai.provider;

    if (this.googleKey) {
      this.googleAI = new GoogleGenerativeAI(this.googleKey);
    }
  }

  static getInstance(): GenAIService {
    if (!GenAIService.instance) {
      GenAIService.instance = new GenAIService();
    }
    return GenAIService.instance;
  }

  async generateText(options: AIRequestOptions): Promise<AIResponse> {
    const provider = options.provider || this.provider;

    try {
      this.logger.debug('Generating text with provider', {
        provider,
        model: options.model,
      });

      if (provider === 'google') {
        return await this.generateWithGoogle(options);
      } else if (provider === 'openai') {
        return await this.generateWithOpenAI(options);
      } else {
        return await this.generateWithMock(options);
      }
    } catch (error: any) {
      this.logger.error('AI generation failed', {
        error: error.message,
        stack: error.stack,
        provider,
        fallbackEnabled: config.genai.fallbackToMock
      });

      if (config.genai.fallbackToMock && provider !== 'mock') {
        this.logger.warn('Falling back to mock AI provider');
        return await this.generateWithMock(options);
      }

      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  private async generateWithGoogle(options: AIRequestOptions): Promise<AIResponse> {
    if (!this.googleAI) {
      throw new Error('Google AI not initialized. Please set GOOGLE_API_KEY.');
    }

    try {
      const model = this.googleAI.getGenerativeModel({
        model: options.model || this.model,
      });

      const generationConfig = {
        temperature: options.temperature || 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: options.maxTokens || 1000,
      };

      const prompt = options.systemPrompt
        ? `${options.systemPrompt}\n\n${options.userPrompt}`
        : options.userPrompt;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = result.response;
      const text = response.text();

      return {
        text,
        metadata: {
          provider: 'google',
          model: options.model || 'gemini-pro',
          tokensUsed: ((response.promptFeedback as any)?.tokenCount) || 0,
        },
      };
    } catch (error: any) {
      this.logger.error('Google API call failed', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        googleKey: this.googleKey ? '***set***' : 'not set',
        model: options.model || this.model
      });
      throw error;
    }
  }

  private async generateWithOpenAI(options: AIRequestOptions): Promise<AIResponse> {
    if (!this.openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const messages: Array<{ role: 'system' | 'user'; content: string }> = [];

      if (options.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt,
        });
      }

      messages.push({
        role: 'user',
        content: options.userPrompt,
      });

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: options.model || this.model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.openaiKey}`,
          },
        },
      );

      const text = response.data.choices[0]?.message?.content || '';

      return {
        text,
        metadata: {
          provider: 'openai',
          model: options.model || this.model,
          tokensUsed: response.data.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      this.logger.error('OpenAI API call failed', error);
      throw error;
    }
  }

  /**
   * Generate a deterministic pseudo-random value seeded from prompt content.
   * Ensures the same prompt+agentType always produces the same result
   * but different prompts produce different outputs.
   */
  private seededValue(seed: number, index: number = 0): number {
    const hash = Math.abs(Math.sin(seed * 9301 + index * 49297) * 233280);
    return hash - Math.floor(hash);
  }

  /**
   * Pick an item from an array using the seeded random.
   */
  private pick<T>(arr: T[], seed: number, index: number): T {
    return arr[Math.floor(this.seededValue(seed, index) * arr.length)];
  }

  /**
   * Pick a number between min and max (inclusive) using seeded random.
   */
  private pickInt(seed: number, index: number, min: number, max: number): number {
    return min + Math.floor(this.seededValue(seed, index) * (max - min + 1));
  }

  /**
   * Dynamic mock response generator.
   *
   * Instead of returning canned text, this method:
   * 1. Extracts context from the prompt (topic, keywords, domain, audience)
   * 2. Uses a seed derived from the prompt content for deterministic variety
   * 3. Generates agent-appropriate response structure with unique sections
   * 4. Incorporates actual prompt content into the response
   * 5. Varies scores, metrics, and section counts
   */
  private generateDynamicMockResponse(
    prompt: string,
    agentType: string,
    systemPrompt?: string,
  ): { text: string; reasoning: string } {
    // Extract context from prompt
    const topicMatch = prompt.match(/topic[:\s]+([^\n.]+)/i);
    const topic = topicMatch ? topicMatch[1].trim() : 'the given topic';

    const domainMatch = prompt.match(/domain[:\s]+([^\n.]+)/i);
    const domain = domainMatch ? domainMatch[1].trim() : '';

    const audienceMatch = prompt.match(/audience[:\s]+([^\n.]+)/i);
    const audience = audienceMatch ? audienceMatch[1].trim() : '';

    const goalsMatch = prompt.match(/goals[:\s]+([^\n.]+)/i);
    const goals = goalsMatch ? goalsMatch[1].trim() : '';

    // Build a seed from the prompt content + agent type for deterministic variety
    const seedString = `${prompt.substring(0, 100)}::${agentType}::${topic}`;
    let seed = 0;
    for (let i = 0; i < seedString.length; i++) {
      seed = ((seed << 5) - seed) + seedString.charCodeAt(i);
      seed |= 0;
    }
    const seedAbs = Math.abs(seed) || 1;

    // Common phrases pool for variety
    const openingPhrases = [
      `After thorough analysis of "${topic}", I've developed the following`,
      `Based on comprehensive evaluation of the topic "${topic}", here is my`,
      `Drawing from deep expertise in this domain, I present my`,
      `Having carefully considered "${topic}" from multiple angles, here is my`,
      `Through systematic analysis of "${topic}", I've arrived at the following`,
    ];

    const closingPhrases = [
      'This provides a solid foundation for the next phase of development.',
      'These insights should serve as a springboard for further refinement.',
      'The path forward is clear, with multiple avenues for exploration.',
      'This analysis offers actionable direction for implementation.',
      'These findings represent a comprehensive starting point for execution.',
    ];

    const metrics = [
      { label: 'Market Readiness', value: this.pickInt(seedAbs, 0, 55, 95) },
      { label: 'Innovation Score', value: this.pickInt(seedAbs, 1, 60, 98) },
      { label: 'Feasibility Index', value: this.pickInt(seedAbs, 2, 50, 90) },
      { label: 'User Impact', value: this.pickInt(seedAbs, 3, 45, 95) },
      { label: 'Scalability Potential', value: this.pickInt(seedAbs, 4, 40, 92) },
    ];

    const opening = this.pick(openingPhrases, seedAbs, 0);
    const closing = this.pick(closingPhrases, seedAbs, 1);

    const ideaKeywords = [
      `AI-powered ${topic} assistant`,
      `Decentralized ${topic} marketplace`,
      `${topic}-as-a-Service platform`,
      `${topic} collaboration hub`,
      `Smart ${topic} optimization engine`,
    ];

    const sections = [
      'Core Concept',
      'Key Features',
      'Target Audience',
      'Value Proposition',
      'Implementation Strategy',
      'Risk Factors',
      'Next Steps',
    ];

    const sectionCount = this.pickInt(seedAbs, 2, 4, sections.length);

    // Build dynamic response based on agent type
    let text = '';
    let reasoning = '';

    if (agentType === 'idea' || agentType === 'strategist') {
      const conceptName = this.pick(ideaKeywords, seedAbs, 3);
      const numIdeas = this.pickInt(seedAbs, 4, 3, 6);

      text = `# ${conceptName}\n\n${opening}:\n\n## Strategic Foundation\n\n`;
      text += `**Domain Focus**: ${domain || 'Cross-industry innovation'}\n`;
      text += `**Target Market**: ${audience || 'Tech-enabled enterprises and consumers'}\n`;
      text += `**Primary Goal**: ${goals || `Revolutionize ${topic} through technology and user-centric design`}\n\n`;

      for (let i = 1; i <= numIdeas; i++) {
        const angle = this.pick([
          'technology-first',
          'user-centric',
          'sustainability-driven',
          'community-powered',
          'data-optimized',
          'platform-based',
        ], seedAbs, i * 10);
        text += `## Concept ${i}: ${this.pick(ideaKeywords, seedAbs, i * 7)}\n\n`;
        text += `A **${angle}** approach that leverages cutting-edge technology to address key pain points in the ${topic} space. `;
        text += `This concept focuses on ${this.pick(['scalability', 'user experience', 'market disruption', 'operational efficiency', 'sustainability'], seedAbs, i * 13)} `;
        text += `as its primary differentiator.\n\n`;
        text += `**Key Advantage**: ${this.pick([
          `First-mover opportunity in ${topic}`,
          `Unique integration of AI and ${topic}`,
          `Novel approach to solving ${topic} challenges`,
          `Combination of proven methods with innovative technology`,
          `Strong network effects within the ${topic} ecosystem`,
        ], seedAbs, i * 17)}\n\n`;
      }

      text += `## Strategic Recommendations\n\n`;
      const recCount = this.pickInt(seedAbs, 50, 3, 5);
      for (let i = 1; i <= recCount; i++) {
        text += `${i}. ${this.pick([
          `Validate the core assumptions through market research before full-scale development`,
          `Build an MVP focusing on the highest-value feature set first`,
          `Establish strategic partnerships to accelerate market entry`,
          `Develop a phased rollout strategy with clear success metrics at each stage`,
          `Invest in user research to refine the product-market fit continuously`,
          `Create a feedback loop with early adopters to iterate rapidly`,
        ], seedAbs, i * 20)}\n`;
      }

      reasoning = this.pick([
        `Strategic framework developed from analysis of ${topic} market dynamics and user needs`,
        `Ideation process leveraged multiple creative frameworks and domain expertise in ${topic}`,
        `Concepts generated through systematic exploration of ${topic} opportunities and constraints`,
      ], seedAbs, 99);

    } else if (agentType === 'critic' || agentType === 'quality-assurance') {
      const strengthCount = this.pickInt(seedAbs, 5, 3, 5);
      const concernCount = this.pickInt(seedAbs, 6, 3, 6);

      text = `# Comprehensive ${agentType === 'quality-assurance' ? 'Quality Assessment' : 'Critical Analysis'}\n\n`;
      text += `${opening}:\n\n## Executive Summary\n\n`;
      text += `After thorough evaluation of "${topic}", this concept demonstrates `;
      text += `${this.pick(['significant', 'moderate', 'considerable'], seedAbs, 7)} potential with `;
      text += `${this.pick(['several', 'some', 'notable'], seedAbs, 8)} areas requiring attention.\n\n`;

      text += `## Strengths\n\n`;
      for (let i = 1; i <= strengthCount; i++) {
        text += `**${this.pick([
          'Innovative Approach',
          'Market Timing',
          'User Focus',
          'Scalability',
          'Technical Feasibility',
          'Competitive Advantage',
          'Revenue Potential',
        ], seedAbs, i * 10)}**: `;
        text += `${this.pick([
          `The concept addresses a genuine market need in the ${topic} space`,
          `Strong alignment with current industry trends and user expectations`,
          `Clear differentiation from existing solutions in the market`,
          `Well-thought-out approach to user acquisition and retention`,
          `Solid technical foundation with room for future expansion`,
          `Realistic assessment of resource requirements and timeline`,
          `Strong potential for network effects and community building`,
        ], seedAbs, i * 12)}\n\n`;
      }

      text += `## Areas for Improvement\n\n`;
      for (let i = 1; i <= concernCount; i++) {
        text += `**${this.pick([
          'Competitive Response',
          'Market Validation',
          'Technical Complexity',
          'Resource Requirements',
          'Regulatory Compliance',
          'User Adoption',
          'Revenue Model',
        ], seedAbs, i * 20)}**: `;
        text += `${this.pick([
          `Larger competitors may enter this space with significant resources`,
          `Additional market validation is needed to confirm demand assumptions`,
          `The technical architecture may require more specialized expertise`,
          `Initial resource estimates may need to be revised upward`,
          `Regulatory considerations could impact the timeline significantly`,
          `User acquisition costs may be higher than initially projected`,
          `The revenue model requires further stress-testing and validation`,
        ], seedAbs, i * 22)}\n\n`;
      }

      text += `## ${agentType === 'quality-assurance' ? 'Quality Metrics' : 'Scoring Metrics'}\n\n`;
      for (const m of metrics.slice(0, this.pickInt(seedAbs, 70, 3, 5))) {
        const bar = '█'.repeat(Math.floor(m.value / 10)) + '░'.repeat(10 - Math.floor(m.value / 10));
        text += `- **${m.label}**: ${m.value}/100 ${bar}\n`;
      }

      text += `\n## Recommendations\n\n`;
      const recCount2 = this.pickInt(seedAbs, 80, 3, 4);
      for (let i = 1; i <= recCount2; i++) {
        text += `${i}. ${this.pick([
          `Conduct targeted market research to validate key assumptions about ${topic}`,
          `Develop a prototype to test core features with real users`,
          `Establish advisory board with domain experts in ${topic}`,
          `Create detailed financial projections with multiple scenarios`,
          `Build contingency plans for identified risk factors`,
          `Focus on a single use case to achieve product-market fit before expanding`,
        ], seedAbs, i * 30)}\n`;
      }

      reasoning = this.pick([
        `Critical evaluation performed across ${strengthCount + concernCount} dimensions using established analysis frameworks`,
        `Quality assessment conducted through systematic evaluation against defined success criteria`,
        `Analysis synthesized from multiple perspectives including market, technical, and user considerations`,
      ], seedAbs, 98);

    } else if (agentType === 'refiner') {
      const improvements = this.pickInt(seedAbs, 10, 4, 7);

      text = `# Refined Concept: ${this.pick(ideaKeywords, seedAbs, 11)}\n\n${opening}:\n\n`;
      text += `## Refinement Summary\n\n`;
      text += `The original concept has been strengthened through systematic improvements addressing `;
      text += `${this.pickInt(seedAbs, 12, 3, 5)} key areas. The refined version offers:\n\n`;
      text += `- **Enhanced Clarity**: Clearer articulation of the core value proposition\n`;
      text += `- **Improved Feasibility**: More realistic implementation approach\n`;
      text += `- **Stronger Differentiation**: Sharper competitive positioning\n`;
      text += `- **Better Risk Mitigation**: Comprehensive contingency planning\n`;

      text += `\n## Key Improvements\n\n`;
      for (let i = 1; i <= improvements; i++) {
        text += `### Improvement ${i}: ${this.pick([
          'Strengthened Value Proposition',
          'Enhanced User Experience',
          'Optimized Business Model',
          'Improved Technical Architecture',
          'Streamlined Operations',
          'Better Market Positioning',
          'Refined Go-to-Market Strategy',
          'Enhanced Risk Management',
        ], seedAbs, i * 15)}\n\n`;
        text += this.pick([
          `The core offering has been refined to deliver more immediate value to users, with clearer differentiation from alternatives and a stronger emphasis on the unique benefits specific to ${topic}.`,
          `The user experience has been redesigned to reduce friction points and improve engagement, incorporating feedback loops and personalization features that adapt to individual user needs within the ${topic} space.`,
          `The business model has been restructured to improve unit economics, with multiple revenue streams that reduce dependency on any single source and create more sustainable growth.`,
          `The technical approach now leverages more mature, proven technologies while maintaining flexibility for future innovation, reducing implementation risk.`,
          `Operational processes have been streamlined to reduce overhead and improve scalability, with automation handling routine tasks and freeing resources for value-added activities.`,
        ], seedAbs, i * 18);
        text += '\n\n';
      }

      text += `\n## Implementation Roadmap\n\n`;
      const phases = this.pickInt(seedAbs, 60, 3, 4);
      for (let i = 1; i <= phases; i++) {
        text += `**Phase ${i}** (${this.pick(['Months 1-3', 'Months 4-6', 'Months 7-12', 'Months 13-18'], seedAbs, i * 25)}): `;
        text += `${this.pick([
          `Foundation and core infrastructure for ${topic}`,
          `MVP launch with essential features and early adopter program`,
          `Scale operations and expand feature set based on user feedback`,
          `Optimize for growth and prepare for market expansion`,
        ], seedAbs, i * 28)}\n`;
      }

      reasoning = this.pick([
        `Refinements based on systematic analysis of original concept strengths and weaknesses in context of ${topic}`,
        `Improvements derived from iterative evaluation against best practices and market requirements for ${topic}`,
        `Enhanced version incorporates feedback from multiple perspectives to create a more robust and viable solution`,
      ], seedAbs, 97);

    } else if (agentType === 'presenter') {
      text = `# Executive Presentation: ${topic}\n\n${opening}:\n\n`;
      text += `## Executive Summary\n\n`;
      text += `This presentation outlines a comprehensive strategy for ${topic}, `;
      text += `targeting ${audience || 'enterprise and consumer markets'} with a projected market opportunity of `;
      text += `$${this.pickInt(seedAbs, 30, 5, 50)}B by ${2026 + this.pickInt(seedAbs, 31, 1, 4)}.\n\n`;

      text += `## Market Opportunity\n\n`;
      text += `- **Total Addressable Market**: $${this.pickInt(seedAbs, 32, 10, 100)}B\n`;
      text += `- **Serviceable Addressable Market**: $${this.pickInt(seedAbs, 33, 3, 30)}B\n`;
      text += `- **Serviceable Obtainable Market**: $${this.pickInt(seedAbs, 34, 1, 10)}B\n`;
      text += `- **Projected CAGR**: ${this.pickInt(seedAbs, 35, 12, 35)}%\n\n`;

      text += `## Business Model\n\n`;
      const revenueStreams = this.pickInt(seedAbs, 36, 3, 5);
      let totalPct = 0;
      const pcts: number[] = [];
      for (let i = 0; i < revenueStreams; i++) {
        const remaining = 100 - totalPct - (revenueStreams - i - 1);
        const pct = this.pickInt(seedAbs, 37 + i, Math.max(10, remaining - 20), remaining);
        pcts.push(pct);
        totalPct += pct;
      }
      pcts[pcts.length - 1] += 100 - totalPct;

      const streamNames = [
        'Subscription Tiers', 'Transaction Fees', 'Enterprise Licensing',
        'Advertising Revenue', 'Data Insights', 'Professional Services',
        'Marketplace Commissions', 'API Access Fees',
      ];
      for (let i = 0; i < revenueStreams; i++) {
        text += `- **${streamNames[i]}**: ${pcts[i]}% of revenue\n`;
      }

      text += `\n## Financial Projections\n\n`;
      text += `| Metric | Year 1 | Year 2 | Year 3 |\n`;
      text += `|--------|--------|--------|--------|\n`;
      text += `| Revenue | $${this.pickInt(seedAbs, 50, 1, 5)}M | $${this.pickInt(seedAbs, 51, 5, 20)}M | $${this.pickInt(seedAbs, 52, 20, 80)}M |\n`;
      text += `| EBITDA | -$${this.pickInt(seedAbs, 53, 1, 5)}M | $${this.pickInt(seedAbs, 54, -2, 5)}M | $${this.pickInt(seedAbs, 55, 5, 25)}M |\n`;
      text += `| Users | ${this.pickInt(seedAbs, 56, 10, 100)}K | ${this.pickInt(seedAbs, 57, 100, 500)}K | ${this.pickInt(seedAbs, 58, 500, 2000)}K |\n\n`;

      text += `## Go-to-Market Strategy\n\n`;
      text += `**Phase 1**: Launch in ${this.pickInt(seedAbs, 61, 2, 5)} key markets with targeted pilot programs\n`;
      text += `**Phase 2**: Expand based on validated learnings and user feedback\n`;
      text += `**Phase 3**: Scale nationally and explore international opportunities\n\n`;

      text += `## Investment Ask\n\n`;
      text += `Seeking $${this.pickInt(seedAbs, 62, 3, 15)}M in ${this.pick(['Seed', 'Series A', 'Series B'], seedAbs, 63)} funding to:\n`;
      text += `- Product development: ${this.pickInt(seedAbs, 64, 30, 50)}%\n`;
      text += `- Marketing & growth: ${this.pickInt(seedAbs, 65, 20, 35)}%\n`;
      text += `- Operations & team: ${this.pickInt(seedAbs, 66, 15, 25)}%\n`;
      text += `- Working capital: ${this.pickInt(seedAbs, 67, 5, 15)}%\n\n`;

      text += `## Call to Action\n\n`;
      text += closing;

      reasoning = this.pick([
        `Presentation structured for executive audience with focus on market opportunity, business model, and financial projections for ${topic}`,
        `Comprehensive pitch deck developed with data-driven market analysis and clear investment thesis in ${topic}`,
        `Executive summary crafted to highlight the strategic value and growth potential of the ${topic} opportunity`,
      ], seedAbs, 96);

    } else {
      // Default: research/coder/other agents
      text = `# Analysis: ${topic}\n\n${opening}:\n\n`;
      text += `## Key Findings\n\n`;

      for (let i = 1; i <= this.pickInt(seedAbs, 70, 4, 7); i++) {
        text += `### Finding ${i}\n\n`;
        text += this.pick([
          `The ${topic} landscape is evolving rapidly with new technologies and changing user expectations driving transformation.`,
          `Market analysis reveals significant opportunity for innovation in how ${topic} services are delivered and consumed.`,
          `User research indicates strong demand for solutions that address key pain points in the current ${topic} ecosystem.`,
          `Technical feasibility assessment confirms that modern tools and frameworks make implementation achievable within reasonable timelines.`,
          `Competitive analysis shows gaps in the market that can be exploited with the right strategic positioning.`,
          `Stakeholder interviews highlight the need for solutions that balance innovation with practical implementation realities.`,
          `Industry trends point toward increasing adoption of AI and automation in the ${topic} space.`,
        ], seedAbs, i * 40);
        text += '\n\n';
      }

      text += `## Conclusions\n\n`;
      text += closing;

      reasoning = this.pick([
        `Research conducted across multiple dimensions including market analysis, technical feasibility, and user needs in ${topic}`,
        `Comprehensive analysis synthesized from available data and domain expertise in ${topic}`,
        `Systematic evaluation performed using established research methodologies and frameworks`,
      ], seedAbs, 95);
    }

    return { text, reasoning };
  }

  /**
   * Generate text with mock implementation
   */
  private async generateWithMock(options: AIRequestOptions): Promise<AIResponse> {
    // Simulate realistic AI latency (varies by response length)
    const prompt = options.systemPrompt
      ? `${options.systemPrompt}\n\n${options.userPrompt}`
      : options.userPrompt;

    // Determine agent type from system prompt or context
    const agentType = options.systemPrompt?.toLowerCase().includes('strategist')
      ? 'strategist'
      : options.systemPrompt?.toLowerCase().includes('quality')
        ? 'quality-assurance'
        : options.systemPrompt?.toLowerCase().includes('researcher')
          ? 'researcher'
          : options.systemPrompt?.toLowerCase().includes('critic')
            ? 'critic'
            : options.systemPrompt?.toLowerCase().includes('refiner')
              ? 'refiner'
              : options.systemPrompt?.toLowerCase().includes('presenter')
                ? 'presenter'
                : options.systemPrompt?.toLowerCase().includes('coder')
                  ? 'coder'
                  : 'idea';

    // Variable delay to simulate API latency (100-300ms)
    const delayMs = 100 + Math.floor(Math.abs(Math.sin(prompt.length)) * 200);
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    const { text, reasoning } = this.generateDynamicMockResponse(
      prompt,
      agentType,
      options.systemPrompt,
    );

    return {
      text,
      reasoning,
      metadata: {
        model: options.model || this.model,
        provider: 'mock',
        tokensUsed: Math.floor(text.split(/\s+/).length * 1.3),
        agentType,
      },
    };
  }

  setOpenAIKey(key: string): void {
    this.openaiKey = key;
  }

  setGoogleKey(key: string): void {
    this.googleKey = key;
    if (key) {
      this.googleAI = new GoogleGenerativeAI(key);
    }
  }

  setProvider(provider: string): void {
    this.provider = provider;
  }
}
