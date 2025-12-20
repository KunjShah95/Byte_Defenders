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
    } catch (error) {
      this.logger.error('AI generation failed', error);
      throw new Error(`AI generation failed: ${error}`);
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
    } catch (error) {
      this.logger.error('Google API call failed', error);
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

    // Mock response based on prompt keywords
    let mockText = '';
    if (prompt.toLowerCase().includes('idea')) {
      mockText = `Here's a creative idea: A revolutionary approach to ${prompt.substring(0, 50)}...`;
    } else if (prompt.toLowerCase().includes('critic')) {
      mockText = `Critical analysis: While the concept has merit, consider these aspects: relevance, feasibility, and impact...`;
    } else if (prompt.toLowerCase().includes('refine')) {
      mockText = `Refined version: Building upon the feedback, here's an improved approach: ...`;
    } else if (prompt.toLowerCase().includes('present')) {
      mockText = `Final presentation: The culmination of our creative process reveals a comprehensive solution...`;
    } else {
      mockText = `Response to: ${prompt.substring(0, 100)}...`;
    }

    return {
      text: mockText,
      reasoning: 'Generated using mock AI service',
      metadata: {
        model: payload.model,
        provider: 'mock',
        tokensUsed: Math.floor(Math.random() * 500) + 100,
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
