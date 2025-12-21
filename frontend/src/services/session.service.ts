import { Session, SessionInput, SessionResult, UseCase } from '@/types/session.types';
import { Agent, AgentOutput, AgentLog } from '@/types/agent.types';
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
    try {
      const response = await apiClient.get(`/sessions/${id}`);
      if (!response.data) return null;

      const input: SessionInput = {
        prompt: response.data.description || '',
        useCase: (response.data.metadata?.useCase as UseCase) || ('startup' as UseCase),
        explainabilityMode: response.data.metadata?.explainabilityMode || false
      };

      const session = this.mapBackendSession(response.data, input);

      // Try to fetch explainability data to populate agent outputs
      try {
        const explainabilityData = await this.getExplainability(id);
        const explainAsRecord = explainabilityData as Record<string, unknown>;
        if (explainAsRecord && explainAsRecord.agentExecutions) {
          session.agents = this.mapAgentExecutions(explainAsRecord.agentExecutions as Record<string, unknown>[]);
        }
      } catch (error) {
        // Explainability data not available yet, keep agents empty
        console.debug('Explainability data not yet available for session', id);
      }

      return session;
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      if (err.response) {
        const response = err.response as Record<string, unknown>;
        if (response.status === 404) {
          console.warn('Session not found:', id);
          return null;
        }
      }
      throw error;
    }
  },

  async getAllSessions(): Promise<Session[]> {
    const response = await apiClient.get('/sessions');
    const sessions = ((response.data || []) as Record<string, unknown>[]).map(s => {
      const metadata = (s.metadata as Record<string, unknown>) || {};
      const input: SessionInput = {
        prompt: (s.description as string) || '',
        useCase: (metadata.useCase as UseCase) || ('startup' as UseCase),
        explainabilityMode: (metadata.explainabilityMode as boolean) || false
      };
      return this.mapBackendSession(s, input);
    });

    return sessions;
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
        
        // Add agents from response.data if available
        if (response.data.executionHistory && response.data.executionHistory.length > 0) {
          session.agents = this.mapExecutionHistoryToAgents(response.data.executionHistory);
        }
        
        // Retry fetching explainability data with exponential backoff
        for (let attempt = 0; attempt < 3; attempt++) {
          if (session.agents && session.agents.length > 0 && session.agents.some(a => a.output)) {
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt)));
          try {
            const explainabilityData = await this.getExplainability(id);
            const explainAsRecord = explainabilityData as Record<string, unknown>;
            if (explainAsRecord && explainAsRecord.agentExecutions) {
              session.agents = this.mapAgentExecutions(explainAsRecord.agentExecutions as Record<string, unknown>[]);
              break;
            }
          } catch (e) {
            console.debug(`Explainability fetch attempt ${attempt + 1} failed:`, e);
          }
        }
      } else {
        session.status = 'running';
      }

      return session;
    } catch (error: unknown) {
      console.error('Error running session:', error);
      const err = error as Record<string, unknown>;
      if (err.response) {
        const response = err.response as Record<string, unknown>;
        const data = response.data as Record<string, unknown> | undefined;
        throw new Error(`Workflow execution failed: ${data?.error || response.statusText}`);
      } else if (err.request) {
        throw new Error('Network error: Could not reach the backend server. Please ensure the backend is running on port 3001.');
      } else {
        throw new Error(`Failed to run session: ${(error as Error).message || 'Unknown error'}`);
      }
    }
  },

  mapExecutionHistoryToAgents(executionHistory: Record<string, unknown>[]): Agent[] {
    return executionHistory.map((entry, index) => {
      const agentTypeValue = (entry.agentType || entry.agent || '');
      const agentType = (typeof agentTypeValue === 'string' ? agentTypeValue : '').toLowerCase() as 'idea' | 'critic' | 'refiner' | 'presenter';
      const context = (entry.context as Record<string, unknown> | undefined) || {};
      const output = (context.output as Record<string, unknown> | undefined) || {};
      const metadata = (output.metadata as Record<string, unknown> | undefined) || {};
      const outputText = (output.text as string) || '';
      
      return {
        id: `${agentType}-${index}`,
        type: agentType,
        name: (entry.agent as string) || `Agent ${index + 1}`,
        status: 'done' as const,
        logs: [] as AgentLog[],
        output: outputText ? {
          content: outputText,
          score: (metadata.score as number) || undefined,
          structuredData: metadata,
          agentType: agentType
        } : undefined,
        reasoning: (context.reasoning as string | undefined),
        duration: ((context.duration as number) || 0)
      };
    });
  },

  mapAgentExecutions(agentExecutions: Record<string, unknown>[]): Agent[] {
    return agentExecutions.map((execution, index) => {
      const output = execution.output as Record<string, unknown> | undefined;
      let outputObj: AgentOutput | undefined = undefined;
      
      if (output) {
        const metadata = output.metadata as Record<string, unknown> | undefined;
        outputObj = {
          content: (output.text as string) || (output.content as string) || JSON.stringify(output),
          score: (metadata?.score as number) || (execution.score as number) || undefined,
          structuredData: metadata || output,
          agentType: (execution.agentType as 'idea' | 'critic' | 'refiner' | 'presenter') || 'idea'
        };
      }
      
      return {
        id: (((execution.agentName as string) || `agent-${index}`).toLowerCase().replace(/\s+/g, '-')),
        type: (execution.agentType as 'idea' | 'critic' | 'refiner' | 'presenter') || 'idea',
        name: (execution.agentName as string) || 'Unknown Agent',
        status: 'done' as const,
        logs: [] as AgentLog[],
        output: outputObj,
        reasoning: execution.reasoning as string | undefined,
        duration: (execution.duration as number) || 0
      };
    });
  },

  mapBackendSession(backendData: Record<string, unknown>, input: SessionInput): Session {
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

    const createdAt = backendData.createdAt as string | { toISOString: () => string } | undefined;
    const updatedAt = backendData.updatedAt as string | { toISOString: () => string } | undefined;
    
    return {
      id: (backendData.id || backendData.sessionId) as string,
      input: input,
      status: status,
      agents: [],
      createdAt: createdAt ? (typeof createdAt === 'string' ? createdAt : createdAt.toISOString()) : new Date().toISOString(),
      updatedAt: updatedAt ? (typeof updatedAt === 'string' ? updatedAt : updatedAt.toISOString()) : new Date().toISOString()
    };
  },

  mapBackendResult(data: Record<string, unknown>): SessionResult {
    const refinedIdea = (data.refinedIdea as Record<string, unknown> | undefined) || {};
    const initialIdea = (data.initialIdea as Record<string, unknown> | undefined) || {};
    const presentation = (data.presentation as Record<string, unknown> | undefined) || {};
    
    const refinedOutput = (refinedIdea.output as Record<string, unknown> | undefined) || {};
    const initialOutput = (initialIdea.output as Record<string, unknown> | undefined) || {};
    const presentationOutput = (presentation.output as Record<string, unknown> | undefined) || {};
    
    const overview = ((refinedOutput.text as string) ||
      (initialOutput.text as string) ||
      (typeof data.finalOutput === 'string' ? data.finalOutput : JSON.stringify(data.finalOutput)) ||
      '') as string;

    const recommendation = ((presentationOutput.text as string) || '') as string;

    // Calculate average score from execution history
    let avgScore = 0;
    const executionHistory = (data.executionHistory as Record<string, unknown>[] | undefined) || [];
    if (executionHistory.length > 0) {
      const scores = executionHistory
        .map((entry: Record<string, unknown>) => {
          const context = (entry.context as Record<string, unknown> | undefined) || {};
          const output = (context.output as Record<string, unknown> | undefined) || {};
          const metadata = (output.metadata as Record<string, unknown> | undefined) || {};
          return ((metadata.score as number) || 0);
        })
        .filter((score: number) => score > 0);
      avgScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
    }

    // Map execution history to AgentOutput format
    const agentOutputs: AgentOutput[] = executionHistory.map((entry: Record<string, unknown>) => {
      const context = (entry.context as Record<string, unknown> | undefined) || {};
      const output = (context.output as Record<string, unknown> | undefined) || {};
      const metadata = (output.metadata as Record<string, unknown> | undefined) || {};
      
      return {
        agentType: (entry.agentType as 'idea' | 'critic' | 'refiner' | 'presenter') || 'idea',
        content: ((output.text as string) || ''),
        structuredData: metadata,
        score: ((metadata.score as number) || undefined),
        reasoning: ((context.reasoning as string) || undefined)
      };
    });

    return {
      title: 'Generated Idea',
      overview,
      keyPoints: [],
      recommendation,
      agentOutputs: agentOutputs,
      avgScore: Math.round(avgScore * 10) / 10,
      iterations: executionHistory.length || 1
    };
  },

  async getResult(id: string): Promise<SessionResult> {
    const response = await apiClient.get(`/sessions/${id}/result`);
    return response.data;
  },

  async getExplainability(id: string): Promise<Record<string, unknown>> {
    const response = await apiClient.get(`/sessions/${id}/explainability`);
    return response.data;
  }
};
