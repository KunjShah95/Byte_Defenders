/**
 * Basic input validation helpers for API requests
 */
import { CreateSessionInput } from '../models/session.model';

export type ValidationResult<T> = { valid: boolean; errors: string[]; data?: T };

export function validateCreateSessionInput(input: any): ValidationResult<CreateSessionInput> {
  const errors: string[] = [];
  const data: any = input || {};

  if (!data.userId) {
    errors.push('userId is required');
  }
  if (!data.title) {
    errors.push('title is required');
  }
  if ('description' in data && typeof data.description !== 'string') {
    errors.push('description must be a string');
  }
  if ('metadata' in data && data.metadata != null && typeof data.metadata !== 'object') {
    errors.push('metadata must be an object');
  }

  const result: ValidationResult<CreateSessionInput> = {
    valid: errors.length === 0,
    errors,
    data: {
      userId: data.userId,
      title: data.title,
      description: data.description,
      metadata: data.metadata,
    },
  };

  return result;
}

export type PromptBuildInput = {
  agentType: string;
  template: string;
  context: any;
};

export function validatePromptsBuildInput(input: any): ValidationResult<PromptBuildInput> {
  const errors: string[] = [];
  const data: any = input || {};

  if (!data.agentType) errors.push('agentType is required');
  if (!data.template) errors.push('template is required');
  if (data.context === undefined) errors.push('context is required');

  return {
    valid: errors.length === 0,
    errors,
    data: {
      agentType: data.agentType,
      template: data.template,
      context: data.context,
    },
  };
}
