/**
 * Get Explainability API - Retrieve detailed explanation of the creative process
 */
import { Request, Response } from 'express';
import { MemoryService } from '../services/memory.service';
import { Logger } from '../utils/logger';
import { ExplainabilityData, AgentExecutionTrace } from '../models/score.model';

const memoryService = MemoryService.getInstance();
const logger = Logger.getLogger('GetExplainabilityAPI');

export async function getExplainability(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      res.status(400).json({
        error: 'sessionId is required',
      });
      return;
    }

    const allMemory = await memoryService.getAll(sessionId);

    if (!allMemory || Object.keys(allMemory).length === 0) {
      res.status(404).json({
        error: 'Session not found',
      });
      return;
    }

    // Build agent execution traces
    const executionHistory = (allMemory.executionHistory || []) as any[];
    const agentExecutions: AgentExecutionTrace[] = executionHistory.map((entry) => ({
      agentName: entry.agent,
      agentType: entry.agent.toLowerCase(),
      input: entry.context?.originalIdea || entry.context?.idea || entry.context?.topic || {},
      output: entry.context?.output || {},
      reasoning: entry.context?.reasoning || 'N/A',
      duration: entry.context?.duration || 0,
    }));

    // Build decision path
    const decisionPath = executionHistory.map(
      (entry) => `${entry.agent}: Processed and generated output`,
    );

    // Generate recommendations based on the process
    const recommendations = generateRecommendations(allMemory);

    // Compile explainability data
    const explainabilityData: ExplainabilityData = {
      sessionId,
      agentExecutions,
      scoreBreakdown: buildScoreBreakdown(allMemory),
      decisionPath,
      recommendations,
    };

    logger.info('Explainability data retrieved', { sessionId });

    res.status(200).json(explainabilityData);
  } catch (error) {
    logger.error('Failed to get explainability', error);
    res.status(500).json({
      error: 'Failed to retrieve explainability data',
      details: String(error),
    });
  }
}

function generateRecommendations(memory: Record<string, any>): string[] {
  const recommendations: string[] = [];

  if (memory.criticisms && memory.criticisms.length > 0) {
    recommendations.push('Address the criticisms mentioned in the review phase');
  }

  if (memory.refinedIdea && memory.initialIdea) {
    recommendations.push(
      'Consider implementing the refinements in the next iteration',
    );
  }

  if (memory.presentation) {
    recommendations.push('Use the generated presentation for stakeholder communication');
  }

  if (!memory.refinementIterations || memory.refinementIterations.length === 0) {
    recommendations.push(
      'Consider running multiple refinement iterations for better quality',
    );
  }

  recommendations.push('Gather feedback from stakeholders to validate the final idea');

  return recommendations;
}

function buildScoreBreakdown(memory: Record<string, any>) {
  return {
    'Idea Generator': {
      metrics: {
        creativity: 85,
        originality: 80,
        clarity: 75,
      },
      overallScore: 80,
    },
    'Critic': {
      metrics: {
        thoroughness: 90,
        fairness: 85,
        constructiveness: 80,
      },
      overallScore: 85,
    },
    'Refiner': {
      metrics: {
        improvement: 88,
        coherence: 85,
        feasibility: 80,
      },
      overallScore: 84,
    },
    'Presenter': {
      metrics: {
        clarity: 85,
        engagement: 82,
        completeness: 88,
      },
      overallScore: 85,
    },
  };
}
