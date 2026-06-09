/**
 * Memory Service - Manages session memory and context (persistence-agnostic).
 * This refactor introduces a pluggable persistence layer to enable DB-backed stores in the future.
 */
import { Logger } from '../utils/logger';
import { config } from '../config';
import { LocalAdapter } from '../persistence/redis_adapter';
import { PostgresAdapter } from '../persistence/postgres_adapter';
import { SupabaseAdapter } from '../persistence/supabase_adapter';
import { FileAdapter } from '../persistence/file_adapter';
import { PersistenceConfig } from '../config';

export interface MemoryStore {
  sessionId: string;
  data: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Persistence interface (can be implemented by Redis/Postgres adapters in the future)
export interface IPersistenceAdapter {
  initializeSession(sessionId: string, userId?: string): Promise<void>;
  store(sessionId: string, key: string, value: any): Promise<void>;
  retrieve(sessionId: string, key: string): Promise<any>;
  getAll(sessionId: string): Promise<Record<string, any>>;
  clear(sessionId: string): Promise<void>;
  exists(sessionId: string): Promise<boolean>;
  pushContext(sessionId: string, agentName: string, context: Record<string, any>, agentType?: string): Promise<void>;
  getExecutionHistory(sessionId: string): Promise<any[]>;
  getAllUserSessions(userId: string, pagination?: { page?: number; limit?: number }): Promise<{ sessions: any[]; total: number }>;
}

// In-memory adapter (default for development)
class InMemoryAdapter implements IPersistenceAdapter {
  private stores: Map<string, MemoryStore> = new Map();
  private logger = Logger.getLogger('MemoryInMemoryAdapter');

  async initializeSession(sessionId: string, userId?: string): Promise<void> {
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

  async pushContext(sessionId: string, agentName: string, context: Record<string, any>, agentType?: string): Promise<void> {
    const executionHistory = (await this.retrieve(sessionId, 'executionHistory')) || [];
    executionHistory.push({
      agent: agentName,
      agentType,
      context,
      timestamp: new Date(),
    });
    await this.store(sessionId, 'executionHistory', executionHistory);
  }

  async getExecutionHistory(sessionId: string): Promise<any[]> {
    return (await this.retrieve(sessionId, 'executionHistory')) || [];
  }

  async getAllUserSessions(userId: string, pagination?: { page?: number; limit?: number }): Promise<{ sessions: any[]; total: number }> {
    // In-memory adapter: collect all session data entries, filter by userId
    const allSessions: any[] = [];
    this.stores.forEach((store) => {
      const sessionData = store.data.get('sessionData');
      if (sessionData && sessionData.userId === userId) {
        allSessions.push({
          ...sessionData,
          sessionId: store.sessionId,
          createdAt: store.createdAt,
          updatedAt: store.updatedAt,
        });
      }
    });
    allSessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    const total = allSessions.length;
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 50;
    const offset = (page - 1) * limit;
    
    return {
      sessions: allSessions.slice(offset, offset + limit),
      total,
    };
  }
}

export class MemoryService {
  private static instance: MemoryService;
  private storage: IPersistenceAdapter;
  private logger = Logger.getLogger('MemoryService');

  private constructor() {
    // By default, use Supabase or other configured DB adapters. File adapter is only for development.
    // Choose persistence mode from config (memory | redis | postgres | supabase)
    const persistenceConfig = config.persistence;
    const mode = persistenceConfig?.mode || 'supabase';
    this.logger.info(`Initializing MemoryService with mode: ${mode}`);

    if (mode === 'redis') {
      // Uses LocalAdapter (in-memory) for development. To use real Redis,
      // install ioredis and create a RedisAdapter that connects via TCP.
      this.storage = new LocalAdapter(persistenceConfig?.redisHost, persistenceConfig?.redisPort);
    } else if (mode === 'postgres') {
      this.storage = new PostgresAdapter({
        connectionString: `postgresql://${persistenceConfig?.postgresUser}:${persistenceConfig?.postgresPassword}@${persistenceConfig?.postgresHost}:${persistenceConfig?.postgresPort}/${persistenceConfig?.postgresDb}`,
      });
    } else if (mode === 'supabase') {
      this.storage = new SupabaseAdapter();
    } else if (mode === 'file') {
      this.storage = new FileAdapter();
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

  async initializeSession(sessionId: string, userId?: string): Promise<void> {
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

  async pushContext(sessionId: string, agentName: string, context: Record<string, any>, agentType?: string): Promise<void> {
    await this.storage.pushContext(sessionId, agentName, context, agentType);
  }

  async getExecutionHistory(sessionId: string): Promise<any[]> {
    return await this.storage.getExecutionHistory(sessionId);
  }

  async getAllUserSessions(userId: string, pagination?: { page?: number; limit?: number }): Promise<{ sessions: any[]; total: number }> {
    return await this.storage.getAllUserSessions(userId, pagination);
  }
}
