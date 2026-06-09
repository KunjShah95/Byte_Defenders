import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies before importing CreativeWorkflow
vi.mock('../services/memory.service', () => ({
  MemoryService: {
    getInstance: () => ({
      initializeSession: vi.fn().mockResolvedValue(undefined),
      store: vi.fn().mockResolvedValue(undefined),
      retrieve: vi.fn().mockResolvedValue({ status: 'active', progress: 0, updatedAt: new Date() }),
      getExecutionHistory: vi.fn().mockResolvedValue([]),
    }),
  },
}));

vi.mock('../events/eventBus', () => ({
  EventBus: {
    getInstance: () => ({
      publish: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn().mockReturnValue(vi.fn()),
    }),
  },
}));

vi.mock('../services/multiAgentOrchestrator.service', () => ({
  MultiAgentOrchestrator: {
    getInstance: vi.fn().mockReturnValue({
      runSequential: vi.fn().mockResolvedValue([
        {
          agentType: 'idea',
          agentName: 'Idea Generator',
          output: { text: 'Idea output' },
          status: 'completed',
          duration: 100,
        },
        {
          agentType: 'critic',
          agentName: 'Critic',
          output: { text: 'Critique output' },
          status: 'completed',
          duration: 50,
        },
        {
          agentType: 'refiner',
          agentName: 'Refiner',
          output: { text: 'Refined output' },
          status: 'completed',
          duration: 75,
        },
      ]),
    }),
  },
}));

import { CreativeWorkflow } from './creative.workflow';

describe('CreativeWorkflow', () => {
  let workflow: CreativeWorkflow;

  beforeEach(() => {
    workflow = new CreativeWorkflow();
  });

  it('executes a basic quick process', async () => {
    const result = await workflow.quickProcess('session-test', 'test topic');

    expect(result).toBeDefined();
    expect(result.sessionId).toBe('session-test');
    expect(result.initialIdea).toBeDefined();
    expect(result.criticisms).toBeDefined();
    expect(result.refinedIdea).toBeDefined();
    expect(result.totalDuration).toBeGreaterThanOrEqual(0);
  });

  it('executes a full process with all agents', async () => {
    const result = await workflow.fullProcess('session-full', {
      topic: 'complex topic',
      audience: 'developers',
    });

    expect(result).toBeDefined();
    expect(result.sessionId).toBe('session-full');
  });

  it('builds agent pipeline with correct task count', () => {
    const pipeline = (workflow as any).buildAgentPipeline('test-id', {
      topic: 'test',
      includeResearch: true,
      includeStrategy: true,
      includePresentation: true,
      includeQualityAssurance: true,
    });

    expect(Array.isArray(pipeline)).toBe(true);
    // research + strategy + idea + critique + refinement + QA + presentation = 7
    expect(pipeline.length).toBe(7);
    // Verify order: research first, presentation last
    expect(pipeline[0].agentType).toBe('researcher');
    expect(pipeline[pipeline.length - 1].agentType).toBe('presenter');
  });

  it('builds minimal pipeline without optional agents', () => {
    const pipeline = (workflow as any).buildAgentPipeline('test-id', {
      topic: 'test',
      includeResearch: false,
      includeStrategy: false,
      includePresentation: false,
      includeQualityAssurance: false,
    });

    // idea + critique + refinement = 3
    expect(pipeline.length).toBe(3);
    expect(pipeline.map((t: any) => t.agentType)).toEqual(['idea', 'critic', 'refiner']);
  });
});
