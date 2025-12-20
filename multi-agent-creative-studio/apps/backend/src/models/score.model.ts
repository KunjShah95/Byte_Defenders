/**
 * Score Model - Represents scoring/evaluation of creative outputs
 */
export interface Score {
  id: string;
  agentOutputId: string;
  metric: string;
  value: number; // typically 0-100
  explanation?: string;
  timestamp: Date;
}

export interface ScoringInput {
  agentOutputId: string;
  metrics: {
    creativity?: number;
    relevance?: number;
    clarity?: number;
    feasibility?: number;
    [key: string]: number | undefined;
  };
}

export interface ScoringResult {
  scores: Score[];
  overallScore: number;
  feedback: string;
}

export interface ExplainabilityData {
  sessionId: string;
  agentExecutions: AgentExecutionTrace[];
  scoreBreakdown: ScoreBreakdown;
  decisionPath: string[];
  recommendations: string[];
}

export interface AgentExecutionTrace {
  agentName: string;
  agentType: string;
  input: Record<string, any>;
  output: Record<string, any>;
  reasoning: string;
  duration: number;
  score?: number;
}

export interface ScoreBreakdown {
  [agentName: string]: {
    metrics: Record<string, number>;
    overallScore: number;
  };
}
