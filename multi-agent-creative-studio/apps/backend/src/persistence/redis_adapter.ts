import { IPersistenceAdapter } from '../services/memory.service';

/**
 * Local in-memory adapter (was RedisAdapter, renamed for clarity).
 * Uses a plain Map for storage. Does NOT actually connect to Redis —
 * install ioredis and create a real RedisAdapter if you need Redis persistence.
 */
export class LocalAdapter implements IPersistenceAdapter {
  private cache: Map<string, any> = new Map();
  private userSessionIndex: Map<string, Set<string>> = new Map(); // userId → Set<sessionId>
  private prefix = 'mem0:';

  constructor(_host?: string, _port?: number) {
    // host/port accepted for backward compat but unused (local in-memory store)
  }

  private pref(key: string): string {
    return `${this.prefix}${key}`;
  }

  async initializeSession(sessionId: string, userId?: string): Promise<void> {
    if (!this.cache.has(sessionId)) {
      this.cache.set(sessionId, { data: new Map<string, any>(), createdAt: new Date(), updatedAt: new Date() });
    }
    if (userId) {
      if (!this.userSessionIndex.has(userId)) {
        this.userSessionIndex.set(userId, new Set());
      }
      this.userSessionIndex.get(userId)!.add(sessionId);
    }
  }

  async store(sessionId: string, key: string, value: any): Promise<void> {
    const s = this.cache.get(sessionId) ?? { data: new Map<string, any>() };
    if (!s.data) s.data = new Map<string, any>();
    s.data.set(this.pref(key), value);
    this.cache.set(sessionId, s);
  }

  async retrieve(sessionId: string, key: string): Promise<any> {
    const s = this.cache.get(sessionId);
    return s?.data?.get(this.pref(key));
  }

  async getAll(sessionId: string): Promise<Record<string, any>> {
    const s = this.cache.get(sessionId);
    const result: Record<string, any> = {};
    if (!s?.data) return result;
    s.data.forEach((v: any, k: string) => {
      if (k.startsWith(this.prefix)) {
        result[k.substring(this.prefix.length)] = v;
      } else {
        result[k] = v;
      }
    });
    return result;
  }

  async clear(sessionId: string): Promise<void> {
    this.cache.delete(sessionId);
  }

  async exists(sessionId: string): Promise<boolean> {
    return this.cache.has(sessionId);
  }

  async pushContext(sessionId: string, agentName: string, context: Record<string, any>, agentType?: string): Promise<void> {
    const s = this.cache.get(sessionId) ?? { data: new Map<string, any>() };
    const arr = (s.data.get(this.pref('executionHistory')) as any[]) || [];
    arr.push({ agent: agentName, agentType, context, timestamp: new Date() });
    s.data.set(this.pref('executionHistory'), arr);
    this.cache.set(sessionId, s);
  }

  async getExecutionHistory(sessionId: string): Promise<any[]> {
    const s = this.cache.get(sessionId);
    return (s?.data?.get(this.pref('executionHistory')) as any[]) || [];
  }

  async getAllUserSessions(userId: string, pagination?: { page?: number; limit?: number }): Promise<{ sessions: any[]; total: number }> {
    const sessionIds = this.userSessionIndex.get(userId);
    if (!sessionIds || sessionIds.size === 0) {
      return { sessions: [], total: 0 };
    }

    const sessions: any[] = [];
    for (const sessionId of sessionIds) {
      const s = this.cache.get(sessionId);
      if (s) {
        const sessionData = s.data.get(this.pref('sessionData'));
        if (sessionData) {
          sessions.push({
            ...sessionData,
            sessionId,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
          });
        }
      }
    }

    sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const total = sessions.length;
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 50;
    const offset = (page - 1) * limit;

    return {
      sessions: sessions.slice(offset, offset + limit),
      total,
    };
  }
}
