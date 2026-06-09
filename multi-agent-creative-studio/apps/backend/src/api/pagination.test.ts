import { describe, it, expect } from 'vitest';
import { LocalAdapter } from '../persistence/redis_adapter';

describe('Pagination - LocalAdapter', () => {
  it('returns empty result for unknown user', async () => {
    const adapter = new LocalAdapter();
    const result = await adapter.getAllUserSessions('nonexistent');
    expect(result.sessions).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('returns sessions for a user after creation', async () => {
    const adapter = new LocalAdapter();

    await adapter.initializeSession('session-1', 'user-1');
    await adapter.initializeSession('session-2', 'user-1');
    await adapter.initializeSession('session-3', 'user-2'); // different user

    await adapter.store('session-1', 'sessionData', { title: 'Session 1', userId: 'user-1' });
    await adapter.store('session-2', 'sessionData', { title: 'Session 2', userId: 'user-1' });
    await adapter.store('session-3', 'sessionData', { title: 'Session 3', userId: 'user-2' });

    const result = await adapter.getAllUserSessions('user-1');
    expect(result.total).toBe(2);
    expect(result.sessions.length).toBe(2);
    expect(result.sessions.map((s: any) => s.title).sort()).toEqual(['Session 1', 'Session 2']);
  });

  it('respects pagination params', async () => {
    const adapter = new LocalAdapter();

    for (let i = 0; i < 10; i++) {
      const sid = `session-pag-${i}`;
      await adapter.initializeSession(sid, 'user-pag');
      await adapter.store(sid, 'sessionData', { title: `Session ${i}`, userId: 'user-pag' });
    }

    // Page 1, limit 3
    const page1 = await adapter.getAllUserSessions('user-pag', { page: 1, limit: 3 });
    expect(page1.total).toBe(10);
    expect(page1.sessions.length).toBe(3);

    // Page 2, limit 3
    const page2 = await adapter.getAllUserSessions('user-pag', { page: 2, limit: 3 });
    expect(page2.sessions.length).toBe(3);

    // Page 4 (last page, only 1 result)
    const page4 = await adapter.getAllUserSessions('user-pag', { page: 4, limit: 3 });
    expect(page4.sessions.length).toBe(1);
  });

  it('handles empty page gracefully', async () => {
    const adapter = new LocalAdapter();
    await adapter.initializeSession('session-only', 'user-only');
    await adapter.store('session-only', 'sessionData', { title: 'Only', userId: 'user-only' });

    const result = await adapter.getAllUserSessions('user-only', { page: 99, limit: 20 });
    expect(result.sessions.length).toBe(0);
    expect(result.total).toBe(1);
  });
});
