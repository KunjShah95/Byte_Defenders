import { Session, SessionInput, SessionResult, UseCase, PaginationMeta } from '@/types/session.types';
import { Agent, AgentOutput, AgentLog, ExecutionHistoryEntry, AgentExecutionTrace, ExplainabilityResponse } from '@/types/agent.types';
import apiClient from '@/lib/api.client';
import { auth } from '@/lib/firebase';

/** Internal helper: extract an agent type string from a loose value. */
function resolveAgentType(value: unknown): 'idea' | 'critic' | 'refiner' | 'presenter' | 'strategist' | 'researcher' | 'quality-assurance' {
  const str = typeof value === 'string' ? value.toLowerCase() : '';
  if (str === 'idea') return 'idea';
  if (str === 'critic') return 'critic';
  if (str === 'refiner') return 'refiner';
  if (str === 'presenter') return 'presenter';
  if (str === 'strategist') return 'strategist';
  if (str === 'researcher' || str === 'research') return 'researcher';
  if (str === 'quality-assurance' || str === 'quality_assurance' || str === 'qa') return 'quality-assurance';
  return 'idea';
}

/**
 * Extract the best available text from a loose output object.
 * Checks common shapes: { text }, { content }, or just stringifies.
 */
function extractOutputText(output: Record<string, unknown> | undefined): string {
  if (!output) return '';
  return (output.text as string) || (output.content as string) || '';
}

/**
 * Extract the best available score from a loose output + parent object.
 */
function extractScore(output: Record<string, unknown> | undefined, parentScore: unknown): number | undefined {
  const meta = output?.metadata as Record<string, unknown> | undefined;
  return (meta?.score as number) || (output?.score as number) || (parentScore as number) || undefined;
}

// ---- public service ----

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
        useCase: (response.data.metadata?.useCase as UseCase) || 'startup' as UseCase,
        explainabilityMode: response.data.metadata?.explainabilityMode || false
      };

      const session = this.mapBackendSession(response.data, input);

      // Best-effort: populate agents from explainability endpoint for
      // completed sessions. This is a single call — no duplicate.
      try {
        const agents = await this.fetchSessionAgents(id);
        if (agents.length > 0) {
          session.agents = agents;
        }
      } catch {
        // Explainability not available yet — keep agents empty
      }

      return session;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 404) {
        console.warn('Session not found:', id);
        return null;
      }
      throw error;
    }
  },

  async getAllSessions(page: number = 1, limit: number = 20): Promise<{ sessions: Session[]; pagination: PaginationMeta | null }> {
    const response = await apiClient.get(`/sessions?page=${page}&limit=${limit}`);
    const raw = (Array.isArray(response.data) ? response.data : []) as Record<string, unknown>[];
    const meta = ((response as unknown) as { _meta?: { pagination?: PaginationMeta } })._meta;

    const sessions: Session[] = raw.map(s => {
      const metadata = (s.metadata ?? {}) as Record<string, unknown>;
      const input: SessionInput = {
        prompt: (s.description as string) || '',
        useCase: (metadata.useCase as UseCase) || 'startup' as UseCase,
        explainabilityMode: (metadata.explainabilityMode as boolean) || false
      };
      return this.mapBackendSession(s, input);
    });

    return { sessions, pagination: meta?.pagination ?? null };
  },

  async runSession(id: string, input: SessionInput): Promise<Session> {
    try {
      const endpoint = input.explainabilityMode ? 'full' : 'quick';
      const response = await apiClient.post(`/sessions/${id}/workflow/${endpoint}`, {
        topic: input.prompt
      });

      // Build the session directly from what we know — no extra GET call
      const session: Session = {
        id,
        input,
        status: 'completed',
        agents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (response.data) {
        session.result = this.mapBackendResult(response.data);

        // Populate agents from the workflow response (no explainability backfill)
        const executionHistory = (response.data.executionHistory ?? []) as ExecutionHistoryEntry[];
        if (executionHistory.length > 0) {
          session.agents = this.mapExecutionHistoryToAgents(executionHistory);
        }

        // Also try individual agent keys if executionHistory was empty
        if (session.agents.length === 0) {
          session.agents = this.mapWorkflowResponseAgents(response.data);
        }

        session.updatedAt = new Date().toISOString();
      } else {
        session.status = 'running';
      }

      return session;
    } catch (error: unknown) {
      console.error('Error running session:', error);
      const err = error as { response?: { data?: { error?: string }; statusText?: string }; request?: unknown };
      if (err.response) {
        throw new Error(`Workflow execution failed: ${err.response.data?.error || err.response.statusText}`);
      } else if (err.request) {
        throw new Error('Network error: Could not reach the backend server. Please ensure the backend is running on port 3000.');
      } else {
        throw new Error(`Failed to run session: ${(error as Error).message || 'Unknown error'}`);
      }
    }
  },

  /**
   * Map execution-history entries (nested context.output shape)
   * into our Agent[] model. Also handles the alternative shape
   * where output is a top-level key on the entry.
   */
  mapExecutionHistoryToAgents(entries: ExecutionHistoryEntry[]): Agent[] {
    return entries.map((entry, index) => {
      const agentType = resolveAgentType(entry.agentType || entry.agent);

      // Try both nested (context.output) and flat (entry.output) shapes
      const ctx = entry.context ?? {};
      const nestedOutput = (ctx.output ?? {}) as Record<string, unknown>;
      const flatOutput = (entry.output ?? {}) as Record<string, unknown>;

      // Prefer nested shape that the creative workflow returns
      const output = Object.keys(nestedOutput).length > 0 ? nestedOutput : flatOutput;
      const outputText = extractOutputText(output);
      const score = extractScore(output, entry.score);

      return {
        id: `${agentType}-${index}`,
        type: agentType,
        name: entry.agent || entry.agentType || `Agent ${index + 1}`,
        status: 'done' as const,
        logs: [] as AgentLog[],
        output: outputText
          ? { content: outputText, score, structuredData: (output.metadata ?? {}) as Record<string, unknown>, agentType }
          : undefined,
        reasoning: (ctx.reasoning as string) || entry.reasoning || undefined,
        duration: ((ctx.duration as number) || entry.duration || 0) as number,
      };
    });
  },

  /**
   * Map agent-execution traces (flat output shape from the
   * explainability endpoint) into our Agent[] model.
   */
  mapAgentExecutions(traces: AgentExecutionTrace[]): Agent[] {
    return traces.map((trace, index) => {
      const agentType = resolveAgentType(trace.agentType);
      const output = (trace.output ?? {}) as Record<string, unknown>;
      const outputText = extractOutputText(output);
      const score = extractScore(output, trace.score);

      return {
        id: trace.agentName.toLowerCase().replace(/\s+/g, '-') || `agent-${index}`,
        type: agentType,
        name: trace.agentName || 'Unknown Agent',
        status: 'done' as const,
        logs: [] as AgentLog[],
        output: outputText
          ? { content: outputText, score, structuredData: (output.metadata ?? {}) as Record<string, unknown>, agentType }
          : undefined,
        reasoning: trace.reasoning || undefined,
        duration: trace.duration || 0,
      };
    });
  },

  /** Fallback: build agents from the individual agent keys in the workflow response. */
  mapWorkflowResponseAgents(data: Record<string, unknown>): Agent[] {
    const agents: Agent[] = [];
    const agentMap: Array<{ key: string; type: 'idea' | 'critic' | 'refiner' | 'presenter' }> = [
      { key: 'initialIdea', type: 'idea' },
      { key: 'criticisms', type: 'critic' },
      { key: 'refinedIdea', type: 'refiner' },
      { key: 'presentation', type: 'presenter' },
    ];

    agentMap.forEach(({ key, type }) => {
      const agentData = data[key] as Record<string, unknown> | undefined;
      if (!agentData) return;

      const outputData = (agentData.output ?? {}) as Record<string, unknown>;
      const outputText = extractOutputText(outputData);
      if (!outputText) return;

      agents.push({
        id: `${type}-${agents.length}`,
        type,
        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        status: 'done' as const,
        logs: [] as AgentLog[],
        output: {
          content: outputText,
          score: extractScore(outputData, undefined),
          structuredData: (outputData.metadata ?? {}) as Record<string, unknown>,
          agentType: type,
        },
        reasoning: (agentData.reasoning as string) || undefined,
        duration: (agentData.duration as number) || 0,
      });
    });

    return agents;
  },

  mapBackendSession(backendData: Record<string, unknown>, input: SessionInput): Session {
    let status: 'pending' | 'running' | 'completed' | 'failed' = 'pending';
    switch (backendData.status) {
      case 'active':
      case 'pending': status = 'pending'; break;
      case 'completed': status = 'completed'; break;
      case 'failed': status = 'failed'; break;
      case 'running': status = 'running'; break;
    }

    const createdAt = backendData.createdAt as string | { toISOString: () => string } | undefined;
    const updatedAt = backendData.updatedAt as string | { toISOString: () => string } | undefined;

    return {
      id: (backendData.id || backendData.sessionId) as string,
      input,
      status,
      agents: [],
      createdAt: createdAt ? (typeof createdAt === 'string' ? createdAt : createdAt.toISOString()) : new Date().toISOString(),
      updatedAt: updatedAt ? (typeof updatedAt === 'string' ? updatedAt : updatedAt.toISOString()) : new Date().toISOString(),
    };
  },

  mapBackendResult(data: Record<string, unknown>): SessionResult {
    const refinedIdea = (data.refinedIdea as Record<string, unknown>) ?? {};
    const initialIdea = (data.initialIdea as Record<string, unknown>) ?? {};
    const presentation = (data.presentation as Record<string, unknown>) ?? {};

    const refinedOutput = (refinedIdea.output as Record<string, unknown>) ?? {};
    const initialOutput = (initialIdea.output as Record<string, unknown>) ?? {};
    const presentationOutput = (presentation.output as Record<string, unknown>) ?? {};

    const overview = extractOutputText(refinedOutput)
      || extractOutputText(initialOutput)
      || (typeof data.finalOutput === 'string' ? data.finalOutput : JSON.stringify(data.finalOutput))
      || '';

    const recommendation = extractOutputText(presentationOutput);

    // Calculate average score from execution history
    const execHistory = (data.executionHistory ?? []) as ExecutionHistoryEntry[];
    const scores = execHistory
      .map(e => {
        const ctx = e.context ?? {};
        const out = (ctx.output ?? {}) as Record<string, unknown>;
        const meta = (out.metadata ?? {}) as Record<string, unknown>;
        return (meta.score as number) || 0;
      })
      .filter(s => s > 0);
    const avgScore = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;

    // Map execution history to AgentOutput format
    const agentOutputs: AgentOutput[] = execHistory.map(e => {
      const ctx = e.context ?? {};
      const out = (ctx.output ?? {}) as Record<string, unknown>;
      return {
        agentType: resolveAgentType(e.agentType || e.agent),
        content: extractOutputText(out),
        structuredData: (out.metadata ?? {}) as Record<string, unknown>,
        score: extractScore(out, undefined),
        reasoning: (ctx.reasoning as string) || undefined,
      };
    });

    return {
      title: 'Generated Idea',
      overview,
      keyPoints: [],
      recommendation,
      agentOutputs,
      avgScore,
      iterations: execHistory.length || 1,
    };
  },

  async getResult(id: string): Promise<SessionResult> {
    const response = await apiClient.get(`/sessions/${id}/result`);
    return response.data as SessionResult;
  },

  async getExplainability(id: string): Promise<ExplainabilityResponse> {
    const response = await apiClient.get(`/sessions/${id}/explainability`);
    return response.data as ExplainabilityResponse;
  },

  /** Convenience: fetch explainability and return mapped agents. */
  async fetchSessionAgents(id: string): Promise<Agent[]> {
    try {
      const explainability = await this.getExplainability(id);
      if (explainability?.agentExecutions?.length) {
        return this.mapAgentExecutions(explainability.agentExecutions);
      }
    } catch {
      console.debug('Explainability data not yet available for session', id);
    }
    return [];
  }
};
