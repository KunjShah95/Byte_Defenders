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

    // Reconstruct input from backend data
    const input: SessionInput = {
      prompt: response.data.description || '',
      useCase: response.data.metadata?.useCase || 'startup',
      explainabilityMode: response.data.metadata?.explainabilityMode || false
    };

    return this.mapBackendSession(response.data, input);
  },

  async getAllSessions(): Promise<Session[]> {
    const response = await apiClient.get('/sessions');
    // We might need to map these similarly, but for now assuming list structure
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
    const endpoint = input.explainabilityMode ? 'full' : 'quick';
    const response = await apiClient.post(`/sessions/${id}/workflow/${endpoint}`, {
      topic: input.prompt
    });

    const session = await this.getSession(id);
    if (!session) throw new Error('Session not found after execution');

    // Map result to session
    if (response.data) {
      session.status = 'completed';
      session.result = this.mapBackendResult(response.data);
    }

    return session;
  },

  mapBackendSession(backendData: any, input: SessionInput): Session {
    return {
      id: backendData.id,
      input: input,
      status: backendData.status === 'active' ? 'pending' : backendData.status || 'pending',
      agents: [], // To be populated from result or history
      createdAt: backendData.createdAt,
      updatedAt: backendData.updatedAt
    };
  },

  mapBackendResult(data: any): any {
    // Map backend WorkflowResult to SessionResult
    // data.executionHistory contains all steps including agent outputs
    // data.refinedIdea contains the final output object
    // data.initialIdea contains the initial output object

    // Determine the primary text output to show as overview
    const overview = data.refinedIdea?.output?.text ||
      data.initialIdea?.output?.text ||
      (typeof data.finalOutput === 'string' ? data.finalOutput : JSON.stringify(data.finalOutput)) ||
      '';

    // Extract key recommendations/points if available or use raw text
    const recommendation = data.presentation?.output?.text || '';

    return {
      title: 'Generated Idea', // Could be dynamic
      overview: overview,
      keyPoints: [], // Logic to extract key points could be added here
      recommendation: recommendation,
      agentOutputs: data.executionHistory || [],
      avgScore: 8.5, // Dummy or calculate from agent scores if available
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
