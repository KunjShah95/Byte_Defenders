/**
 * Agent Output Model - Represents output from a single agent execution
 */
export interface AgentOutput {
  id: string;
  sessionId: string;
  agentName: string;
  agentType: string;
  input: Record<string, any>;
  output: Record<string, any>;
  reasoning?: string;
  timestamp: Date;
  duration: number; // in milliseconds
  success: boolean;
  error?: string;
}

export interface AgentExecutionRequest {
  sessionId: string;
  agentType: string;
  input: Record<string, any>;
  context?: Record<string, any>;
}

export interface AgentExecutionResponse {
  agentOutput: AgentOutput;
  nextSteps?: string[];
}
