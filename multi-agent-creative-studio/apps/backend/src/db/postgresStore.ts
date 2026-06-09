export interface PostgresConfig {
  connectionString?: string;
}

/**
 * @deprecated Use PostgresAdapter from '../persistence/postgres_adapter' instead.
 * This legacy shim has been replaced by a full implementation using pg.Pool.
 *
 * PostgresAdapter is a drop-in replacement that implements IPersistenceAdapter
 * with real PostgreSQL persistence via the pg module.
 */
export class PostgresStore {
  private connectionString: string;

  /** @deprecated */
  constructor(config?: PostgresConfig) {
    this.connectionString = config?.connectionString || '';
    console.warn('[DEPRECATED] PostgresStore is deprecated. Use PostgresAdapter from persistence/ instead.');
  }

  /** @deprecated */
  async init(): Promise<void> {
    console.warn('[DEPRECATED] PostgresStore.init() is a no-op. Use PostgresAdapter from persistence/postgres_adapter.');
  }

  /** @deprecated */
  async set(collection: string, key: string, value: any): Promise<void> {
    console.warn('[DEPRECATED] PostgresStore.set() is a no-op. Use PostgresAdapter from persistence/postgres_adapter.');
  }

  /** @deprecated */
  async get(collection: string, key: string): Promise<any> {
    console.warn('[DEPRECATED] PostgresStore.get() is a no-op. Use PostgresAdapter from persistence/postgres_adapter.');
    return undefined;
  }

  /** @deprecated */
  async getAll(collection: string): Promise<any[]> {
    console.warn('[DEPRECATED] PostgresStore.getAll() is a no-op. Use PostgresAdapter from persistence/postgres_adapter.');
    return []; 
  }

  /** @deprecated */
  async delete(collection: string, key: string): Promise<void> {
    console.warn('[DEPRECATED] PostgresStore.delete() is a no-op. Use PostgresAdapter from persistence/postgres_adapter.');
  }
}

export default PostgresStore;
