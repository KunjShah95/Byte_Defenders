export interface PostgresConfig {
  connectionString?: string;
}

/**
 * Minimal Postgres store shim for development.
 * In a future iteration, this can wrap a real pg.Pool client and implement actual persistence.
 */
export class PostgresStore {
  private connectionString: string;

  constructor(config?: PostgresConfig) {
    this.connectionString = config?.connectionString || '';
  }

  async init(): Promise<void> {
    // TODO: initialize DB schema if a real Postgres instance is wired
  }

  async set(collection: string, key: string, value: any): Promise<void> {
    // No-op for now; intended to persist to Postgres
  }

  async get(collection: string, key: string): Promise<any> {
    // No-op placeholder
    return undefined;
  }

  async getAll(collection: string): Promise<any[]> {
    // No-op placeholder
    return []; 
  }

  async delete(collection: string, key: string): Promise<void> {
    // No-op placeholder
  }
}

export default PostgresStore;
