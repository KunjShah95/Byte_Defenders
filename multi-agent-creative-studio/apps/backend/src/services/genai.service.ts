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

    // Initialize Google AI if key is provided
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

  /**
   * Generate text using AI model
   */
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
      
      // Fallback to mock if enabled and we haven't already tried mock
      if (config.genai.fallbackToMock && provider !== 'mock') {
        this.logger.warn('Falling back to mock AI provider');
        return await this.generateWithMock(options);
      }
      
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  /**
   * Generate using Google Generative AI
   */
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

  /**
   * Generate using OpenAI API
   */
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
   * Mock AI call for development (fallback)
   */
  private async mockAICall(prompt: string, payload: any): Promise<AIResponse> {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Extract topic from prompt for more contextual responses
    const topicMatch = prompt.match(/topic[:\s]+([^\n.]+)/i);
    const topic = topicMatch ? topicMatch[1].trim() : 'the given topic';

    // Mock response based on prompt keywords with detailed content
    let mockText = '';
    if (prompt.toLowerCase().includes('idea') || prompt.toLowerCase().includes('generating ideas')) {
      mockText = `# Innovative Business Concept: ${topic}

## Core Idea
A comprehensive platform that revolutionizes ${topic} by combining cutting-edge technology with sustainable practices and user-centric design.

## Key Features
1. **Smart Integration**: Leverage AI and machine learning to optimize operations and user experience
2. **Sustainability Focus**: Implement eco-friendly practices and carbon-neutral operations
3. **Community Building**: Create a strong network effect through social features and rewards
4. **Scalable Model**: Design for rapid growth and market expansion

## Target Market
- Primary: Tech-savvy consumers aged 25-45
- Secondary: Environmentally conscious businesses and organizations
- Tertiary: B2B partnerships and enterprise clients

## Value Proposition
Delivers convenience, sustainability, and cost savings while building a loyal community around shared values.

## Initial Go-to-Market Strategy
Phase 1: Launch pilot program in major metropolitan areas
Phase 2: Expand based on user feedback and market validation
Phase 3: Scale nationally and explore international markets`;
    } else if (prompt.toLowerCase().includes('critic') || prompt.toLowerCase().includes('evaluat')) {
      mockText = `# Critical Analysis

## Strengths
- **Innovation**: The concept presents a fresh approach to an existing market need
- **Timing**: Current market trends favor this type of solution
- **Differentiation**: Clear unique value propositions that set it apart

## Areas for Improvement

### Market Viability
- Need more detailed competitive analysis
- Market size validation required
- Customer acquisition cost projections needed

### Operational Challenges
- **Supply Chain**: Complex logistics that may impact scalability
- **Regulatory Compliance**: Industry-specific regulations to navigate
- **Technology Stack**: High initial development costs

### Financial Considerations
- Burn rate may be high in early stages
- Revenue model needs stress testing
- Consider alternative funding strategies

## Recommendations
1. Conduct thorough market research and validation
2. Build MVP to test core assumptions
3. Establish strategic partnerships early
4. Plan for regulatory compliance from day one
5. Develop contingency plans for key risks

## Overall Assessment
Promising concept with solid foundation but requires refinement in execution strategy and risk mitigation.`;
    } else if (prompt.toLowerCase().includes('refin') || prompt.toLowerCase().includes('improv')) {
      mockText = `# Refined Business Concept

## Enhanced Core Proposition
Building on the original concept, we've integrated the feedback to create a more robust and market-ready solution:

### Strengthened Value Proposition
- **Immediate Benefits**: Clearly articulated time and cost savings for users
- **Long-term Value**: Loyalty programs and community engagement features
- **Social Impact**: Measurable positive environmental and social outcomes

## Improved Operational Model

### Phase 1: Foundation (Months 1-6)
- Launch MVP with core features
- Establish partnerships with 3-5 key suppliers
- Build initial user base of 1,000-5,000 active users
- Validate unit economics

### Phase 2: Growth (Months 7-18)
- Expand service offerings based on user feedback
- Scale to 3-5 additional markets
- Achieve positive unit economics
- Raise Series A funding

### Phase 3: Scale (Months 19-36)
- National expansion
- Platform partnerships and integrations
- Additional revenue streams
- Path to profitability

## Risk Mitigation Strategies
1. **Market Risk**: Diversify service offerings and target markets
2. **Operational Risk**: Build redundancy into supply chain
3. **Financial Risk**: Maintain 12-18 month runway at all times
4. **Technology Risk**: Use proven tech stack with fallback options

## Competitive Advantages
- First-mover advantage in specific niche
- Strong brand positioning around sustainability
- Network effects create switching costs
- Data insights improve over time

## Success Metrics
- Monthly Active Users (MAU)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Net Promoter Score (NPS)
- Revenue Growth Rate`;
    } else if (prompt.toLowerCase().includes('present') || prompt.toLowerCase().includes('final')) {
      mockText = `# Executive Presentation: ${topic}

## Vision Statement
To become the leading platform for ${topic}, transforming how people interact with this space while creating positive environmental and social impact.

## Market Opportunity
- **Total Addressable Market (TAM)**: $50B globally
- **Serviceable Addressable Market (SAM)**: $10B in target regions
- **Serviceable Obtainable Market (SOM)**: $500M within 3 years

## The Solution
Our platform addresses three critical pain points:
1. **Convenience**: Streamlined user experience saves 40% time
2. **Sustainability**: 60% reduction in carbon footprint
3. **Value**: 25% cost savings compared to traditional alternatives

## Business Model
### Revenue Streams
1. Transaction fees (70% of revenue)
2. Subscription tiers (20% of revenue)
3. B2B partnerships (10% of revenue)

### Unit Economics
- Average Order Value: $45
- Customer Acquisition Cost: $15
- Lifetime Value: $180
- LTV/CAC Ratio: 12:1

## Go-to-Market Strategy
**Year 1**: Establish presence in 5 metropolitan areas, achieve 50K users
**Year 2**: Expand to 15 markets, reach 250K users, achieve break-even
**Year 3**: National coverage, 1M users, achieve profitability

## Competitive Landscape
- **Direct Competitors**: 3 main players with traditional models
- **Our Advantage**: Technology-first approach with sustainability focus
- **Market Positioning**: Premium yet accessible service

## Team & Expertise
- Experienced founding team with domain expertise
- Advisory board with industry veterans
- Strong technical team with proven track record

## Financial Projections
**Year 1**: $2M revenue, -$3M EBITDA
**Year 2**: $10M revenue, -$1M EBITDA  
**Year 3**: $35M revenue, +$5M EBITDA

## Investment Ask
Seeking $5M Series A to fund:
- Product development (40%)
- Marketing & user acquisition (35%)
- Operations & team expansion (20%)
- Working capital (5%)

## Milestones & Timeline
Q1: Launch MVP, secure initial partnerships
Q2-Q3: Market validation, iterate based on feedback
Q4: Scale to 3 markets, achieve product-market fit
Year 2: Geographic expansion and revenue growth
Year 3: Path to profitability and Series B preparation

## Call to Action
Join us in revolutionizing ${topic} while building a sustainable and profitable business. Together, we can create meaningful impact and strong returns.`;
    } else {
      mockText = `# Comprehensive Analysis

Based on the provided context, here's a detailed response:

## Key Insights
- The concept shows strong potential in the current market environment
- Strategic positioning aligns with emerging consumer trends
- Multiple pathways to value creation and market penetration

## Detailed Breakdown
1. **Market Dynamics**: Understanding target audience needs and behaviors
2. **Competitive Analysis**: Identifying gaps and opportunities in existing solutions
3. **Value Creation**: Clear articulation of benefits to stakeholders
4. **Execution Strategy**: Practical steps for implementation and scaling

## Strategic Recommendations
- Focus on core value proposition and user experience
- Build strong partnerships to accelerate growth
- Maintain flexibility to adapt to market feedback
- Establish clear metrics for success tracking

## Next Steps
1. Validate assumptions through market research
2. Develop minimum viable product
3. Test with early adopter segment
4. Iterate based on learnings
5. Scale proven model systematically

The path forward requires careful execution balanced with bold vision.`;
    }

    return {
      text: mockText,
      reasoning: 'Generated using mock AI service with enhanced content',
      metadata: {
        model: payload.model,
        provider: 'mock',
        tokensUsed: Math.floor(Math.random() * 500) + 300,
      },
    };
  }

  /**
   * Generate text with mock implementation
   */
  private async generateWithMock(options: AIRequestOptions): Promise<AIResponse> {
    const prompt = options.systemPrompt
      ? `${options.systemPrompt}\n\n${options.userPrompt}`
      : options.userPrompt;

    return this.mockAICall(prompt, {
      model: options.model || this.model,
    });
  }

  /**
   * Set OpenAI API key
   */
  setOpenAIKey(key: string): void {
    this.openaiKey = key;
  }

  /**
   * Set Google API key
   */
  setGoogleKey(key: string): void {
    this.googleKey = key;
    if (key) {
      this.googleAI = new GoogleGenerativeAI(key);
    }
  }

  /**
   * Set provider
   */
  setProvider(provider: string): void {
    this.provider = provider;
  }
}
