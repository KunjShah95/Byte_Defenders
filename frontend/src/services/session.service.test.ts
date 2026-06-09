/**
 * sessionService unit tests.
 *
 * Tests the pure data-mapping functions that transform backend API responses
 * into frontend Session/Agent models. These don't need DOM or real API calls.
 */
import { describe, it, expect } from 'vitest';
import { sessionService } from './session.service';
import { SessionInput } from '@/types/session.types';
import { ExecutionHistoryEntry, AgentExecutionTrace } from '@/types/agent.types';

const defaultInput: SessionInput = {
  prompt: 'Test prompt for a sustainable business',
  useCase: 'startup',
  explainabilityMode: false,
};

function makeHistoryEntry(overrides: Partial<ExecutionHistoryEntry> = {}): ExecutionHistoryEntry {
  return {
    agent: 'Idea Generator',
    agentType: 'idea',
    context: {
      output: {
        text: 'This is the generated idea text that is detailed and comprehensive.',
        metadata: { score: 85 },
      },
      reasoning: 'Generated based on market analysis',
      duration: 1234,
    },
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

function makeTrace(overrides: Partial<AgentExecutionTrace> = {}): AgentExecutionTrace {
  return {
    agentName: 'Idea Generator',
    agentType: 'idea',
    input: { topic: 'test' },
    output: { text: 'Explainability output text' },
    reasoning: 'Step-by-step reasoning',
    duration: 567,
    ...overrides,
  };
}

describe('mapBackendSession', () => {
  it('maps backend session data to frontend Session model', () => {
    const backend = {
      id: 'session_abc123',
      status: 'completed',
      description: 'My test session',
      metadata: { useCase: 'startup', explainabilityMode: false },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T01:00:00.000Z',
    };

    // mapBackendSession uses the provided input as-is — test must construct it
    const inputFromBackend: SessionInput = {
      prompt: backend.description || '',
      useCase: (backend.metadata?.useCase as string | undefined) || 'startup',
      explainabilityMode: backend.metadata?.explainabilityMode || false,
    };
    const session = sessionService.mapBackendSession(backend, inputFromBackend);
    expect(session.id).toBe('session_abc123');
    expect(session.status).toBe('completed');
    expect(session.input.prompt).toBe('My test session');
    expect(session.createdAt).toBe('2024-01-01T00:00:00.000Z');
  });

  it('maps status correctly', () => {
    const statusCases = [
      { backend: 'active', expected: 'pending' },
      { backend: 'pending', expected: 'pending' },
      { backend: 'completed', expected: 'completed' },
      { backend: 'failed', expected: 'failed' },
      { backend: 'running', expected: 'running' },
      { backend: 'unknown', expected: 'pending' },
    ];

    for (const { backend, expected } of statusCases) {
      const session = sessionService.mapBackendSession(
        { id: 's1', status: backend, createdAt: '', updatedAt: '' },
        defaultInput,
      );
      expect(session.status).toBe(expected);
    }
  });

  it('handles sessionId field as fallback for id', () => {
    const session = sessionService.mapBackendSession(
      { sessionId: 'fallback-id', status: 'active', createdAt: '', updatedAt: '' },
      defaultInput,
    );
    expect(session.id).toBe('fallback-id');
  });

  it('handles missing dates gracefully', () => {
    const session = sessionService.mapBackendSession(
      { id: 's1', status: 'active' },
      defaultInput,
    );
    expect(session.createdAt).toBeTruthy();
    expect(session.updatedAt).toBeTruthy();
  });
});

describe('mapExecutionHistoryToAgents', () => {
  it('maps execution history entries to agents', () => {
    const entries = [
      makeHistoryEntry({ agent: 'Idea Generator', agentType: 'idea' }),
      makeHistoryEntry({
        agent: 'Critic',
        agentType: 'critic',
        context: { output: { text: 'Critique text', metadata: {} }, reasoning: 'Analysis', duration: 800 },
      }),
    ];

    const agents = sessionService.mapExecutionHistoryToAgents(entries);
    expect(agents.length).toBe(2);
    expect(agents[0].type).toBe('idea');
    expect(agents[0].name).toBe('Idea Generator');
    expect(agents[0].output?.content).toContain('generated idea text');
    expect(agents[0].duration).toBe(1234);
    expect(agents[1].type).toBe('critic');
    expect(agents[1].output?.content).toContain('Critique text');
  });

  it('handles flat output shape (non-context)', () => {
    const entry = makeHistoryEntry({
      context: {},
      output: { text: 'Flat output text' },
    });

    const agents = sessionService.mapExecutionHistoryToAgents([entry]);
    expect(agents[0].output?.content).toContain('Flat output text');
  });

  it('handles empty entries gracefully', () => {
    const agents = sessionService.mapExecutionHistoryToAgents([]);
    expect(agents).toEqual([]);
  });

  it('extracts score from output metadata', () => {
    const entry = makeHistoryEntry({
      context: {
        output: { text: 'Scored idea', metadata: { score: 92 } },
      },
    });

    const agents = sessionService.mapExecutionHistoryToAgents([entry]);
    expect(agents[0].output?.score).toBe(92);
  });
});

describe('mapAgentExecutions', () => {
  it('maps execution traces to agents', () => {
    const traces = [
      makeTrace({ agentName: 'Refiner', agentType: 'refiner', output: { text: 'Refined output', metadata: { score: 78 } } }),
    ];

    const agents = sessionService.mapAgentExecutions(traces);
    expect(agents.length).toBe(1);
    expect(agents[0].type).toBe('refiner');
    expect(agents[0].name).toBe('Refiner');
    expect(agents[0].output?.content).toContain('Refined output');
    expect(agents[0].output?.score).toBe(78);
  });

  it('handles agentName slug generation for id', () => {
    const traces = [makeTrace({ agentName: 'Idea Generator' })];
    const agents = sessionService.mapAgentExecutions(traces);
    expect(agents[0].id).toBe('idea-generator');
  });

  it('handles empty traces', () => {
    const agents = sessionService.mapAgentExecutions([]);
    expect(agents).toEqual([]);
  });
});

describe('mapWorkflowResponseAgents', () => {
  it('builds agents from response keys', () => {
    const data = {
      initialIdea: { output: { text: 'Initial idea text' } },
      criticisms: [{ output: { text: 'Criticism 1' } }],
      refinedIdea: { output: { text: 'Refined idea text' } },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agents = sessionService.mapWorkflowResponseAgents(data as any);
    // Note: 'criticisms' is an array, which gets cast as object but has no .output → skipped
    expect(agents.length).toBe(2);
    expect(agents[0].type).toBe('idea');
    expect(agents[0].name).toBe('Initial Idea');
    expect(agents[1].type).toBe('refiner');
  });

  it('skips agents with no output text', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agents = sessionService.mapWorkflowResponseAgents({} as any);
    expect(agents).toEqual([]);
  });
});

describe('mapBackendResult', () => {
  it('computes average score from execution history', () => {
    const data = {
      initialIdea: { output: { text: 'Idea' } },
      refinedIdea: { output: { text: 'Refined' } },
      executionHistory: [
        makeHistoryEntry({ context: { output: { text: 'a', metadata: { score: 80 } } } }),
        makeHistoryEntry({ context: { output: { text: 'b', metadata: { score: 90 } } } }),
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = sessionService.mapBackendResult(data as any);
    expect(result.avgScore).toBe(85);
    expect(result.overview).toBe('Refined');
  });

  it('falls back to initialIdea when refinedIdea is missing', () => {
    const data = {
      initialIdea: { output: { text: 'Only idea exists' } },
      executionHistory: [],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = sessionService.mapBackendResult(data as any);
    expect(result.overview).toContain('Only idea exists');
  });

  it('returns 0 score when no scores available', () => {
    const data = {
      initialIdea: { output: { text: 'Idea' } },
      executionHistory: [],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = sessionService.mapBackendResult(data as any);
    expect(result.avgScore).toBe(0);
  });
});
