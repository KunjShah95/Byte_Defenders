import { IPersistenceAdapter } from '../services/memory.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseAdapter implements IPersistenceAdapter {
  private client: SupabaseClient | null = null;

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
      console.warn('Supabase client not initialized');
      return;
    }
    // Store as JSONB object, not stringified
    const { error } = await this.client.from('state_store').upsert([{ collection_name: 'sessions', key: `session:${sessionId}`, value: {} }]);
    if (error) {
      console.error('Supabase initializeSession error:', error);
    }
  }

  async store(sessionId: string, key: string, value: any): Promise<void> {
    if (!this.client) {
      console.warn('Supabase client not initialized');
      return;
    }
    const { error } = await this.client.from('state_store').upsert([{ collection_name: 'sessions', key: `${sessionId}:${key}`, value }]);
    if (error) {
      console.error('Supabase store error:', error);
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
        console.error('Supabase retrieve error:', error);
        return null;
      }
      return data?.value ?? null;
    } catch (err) {
      console.error('Unexpected Supabase retrieve error:', err);
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
      console.error('Supabase getAll error:', error);
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
      console.error('Supabase clear error:', error);
    }
  }

  async exists(sessionId: string): Promise<boolean> {
    if (!this.client) return false;
    const { count, error } = await this.client.from('state_store').select('1', { count: 'exact' }).eq('collection_name', 'sessions').eq('key', `session:${sessionId}`);
    if (error) {
      console.error('Supabase exists error:', error);
      return false;
    }
    return (count ?? 0) > 0;
  }

  async pushContext(sessionId: string, agentName: string, context: Record<string, any>): Promise<void> {
    const existing = await this.retrieve(sessionId, 'executionHistory');
    const arr = Array.isArray(existing) ? existing : [];
    arr.push({ agent: agentName, context, timestamp: new Date() });
    await this.store(sessionId, 'executionHistory', arr);
  }

  async getExecutionHistory(sessionId: string): Promise<any[]> {
    const hist = await this.retrieve(sessionId, 'executionHistory');
    return Array.isArray(hist) ? hist : [];
  }
}

export default SupabaseAdapter;
