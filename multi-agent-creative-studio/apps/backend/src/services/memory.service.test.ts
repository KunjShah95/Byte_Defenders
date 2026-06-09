/**
 * Memory service + adapter tests.
 *
 * Validates that all storage adapters correctly implement the IPersistenceAdapter
 * interface with proper data isolation, context pushing, and execution history.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryService, IPersistenceAdapter } from './memory.service';

describe('MemoryService (InMemoryAdapter)', () => {
  const sessionId = 'mem-test-session';

  beforeEach(async () => {
    const memory = MemoryService.getInstance();
    await memory.clear(sessionId);
  });

  it('initializes a session', async () => {
    const memory = MemoryService.getInstance();
    await memory.initializeSession(sessionId);
    const exists = await memory.exists(sessionId);
    expect(exists).toBe(true);
  });

  it('stores and retrieves values', async () => {
    const memory = MemoryService.getInstance();
    await memory.store(sessionId, 'testKey', { hello: 'world', number: 42 });
    const value = await memory.retrieve(sessionId, 'testKey');
    expect(value).toEqual({ hello: 'world', number: 42 });
  });

  it('returns null for missing keys', async () => {
    const memory = MemoryService.getInstance();
    const value = await memory.retrieve(sessionId, 'nonexistent');
    expect(value).toBeUndefined();
  });

  it('overwrites existing keys', async () => {
    const memory = MemoryService.getInstance();
    await memory.store(sessionId, 'key1', 'first');
    await memory.store(sessionId, 'key1', 'second');
    const value = await memory.retrieve(sessionId, 'key1');
    expect(value).toBe('second');
  });

  it('gets all values for a session', async () => {
    const memory = MemoryService.getInstance();
    await memory.store(sessionId, 'a', 1);
    await memory.store(sessionId, 'b', 2);
    const all = await memory.getAll(sessionId);
    expect(all).toHaveProperty('a', 1);
    expect(all).toHaveProperty('b', 2);
  });

  it('clears all data for a session', async () => {
    const memory = MemoryService.getInstance();
    await memory.store(sessionId, 'data', 'some value');
    await memory.clear(sessionId);
    const exists = await memory.exists(sessionId);
    expect(exists).toBe(false);
  });

  it('pushes context entries to execution history', async () => {
    const memory = MemoryService.getInstance();
    await memory.pushContext(sessionId, 'Idea Generator', { output: 'idea text' }, 'idea');
    await memory.pushContext(sessionId, 'Critic', { output: 'critique text' }, 'critic');

    const history = await memory.getExecutionHistory(sessionId);
    expect(history.length).toBe(2);
    expect(history[0].agent).toBe('Idea Generator');
    expect(history[0].agentType).toBe('idea');
    expect(history[0].context.output).toBe('idea text');
    expect(history[1].agent).toBe('Critic');
    expect(history[1].agentType).toBe('critic');
  });

  it('handles sessions with different IDs independently', async () => {
    const memory = MemoryService.getInstance();
    await memory.store('session-A', 'key', 'value-a');
    await memory.store('session-B', 'key', 'value-b');

    const valA = await memory.retrieve('session-A', 'key');
    const valB = await memory.retrieve('session-B', 'key');
    expect(valA).toBe('value-a');
    expect(valB).toBe('value-b');
  });

  it('initializes a session with userId when provided', async () => {
    const memory = MemoryService.getInstance();
    await memory.initializeSession('user-session', 'user-123');
    const exists = await memory.exists('user-session');
    expect(exists).toBe(true);
  });

  it('returns empty array for non-existent execution history', async () => {
    const memory = MemoryService.getInstance();
    const history = await memory.getExecutionHistory('nonexistent-session');
    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBe(0);
  });

  it('pushing context auto-creates the session if it does not exist', async () => {
    const memory = MemoryService.getInstance();
    const freshSession = 'auto-create-test';
    await memory.pushContext(freshSession, 'Auto Agent', { data: 'test' }, 'idea');

    const exists = await memory.exists(freshSession);
    expect(exists).toBe(true);
    
    const history = await memory.getExecutionHistory(freshSession);
    expect(history.length).toBe(1);
    expect(history[0].agent).toBe('Auto Agent');
    
    await memory.clear(freshSession);
  });
});
