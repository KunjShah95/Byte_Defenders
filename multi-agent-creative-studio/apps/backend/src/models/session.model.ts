/**
 * Session Model - Represents a creative session/workflow instance
 */
export interface Session {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'failed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export interface CreateSessionInput {
  userId: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface SessionResponse extends Session {
  progress?: number;
  currentAgent?: string;
}
