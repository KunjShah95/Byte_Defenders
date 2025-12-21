export type AgentStatus = 'waiting' | 'running' | 'done' | 'error';

export type AgentType = 'idea' | 'critic' | 'refiner' | 'presenter';

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
};
