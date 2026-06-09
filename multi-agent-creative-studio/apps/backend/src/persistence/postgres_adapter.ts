import { IPersistenceAdapter } from '../services/memory.service';
import { Pool } from 'pg';
import { PostgresConfig } from '../db/postgresStore';
import { Logger } from '../utils/logger';

/**
 * Real Postgres persistence adapter (production-ready).
 * This adapter implements IPersistenceAdapter and uses pg.Pool for DB access.
 */
export class PostgresAdapter implements IPersistenceAdapter {
  private pool?: Pool;
  constructor(private config?: PostgresConfig) {
    const conn = config?.connectionString || process.env.DATABASE_URL || '';
    if (conn) {
      this.pool = new Pool({ connectionString: conn });
      this.initSchema().catch((e) => {
        Logger.getLogger('PostgresAdapter').error('Failed to initialize DB schema', e);
      });
    }
  }

  async initSchema(): Promise<void> {
    if (!this.pool) return;
    const sql = `
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE TABLE IF NOT EXISTS state_store (
        id SERIAL PRIMARY KEY,
        collection_name TEXT NOT NULL,
        key TEXT NOT NULL,
        value JSONB,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
        UNIQUE (collection_name, key)
      );
    `;
    await this.pool.query(sql);
  }

  async initializeSession(sessionId: string): Promise<void> {
    if (!this.pool) return;
    await this.pool.query(
      `INSERT INTO state_store (collection_name, key, value, updated_at, created_at) VALUES ($1, $2, $3, NOW(), NOW()) ON CONFLICT (collection_name, key) DO NOTHING`,
      ['sessions', `session:${sessionId}`, JSON.stringify({})]
    );
  }

  async store(sessionId: string, key: string, value: any): Promise<void> {
    if (!this.pool) return;
    await this.pool.query(
      `INSERT INTO state_store (collection_name, key, value, updated_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (collection_name, key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      ['sessions', `${sessionId}:${key}`, value]
    );
  }

  async retrieve(sessionId: string, key: string): Promise<any> {
    if (!this.pool) return null;
    const res = await this.pool.query(`SELECT value FROM state_store WHERE collection_name = $1 AND key = $2`, ['sessions', `${sessionId}:${key}`]);
    return res.rows[0]?.value ?? null;
  }

  async getAll(sessionId: string): Promise<Record<string, any>> {
    if (!this.pool) return {};
    const res = await this.pool.query(`SELECT key, value FROM state_store WHERE collection_name = $1`, ['sessions']);
    const result: Record<string, any> = {};
    res.rows.forEach((r: any) => {
      result[r.key] = r.value;
    });
    return result;
  }


  async clear(sessionId: string): Promise<void> {
    if (!this.pool) return;
    await this.pool.query(`DELETE FROM state_store WHERE collection_name = $1`, ['sessions']);
  }

  async exists(sessionId: string): Promise<boolean> {
    if (!this.pool) return false;
    const res = await this.pool.query(`SELECT 1 FROM state_store WHERE collection_name = $1 AND key = $2`, ['sessions', `session:${sessionId}`]);
    return (res.rowCount ?? 0) > 0;
  }

  async pushContext(
    sessionId: string,
    agentName: string,
    context: Record<string, any>,
    agentType?: string,
  ): Promise<void> {
    const existing = await this.retrieve(sessionId, 'executionHistory');
    const arr = Array.isArray(existing) ? existing : [];
    arr.push({ agent: agentName, agentType, context, timestamp: new Date() });
    await this.store(sessionId, 'executionHistory', arr);
  }

  async getExecutionHistory(sessionId: string): Promise<any[]> {
    const hist = await this.retrieve(sessionId, 'executionHistory');
    return Array.isArray(hist) ? hist : [];
  }

  async getAllUserSessions(userId: string, pagination?: { page?: number; limit?: number }): Promise<{ sessions: any[]; total: number }> {
    if (!this.pool) return { sessions: [], total: 0 };
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 50;
      const offset = (page - 1) * limit;

      // Count total matching sessions
      const countRes = await this.pool.query(
        `SELECT COUNT(*) as cnt FROM state_store 
         WHERE collection_name = $1 AND key LIKE $2
         AND value->>'userId' = $3`,
        ['sessions', '%:sessionData', userId]
      );
      const total = parseInt(countRes.rows[0]?.cnt || '0', 10);

      // Get paginated session data
      const res = await this.pool.query(
        `SELECT value, updated_at FROM state_store 
         WHERE collection_name = $1 AND key LIKE $2
         AND value->>'userId' = $3
         ORDER BY updated_at DESC
         LIMIT $4 OFFSET $5`,
        ['sessions', '%:sessionData', userId, limit, offset]
      );

      const sessions: any[] = res.rows.map((row: any) => ({
        ...row.value,
        updatedAt: row.updated_at,
      }));

      return { sessions, total };
    } catch (err) {
      console.error('PostgreSQL getAllUserSessions error:', err);
      return { sessions: [], total: 0 };
    }
  }
}
