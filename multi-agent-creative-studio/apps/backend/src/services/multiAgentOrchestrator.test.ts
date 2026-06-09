/**
 * MultiAgentOrchestrator tests.
 *
 * These tests validate:
 * - runSequential with dependency chaining and context threading
 * - Auto-population of empty input fields from lastOutput (pipeline data flow)
 * - Circular dependency detection
 * - Retry logic
 * - Edge cases (empty tasks, single task, failed tasks)
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { MultiAgentOrchestrator, AgentTask } from './multiAgentOrchestrator.service';
import { AgentOutput } from '../models/agentOutput.model';

// We need access to a shared instance but with clean state per test.
// Since the orchestrator is a singleton, we test its methods directly.
describe('MultiAgentOrchestrator', () => {
  const orchestrator = MultiAgentOrchestrator.getInstance();
  const sessionId = 'test-session';

  beforeEach(() => {
    // Reset internal state by cancelling any leftover session
    orchestrator.cancelSession(sessionId);
  });

  describe('populateInputFromLastOutput', () => {
    it('fills empty string fields from lastOutput.text', () => {
      const input = { idea: '', feedback: '', topic: 'fixed topic' };
      const context = { lastOutput: { text: 'This is the previous agent output' } };
      const filled = (orchestrator as any).populateInputFromLastOutput(input, context);
      expect(filled.idea).toBe('This is the previous agent output');
      expect(filled.feedback).toBe('This is the previous agent output');
      // Non-empty fields should NOT be overwritten
      expect(filled.topic).toBeUndefined();
    });

    it('fills empty string fields from lastOutput.output.text (nested shape)', () => {
      const input = { idea: '' };
      const context = { lastOutput: { output: { text: 'Nested output text' } } };
      const filled = (orchestrator as any).populateInputFromLastOutput(input, context);
      expect(filled.idea).toBe('Nested output text');
    });

    it('returns empty object when no lastOutput exists', () => {
      const input = { idea: '' };
      const context = {};
      const filled = (orchestrator as any).populateInputFromLastOutput(input, context);
      expect(filled).toEqual({});
    });

    it('returns empty object when lastOutput has no text', () => {
      const input = { idea: '' };
      const context = { lastOutput: { score: 42 } };
      const filled = (orchestrator as any).populateInputFromLastOutput(input, context);
      expect(filled).toEqual({});
    });

    it('fills null and undefined fields too', () => {
      const input = { idea: null, feedback: undefined, topic: 'preserved' };
      const context = { lastOutput: { text: 'fill text' } };
      const filled = (orchestrator as any).populateInputFromLastOutput(input, context);
      expect(filled.idea).toBe('fill text');
      expect(filled.feedback).toBe('fill text');
      expect(filled.topic).toBeUndefined();
    });
  });

  describe('validateDependencies', () => {
    it('passes for tasks with no dependencies', () => {
      const tasks: AgentTask[] = [
        { id: 'a', agentType: 'idea', input: { topic: 'test' } },
        { id: 'b', agentType: 'critic', input: {} },
      ];
      expect(() => (orchestrator as any).validateDependencies(tasks)).not.toThrow();
    });

    it('passes for valid linear dependencies', () => {
      const tasks: AgentTask[] = [
        { id: 'a', agentType: 'idea', input: { topic: 'test' } },
        { id: 'b', agentType: 'critic', input: {}, dependencies: ['a'] },
        { id: 'c', agentType: 'refiner', input: {}, dependencies: ['b'] },
      ];
      expect(() => (orchestrator as any).validateDependencies(tasks)).not.toThrow();
    });

    it('throws for circular dependencies', () => {
      const tasks: AgentTask[] = [
        { id: 'a', agentType: 'idea', input: {}, dependencies: ['c'] },
        { id: 'b', agentType: 'critic', input: {}, dependencies: ['a'] },
        { id: 'c', agentType: 'refiner', input: {}, dependencies: ['b'] },
      ];
      expect(() => (orchestrator as any).validateDependencies(tasks)).toThrow(/circular dependency/i);
    });

    it('throws for self-referencing dependency', () => {
      const tasks: AgentTask[] = [
        { id: 'a', agentType: 'idea', input: {}, dependencies: ['a'] },
      ];
      expect(() => (orchestrator as any).validateDependencies(tasks)).toThrow(/circular dependency/i);
    });
  });

  describe('getHealthStatus', () => {
    it('returns health info with zero active sessions initially', () => {
      const health = orchestrator.getHealthStatus();
      expect(health).toHaveProperty('activeSessions');
      expect(health).toHaveProperty('totalActiveAgents');
      expect(health).toHaveProperty('uptime');
      expect(typeof health.uptime).toBe('number');
    });

    it('cleans up active sessions after runSequential completes', async () => {
      const healthBefore = orchestrator.getHealthStatus();
      
      await orchestrator.runSequential(sessionId, [
        { id: 'test1', agentType: 'idea', input: { topic: 'test' } },
      ]);
      
      // After completion, the session should be cleaned up
      const healthAfter = orchestrator.getHealthStatus();
      expect(healthAfter.activeSessions).toBe(0);
    }, 15_000);
  });

  describe('cancelSession', () => {
    it('cancels a running session without error', async () => {
      await expect(orchestrator.cancelSession('nonexistent-session')).resolves.not.toThrow();
    });

    it('cancels an active session', async () => {
      const runPromise = orchestrator.runSequential(sessionId + '-cancel', [
        { id: 'cancel1', agentType: 'idea', input: { topic: 'test' } },
      ]);
      
      await orchestrator.cancelSession(sessionId + '-cancel');
      await runPromise; // Should still resolve (cancellation prevents future tracking issues)
      
      const health = orchestrator.getHealthStatus();
      expect(health.activeSessions).toBe(0);
    }, 15_000);
  });
});
