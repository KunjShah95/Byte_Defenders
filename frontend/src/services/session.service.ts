import { Session, SessionInput } from '@/types/session.types';
import apiClient from '@/lib/api.client';
import { auth } from '@/lib/firebase';

export const sessionService = {
  async createSession(input: SessionInput): Promise<Session> {
    const user = auth.currentUser;
    const response = await apiClient.post('/sessions', {
      userId: user?.uid || 'anonymous',
      title: input.prompt.substring(0, 50) + '...',
      description: input.prompt,
      metadata: {
        useCase: input.useCase,
        explainabilityMode: input.explainabilityMode
      }
    });

    return this.mapBackendSession(response.data, input);
  },

  async getSession(id: string): Promise<Session | null> {
    const response = await apiClient.get(`/sessions/${id}`);
    if (!response.data) return null;

    const input: SessionInput = {
      prompt: response.data.description || '',
      useCase: response.data.metadata?.useCase || 'startup',
      explainabilityMode: response.data.metadata?.explainabilityMode || false
    };

    return this.mapBackendSession(response.data, input);
  },

  async getAllSessions(): Promise<Session[]> {
    const response = await apiClient.get('/sessions');
    return (response.data as any[]).map(s => {
      const input: SessionInput = {
        prompt: s.description || '',
        useCase: s.metadata?.useCase || 'startup',
        explainabilityMode: s.metadata?.explainabilityMode || false
      };
      return this.mapBackendSession(s, input);
    });
  },

  async runSession(id: string, input: SessionInput): Promise<Session> {
    try {
      const endpoint = input.explainabilityMode ? 'full' : 'quick';
      const response = await apiClient.post(`/sessions/${id}/workflow/${endpoint}`, {
        topic: input.prompt
      });

      const session = await this.getSession(id);
      if (!session) throw new Error('Session not found after execution');

      if (response.data) {
        session.status = 'completed';
        session.result = this.mapBackendResult(response.data);
      } else {
        session.status = 'running';
      }

      return session;
    } catch (error: any) {
      console.error('Error running session:', error);
      if (error.response) {
        throw new Error(`Workflow execution failed: ${error.response.data?.error || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network error: Could not reach the backend server. Please ensure the backend is running on port 3000.');
      } else {
        throw new Error(`Failed to run session: ${error.message}`);
      }
    }
  },

  mapBackendSession(backendData: any, input: SessionInput): Session {
    let status: 'pending' | 'running' | 'completed' | 'failed' = 'pending';
    if (backendData.status === 'active') {
      status = 'pending';
    } else if (backendData.status === 'completed') {
      status = 'completed';
    } else if (backendData.status === 'failed') {
      status = 'failed';
    } else if (backendData.status === 'running') {
      status = 'running';
    }

    return {
      id: backendData.id || backendData.sessionId,
      input: input,
      status: status,
      agents: [],
      createdAt: backendData.createdAt ? (typeof backendData.createdAt === 'string' ? backendData.createdAt : backendData.createdAt.toISOString()) : new Date().toISOString(),
      updatedAt: backendData.updatedAt ? (typeof backendData.updatedAt === 'string' ? backendData.updatedAt : backendData.updatedAt.toISOString()) : new Date().toISOString()
    };
  },

  mapBackendResult(data: any): any {
    const overview = data.refinedIdea?.output?.text ||
      data.initialIdea?.output?.text ||
      (typeof data.finalOutput === 'string' ? data.finalOutput : JSON.stringify(data.finalOutput)) ||
      '';

    const recommendation = data.presentation?.output?.text || '';

    return {
      title: 'Generated Idea',
      overview: overview,
      keyPoints: [],
      recommendation: recommendation,
      agentOutputs: data.executionHistory || [],
      avgScore: 8.5,
      iterations: data.executionHistory?.length || 1
    };
  },

  async getResult(id: string): Promise<any> {
    const response = await apiClient.get(`/sessions/${id}/result`);
    return response.data;
  },

  async getExplainability(id: string): Promise<any> {
    const response = await apiClient.get(`/sessions/${id}/explainability`);
    return response.data;
  }
};
