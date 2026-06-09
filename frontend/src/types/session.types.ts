import { Agent, AgentOutput } from './agent.types';

export type UseCase = 'startup' | 'marketing' | 'education' | 'research';

export type SessionStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface SessionInput {
  prompt: string;
  useCase: UseCase;
  explainabilityMode: boolean;
}

export interface SessionResult {
  title: string;
  overview: string;
  keyPoints: string[];
  recommendation: string;
  agentOutputs: AgentOutput[];
  avgScore: number;
  iterations: number;
}

export interface Session {
  id: string;
  input: SessionInput;
  status: SessionStatus;
  agents: Agent[];
  result?: SessionResult;
  createdAt: string;
  updatedAt: string;
}

export const USE_CASE_LABELS: Record<UseCase, string> = {
  startup: 'Startup Idea',
  marketing: 'Marketing Campaign',
  education: 'Educational Content',
  research: 'Research Project',
};

/** Pagination metadata returned by paginated API endpoints */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Wrapper for paginated API responses */
export interface PaginatedResponse<T> {
  sessions: T[];
  pagination: PaginationMeta;
}
