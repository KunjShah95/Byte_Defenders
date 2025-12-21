import { IPersistenceAdapter } from '../services/memory.service';

export class RedisAdapter implements IPersistenceAdapter {
  private cache: Map<string, any> = new Map();
  private prefix = 'mem0:';

  constructor(private host: string, private port: number) { }

  private pref(key: string): string {
    return `${this.prefix}${key}`;
  }

  async initializeSession(sessionId: string): Promise<void> {
    if (!this.cache.has(sessionId)) {
      this.cache.set(sessionId, { data: new Map<string, any>(), createdAt: new Date(), updatedAt: new Date() });
    }
  }

  async store(sessionId: string, key: string, value: any): Promise<void> {
    const s = this.cache.get(sessionId) ?? { data: new Map<string, any>() } as any;
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

  async pushContext(sessionId: string, agentName: string, context: Record<string, any>): Promise<void> {
    const s = this.cache.get(sessionId) ?? { data: new Map<string, any>() } as any;
    const arr = (s.data.get(this.pref('executionHistory')) as any[]) || [];
    arr.push({ agent: agentName, context, timestamp: new Date() });
    s.data.set(this.pref('executionHistory'), arr);
    this.cache.set(sessionId, s);
  }

  async getExecutionHistory(sessionId: string): Promise<any[]> {
    const s = this.cache.get(sessionId);
    return (s?.data?.get(this.pref('executionHistory')) as any[]) || [];
  }

  async getAllUserSessions(userId: string): Promise<any[]> {
    // Redis adapter doesn't support filtering by user
    // Return empty array - this is for development only
    return [];
  }
}
