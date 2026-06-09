import { IPersistenceAdapter } from '../services/memory.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Logger } from '../utils/logger';

export class SupabaseAdapter implements IPersistenceAdapter {
  private client: SupabaseClient | null = null;
  private logger = Logger.getLogger('SupabaseAdapter');

  constructor() {
    const url = process.env.SUPABASE_URL;
    // Use SERVICE_ROLE_KEY for backend operations to bypass RLS policies
    // ANON_KEY respects RLS, which causes issues for backend operations
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
    if (url && serviceRoleKey) {
      this.client = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }
  }

  async initializeSession(sessionId: string): Promise<void> {
    if (!this.client) {
      this.logger.warn('Supabase client not initialized');
      return;
    }
    // Store as JSONB object, not stringified
    const { error } = await this.client.from('state_store').upsert([{ collection_name: 'sessions', key: `session:${sessionId}`, value: {} }]);
    if (error) {
      this.logger.error('Supabase initializeSession error:', { message: error.message });
    }
  }

  async store(sessionId: string, key: string, value: any): Promise<void> {
    if (!this.client) {
      this.logger.warn('Supabase client not initialized');
      return;
    }
    const { error } = await this.client.from('state_store').upsert([{ collection_name: 'sessions', key: `${sessionId}:${key}`, value }]);
    if (error) {
      this.logger.error('Supabase store error:', { message: error.message });
    }
  }

  async retrieve(sessionId: string, key: string): Promise<any> {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('state_store')
        .select('value')
        .eq('collection_name', 'sessions')
        .eq('key', `${sessionId}:${key}`)
        .maybeSingle();

      if (error) {
        this.logger.error('Supabase retrieve error:', { message: error.message });
        return null;
      }
      return data?.value ?? null;
    } catch (err) {
      this.logger.error('Unexpected Supabase retrieve error:', { error: String(err) });
      return null;
    }
  }

  async getAll(sessionId: string): Promise<Record<string, any>> {
    if (!this.client) return {};
    const { data, error } = await this.client
      .from('state_store')
      .select('key, value')
      .eq('collection_name', 'sessions')
      .like('key', `${sessionId}:%`);

    if (error) {
      this.logger.error('Supabase getAll error:', { message: error.message });
      return {};
    }
    if (!data) return {};
    const result: Record<string, any> = {};
    (data as any[]).forEach((row) => {
      const shortKey = row.key.substring(sessionId.length + 1);
      result[shortKey] = row.value;
    });
    return result;
  }

  async clear(sessionId: string): Promise<void> {
    if (!this.client) return;
    const { error } = await this.client
      .from('state_store')
      .delete()
      .eq('collection_name', 'sessions')
      .or(`key.eq.session:${sessionId},key.like.${sessionId}:%`);

    if (error) {
      this.logger.error('Supabase clear error:', { message: error.message });
    }
  }

  async exists(sessionId: string): Promise<boolean> {
    if (!this.client) return false;
    const { count, error } = await this.client.from('state_store').select('1', { count: 'exact' }).eq('collection_name', 'sessions').eq('key', `session:${sessionId}`);
    if (error) {
      this.logger.error('Supabase exists error:', { message: error.message });
      return false;
    }
    return (count ?? 0) > 0;
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
    if (!this.client) return { sessions: [], total: 0 };
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Get total count first
      const { count } = await this.client
        .from('state_store')
        .select('*', { count: 'exact', head: true })
        .eq('collection_name', 'sessions')
        .like('key', '%:sessionData');

      // Get paginated sessions
      const { data, error } = await this.client
        .from('state_store')
        .select('key, value')
        .eq('collection_name', 'sessions')
        .like('key', '%:sessionData')
        .order('updated_at', { ascending: false })
        .range(from, to);

      if (error) {
        this.logger.error('Supabase getAllUserSessions error:', { message: error.message });
        return { sessions: [], total: 0 };
      }

      if (!data) return { sessions: [], total: 0 };

      const sessions: any[] = [];
      for (const row of data as any[]) {
        const sessionData = row.value;
        if (sessionData && sessionData.userId === userId) {
          sessions.push({
            ...sessionData,
            updatedAt: row.updated_at,
          });
        }
      }

      return { sessions, total: count || 0 };
    } catch (err) {
      this.logger.error('Unexpected Supabase getAllUserSessions error:', { error: String(err) });
      return { sessions: [], total: 0 };
    }
  }
}
