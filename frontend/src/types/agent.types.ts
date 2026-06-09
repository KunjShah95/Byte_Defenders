export type AgentStatus = 'waiting' | 'running' | 'done' | 'error';

export type AgentType = 'idea' | 'critic' | 'refiner' | 'presenter' | 'strategist' | 'researcher' | 'quality-assurance';

export interface AgentLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AgentOutput {
  agentType: AgentType;
  content: string;
  structuredData?: Record<string, unknown>;
  score?: number;
  reasoning?: string;
}

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  description?: string;
  status: AgentStatus;
  logs?: AgentLog[];
  output?: AgentOutput;
  startedAt?: string;
  completedAt?: string;
  reasoning?: string;
  duration?: number;
}

/** A single entry from the workflow execution history (backend response format). */
export interface ExecutionHistoryEntry {
  agent?: string;
  agentType?: string;
  context?: {
    output?: {
      text?: string;
      metadata?: Record<string, unknown>;
      content?: string;
      score?: number;
    };
    reasoning?: string;
    duration?: number;
    originalIdea?: unknown;
    idea?: unknown;
    topic?: string;
    input?: unknown;
  };
  output?: {
    text?: string;
    content?: string;
    metadata?: Record<string, unknown>;
    score?: number;
  };
  score?: number;
  reasoning?: string;
  duration?: number;
  timestamp?: string;
  success?: boolean;
}

/** A single agent execution trace from the explainability endpoint. */
export interface AgentExecutionTrace {
  agentName: string;
  agentType: string;
  input: unknown;
  output: {
    text?: string;
    content?: string;
    metadata?: Record<string, unknown>;
  };
  reasoning?: string;
  duration?: number;
  score?: number;
}

/** Full response from the explainability endpoint. */
export interface ExplainabilityResponse {
  sessionId: string;
  agentExecutions: AgentExecutionTrace[];
  scoreBreakdown?: Record<string, unknown>;
  decisionPath?: string[];
  recommendations?: string[];
}

export const AGENT_CONFIG: Record<AgentType, { name: string; description: string; icon: string }> = {
  idea: {
    name: 'Idea Agent',
    description: 'Generates creative concepts and initial ideas',
    icon: '💡',
  },
  critic: {
    name: 'Critic Agent',
    description: 'Analyzes and evaluates ideas for weaknesses',
    icon: '🔍',
  },
  refiner: {
    name: 'Refiner Agent',
    description: 'Improves and polishes concepts based on feedback',
    icon: '✨',
  },
  presenter: {
    name: 'Presenter Agent',
    description: 'Formats and presents the final output',
    icon: '📊',
  },
  strategist: {
    name: 'Strategist Agent',
    description: 'Develops strategy and defines constraints',
    icon: '🎯',
  },
  researcher: {
    name: 'Researcher Agent',
    description: 'Conducts topic research and gathers insights',
    icon: '📚',
  },
  'quality-assurance': {
    name: 'QA Agent',
    description: 'Validates quality and feasibility of outputs',
    icon: '✅',
  },
};
