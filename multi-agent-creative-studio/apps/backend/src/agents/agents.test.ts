/**
 * Agent unit tests.
 *
 * These tests validate that each agent class:
 * - Constructs proper execution requests
 * - Returns properly shaped AgentOutput objects
 * - Handles errors gracefully
 *
 * The mock GenAI provider is already configured in test-setup.ts.
 */
import { describe, it, expect } from 'vitest';
import { IdeaAgent } from './idea.agent';
import { CriticAgent } from './critic.agent';
import { RefinerAgent } from './refiner.agent';
import { PresenterAgent } from './presenter.agent';
import { ResearcherAgent } from './researcher.agent';
import { StrategistAgent } from './strategist.agent';
import { QualityAssuranceAgent } from './quality-assurance.agent';

const TEST_SESSION = 'agent-test-session';

describe('IdeaAgent', () => {
  const agent = new IdeaAgent();

  it('generates an idea with text output', async () => {
    const result = await agent.generateIdea(TEST_SESSION, 'Build a sustainable platform');
    expect(result).toBeDefined();
    expect(result.output).toBeDefined();
    expect(typeof result.output.text).toBe('string');
    expect(result.output.text.length).toBeGreaterThan(50);
    expect(result.sessionId).toBe(TEST_SESSION);
    expect(result.agentType).toBe('idea');
    expect(result.success).toBe(true);
    expect(result.duration).toBeGreaterThanOrEqual(0);
  }, 15_000);

  it('brainstorms multiple ideas', async () => {
    const ideas = await agent.brainstorm(TEST_SESSION, 'Remote work', 2);
    expect(Array.isArray(ideas)).toBe(true);
    expect(ideas.length).toBe(2);
    ideas.forEach(idea => {
      expect(idea.output.text).toBeTruthy();
    });
  }, 30_000);

  it('accepts optional context', async () => {
    const result = await agent.generateIdea(TEST_SESSION, 'EdTech startup', {
      requirements: ['mobile-first', 'gamified'],
      constraints: ['under $50k budget', '6-month timeline'],
    });
    expect(result.success).toBe(true);
    expect(result.output.text.toLowerCase()).toContain('edtech');
  }, 15_000);
});

describe('CriticAgent', () => {
  const agent = new CriticAgent();

  it('critiques an idea', async () => {
    const idea = 'A platform that connects local farmers directly with consumers';
    const result = await agent.critique(TEST_SESSION, idea);
    expect(result.success).toBe(true);
    expect(result.output.text.length).toBeGreaterThan(50);
    // Mock response should be a substantial critique
    expect(result.output.text.length).toBeGreaterThan(100);
  }, 15_000);

  it('scores an idea with criteria', async () => {
    const result = await agent.scoreIdea(TEST_SESSION, 'AI-powered tutoring', [
      'feasibility', 'market_size', 'innovation',
    ]);
    expect(result.success).toBe(true);
    expect(result.output.text).toBeTruthy();
  }, 15_000);

  it('identifies risks', async () => {
    const result = await agent.identifyRisks(TEST_SESSION, 'Drone delivery service');
    expect(result.success).toBe(true);
    expect(result.output.text.length).toBeGreaterThan(50);
  }, 15_000);
});

describe('RefinerAgent', () => {
  const agent = new RefinerAgent();

  it('refines an idea based on feedback', async () => {
    const result = await agent.refineIdea(
      TEST_SESSION,
      'A subscription box for eco-friendly products',
      'The idea needs more focus on pricing strategy and customer retention',
    );
    expect(result.success).toBe(true);
    expect(result.output.text.length).toBeGreaterThan(50);
  }, 15_000);

  it('enhances a specific aspect', async () => {
    const result = await agent.enhanceAspect(
      TEST_SESSION,
      'A pet adoption marketplace app',
      'user experience',
    );
    expect(result.success).toBe(true);
    expect(result.output.text).toBeTruthy();
  }, 15_000);

  it('combines multiple ideas', async () => {
    const result = await agent.combineIdeas(TEST_SESSION, [
      'Idea 1: Food delivery platform',
      'Idea 2: Meal prep subscription',
    ]);
    expect(result.success).toBe(true);
    expect(result.output.text).toBeTruthy();
  }, 15_000);
});

describe('PresenterAgent', () => {
  const agent = new PresenterAgent();

  it('creates a presentation', async () => {
    const result = await agent.presentIdea(
      TEST_SESSION,
      'A blockchain-based supply chain tracker for organic food',
      'investors',
    );
    expect(result.success).toBe(true);
    expect(result.output.text.length).toBeGreaterThan(100);
    // Mock response should be a substantial presentation
    expect(result.output.text.length).toBeGreaterThan(200);
  }, 15_000);

  it('creates an executive summary', async () => {
    const result = await agent.createSummary(TEST_SESSION, 'Remote team collaboration tool');
    expect(result.success).toBe(true);
    expect(result.output.text).toBeTruthy();
  }, 15_000);

  it('creates a pitch', async () => {
    const result = await agent.createPitch(TEST_SESSION, 'Sustainable fashion marketplace');
    expect(result.success).toBe(true);
    expect(result.output.text).toBeTruthy();
  }, 15_000);
});

describe('ResearcherAgent', () => {
  const agent = new ResearcherAgent();

  it('researches a topic', async () => {
    const result = await agent.research(TEST_SESSION, 'Renewable energy trends in 2024');
    expect(result.success).toBe(true);
    expect(result.output.text.length).toBeGreaterThan(50);
  }, 15_000);
});

describe('StrategistAgent', () => {
  const agent = new StrategistAgent();

  it('develops a strategy', async () => {
    const result = await agent.developStrategy(TEST_SESSION, 'Expand into Southeast Asian market', {
      goals: ['10k users in 6 months', 'B2B partnerships'],
      constraints: ['limited local team', 'regulatory compliance'],
    });
    expect(result.success).toBe(true);
    expect(result.output.text.length).toBeGreaterThan(50);
  }, 15_000);

  it('defines success criteria', async () => {
    const result = await agent.defineSuccessCriteria(
      TEST_SESSION,
      'Launch a mobile banking app',
      ['user acquisition', 'transaction volume', 'customer satisfaction'],
    );
    expect(result.success).toBe(true);
    expect(result.output.text).toBeTruthy();
  }, 15_000);
});

describe('QualityAssuranceAgent', () => {
  const agent = new QualityAssuranceAgent();

  it('validates an output', async () => {
    const result = await agent.validateOutput(
      TEST_SESSION,
      'A complete business plan for a co-working space chain',
      { completeness: true, feasibility: true },
    );
    expect(result.success).toBe(true);
    expect(result.output.text.length).toBeGreaterThan(50);
  }, 15_000);

  it('performs feasibility check', async () => {
    const result = await agent.feasibilityCheck(
      TEST_SESSION,
      'Build a space tourism booking platform',
    );
    expect(result.success).toBe(true);
    expect(result.output.text).toBeTruthy();
  }, 15_000);
});

describe('Agent runner error handling', () => {
  it('throws for unknown agent types', async () => {
    const { AgentRunnerService } = await import('../services/agentRunner.service');
    const runner = AgentRunnerService.getInstance();
    await expect(
      runner.executeAgent({
        sessionId: TEST_SESSION,
        agentType: 'nonexistent-agent-type',
        input: { topic: 'test' },
      })
    ).rejects.toThrow(/unknown agent type/i);
  });
});
