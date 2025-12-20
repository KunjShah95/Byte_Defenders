/**
 * Memory Service - Manages session memory and context (persistence-agnostic).
 * This refactor introduces a pluggable persistence layer to enable DB-backed stores in the future.
 */
import { Logger } from '../utils/logger';
import { config } from '../config';
import { RedisAdapter } from '../persistence/redis_adapter';
import { PostgresAdapter } from '../persistence/postgres_adapter';
import { SupabaseAdapter } from '../persistence/supabase_adapter';

export interface MemoryStore {
  sessionId: string;
  data: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Persistence interface
export interface IPersistenceAdapter {
  initializeSession(sessionId: string): Promise<void>;
  store(sessionId: string, key: string, value: any): Promise<void>;
  retrieve(sessionId: string, key: string): Promise<any>;
  getAll(sessionId: string): Promise<Record<string, any>>;
  clear(sessionId: string): Promise<void>;
  exists(sessionId: string): Promise<boolean>;
  pushContext(sessionId: string, agentName: string, context: Record<string, any>): Promise<void>;
  getExecutionHistory(sessionId: string): Promise<any[]>;
}

// In-memory adapter (default for development)
class InMemoryAdapter implements IPersistenceAdapter {
  private stores: Map<string, MemoryStore> = new Map();
  private logger = Logger.getLogger('MemoryInMemoryAdapter');

  async initializeSession(sessionId: string): Promise<void> {
    if (!this.stores.has(sessionId)) {
      this.stores.set(sessionId, {
        sessionId,
        data: new Map(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      this.logger.info(`Memory initialized for session: ${sessionId}`);
    }
  }

  async store(sessionId: string, key: string, value: any): Promise<void> {
    const store = this.stores.get(sessionId);
    if (!store) {
      await this.initializeSession(sessionId);
    }
    const updatedStore = this.stores.get(sessionId)!;
    updatedStore.data.set(key, value);
    updatedStore.updatedAt = new Date();
  }

  async retrieve(sessionId: string, key: string): Promise<any> {
    const store = this.stores.get(sessionId);
    return store?.data.get(key);
  }

  async getAll(sessionId: string): Promise<Record<string, any>> {
    const store = this.stores.get(sessionId);
    if (!store) return {};
    const result: Record<string, any> = {};
    store.data.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  async clear(sessionId: string): Promise<void> {
    this.stores.delete(sessionId);
    this.logger.info(`Memory cleared for session: ${sessionId}`);
  }

  async exists(sessionId: string): Promise<boolean> {
    return this.stores.has(sessionId);
  }

  async pushContext(sessionId: string, agentName: string, context: Record<string, any>): Promise<void> {
    const executionHistory = (await this.retrieve(sessionId, 'executionHistory')) || [];
    executionHistory.push({
      agent: agentName,
      context,
      timestamp: new Date(),
    });
    await this.store(sessionId, 'executionHistory', executionHistory);
  }

  async getExecutionHistory(sessionId: string): Promise<any[]> {
    return (await this.retrieve(sessionId, 'executionHistory')) || [];
  }
}

export class MemoryService {
  private static instance: MemoryService;
  private storage: IPersistenceAdapter;
  private logger = Logger.getLogger('MemoryService');

  private constructor() {
    const mode = (config && (config as any).persistence?.mode) || 'memory';
    if (mode === 'redis') {
      this.storage = new RedisAdapter((config as any).persistence?.redisHost || 'localhost', (config as any).persistence?.redisPort || 6379);
    } else if (mode === 'postgres') {
      this.storage = new PostgresAdapter((config as any).persistence);
    } else if (mode === 'supabase') {
      this.storage = new SupabaseAdapter();
    } else {
      this.storage = new InMemoryAdapter();
    }
  }

  static getInstance(): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService();
    }
    return MemoryService.instance;
  }

  async initializeSession(sessionId: string): Promise<void> {
    await this.storage.initializeSession(sessionId);
  }

  async store(sessionId: string, key: string, value: any): Promise<void> {
    await this.storage.store(sessionId, key, value);
  }

  async retrieve(sessionId: string, key: string): Promise<any> {
    return await this.storage.retrieve(sessionId, key);
  }

  async getAll(sessionId: string): Promise<Record<string, any>> {
    return await this.storage.getAll(sessionId);
  }

  async clear(sessionId: string): Promise<void> {
    await this.storage.clear(sessionId);
  }

  async exists(sessionId: string): Promise<boolean> {
    return await this.storage.exists(sessionId);
  }

  async pushContext(sessionId: string, agentName: string, context: Record<string, any>): Promise<void> {
    await this.storage.pushContext(sessionId, agentName, context);
  }

  async getExecutionHistory(sessionId: string): Promise<any[]> {
    return await this.storage.getExecutionHistory(sessionId);
  }
}

