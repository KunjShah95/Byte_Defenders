/**
 * Quality Assurance Agent - Validates final output against criteria
 * Runs after refinement to ensure quality, completeness, and feasibility
 */
import { AgentRunnerService } from '../services/agentRunner.service';
import { Logger } from '../utils/logger';

export class QualityAssuranceAgent {
  private agentRunner = AgentRunnerService.getInstance();
  private logger = Logger.getLogger('QualityAssuranceAgent');

  async validateOutput(sessionId: string, idea: string, criteria: Record<string, any>, context?: Record<string, any>) {
    this.logger.info(`Validating output against criteria`, { sessionId });

    const request = {
      sessionId,
      agentType: 'quality-assurance' as const,
      input: {
        idea,
        criteria,
        originalRequirements: context?.requirements || [],
      },
      context,
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Check feasibility and completeness
   */
  async feasibilityCheck(sessionId: string, idea: string) {
    this.logger.info('Performing feasibility check', { sessionId });

    const request = {
      sessionId,
      agentType: 'quality-assurance' as const,
      input: {
        idea,
        task: 'feasibility_check',
      },
    };

    return await this.agentRunner.executeAgent(request);
  }

  /**
   * Generate improvement recommendations
   */
  async recommendImprovements(sessionId: string, idea: string, issues: string[]) {
    this.logger.info('Generating improvement recommendations', { sessionId });

    const request = {
      sessionId,
      agentType: 'quality-assurance' as const,
      input: {
        idea,
        identifiedIssues: issues,
        task: 'improvement_recommendations',
      },
    };

    return await this.agentRunner.executeAgent(request);
  }
}
