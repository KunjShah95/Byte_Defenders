/**
 * Prompts Management API
 */
import { Request, Response } from 'express';
import { PromptManagerService } from '../services/promptManager.service';
import { Logger } from '../utils/logger';
import { validatePromptsBuildInput } from '../middlewares/validation';
import { sendSuccess, sendError } from '../utils/response';

const promptManager = PromptManagerService.getInstance();
const logger = Logger.getLogger('PromptsAPI');

export async function getAvailablePrompts(req: Request, res: Response): Promise<void> {
  try {
    const { agentType } = req.params;

    if (!agentType) {
      res.status(400).json({
        error: 'agentType parameter is required',
      });
      return;
    }

    const templates = promptManager.getAvailableTemplates(
      agentType,
    );

    if (!templates || templates.length === 0) {
      sendError(res, `No prompts found for agent type: ${agentType}`, 404);
      return;
    }

    sendSuccess(res, {
      agentType,
      templates,
      totalCount: templates.length,
    });
  } catch (error) {
    logger.error('Failed to get available prompts', error);
    sendError(res, 'Failed to retrieve prompts', 500, String(error));
  }
}

export async function getPromptStats(req: Request, res: Response): Promise<void> {
  try {
    const stats = promptManager.getPromptStats();
    sendSuccess(res, stats);
  } catch (error) {
    logger.error('Failed to get prompt stats', error);
    sendError(res, 'Failed to retrieve prompt statistics', 500, String(error));
  }
}

export async function buildPrompt(req: Request, res: Response): Promise<void> {
  try {
    const { agentType, template, context } = req.body;

    if (!agentType || !template || !context) {
      sendError(res, 'agentType, template, and context are required', 400);
      return;
    }

    // Validate configuration
    const configValidation = promptManager.validatePromptConfig({
      agentType: agentType,
      templateName: template,
      context,
    });

    if (!configValidation.valid) {
      sendError(res, 'Invalid prompt configuration', 400, configValidation.errors);
      return;
    }

    // Build optimized prompt
    const optimizedPrompt = promptManager.buildOptimizedPrompt({
      agentType: agentType,
      templateName: template,
      context,
      dynamicAdjustment: req.query.dynamicAdjustment === 'true',
    });

    logger.info('Prompt built successfully', {
      agentType,
      template,
    });

    sendSuccess(res, optimizedPrompt);
  } catch (error) {
    const { agentType, template, context } = req.body;

    // Basic structural validation for prompts build input
    const validation = validatePromptsBuildInput({ agentType, template, context });
    if (!validation.valid) {
      sendError(res, 'Invalid prompt build input', 400, validation.errors);
      return;
    }

    sendError(res, 'Failed to build prompt', 500, String(error));
  }
}

export async function getRecommendedTemplate(req: Request, res: Response): Promise<void> {
  try {
    const { agentType } = req.params;
    const { audience, constraints, feedback } = req.query;

    const recommended = promptManager.getRecommendedTemplate(
      agentType,
      {
        audience: audience as string,
        constraints: constraints ? (constraints as string).split(',') : undefined,
        feedback: feedback as string,
      },
    );

    sendSuccess(res, {
      agentType,
      recommendedTemplate: recommended,
    });
  } catch (error) {
    logger.error('Failed to get recommended template', error);
    sendError(res, 'Failed to get recommendation', 500, String(error));
  }
}

export async function exportAllPrompts(req: Request, res: Response): Promise<void> {
  try {
    const allPrompts = promptManager.exportAllPrompts();

    sendSuccess(res, {
      format: 'complete_prompt_library',
      exportedAt: new Date(),
      prompts: allPrompts,
    });
  } catch (error) {
    logger.error('Failed to export prompts', error);
    sendError(res, 'Failed to export prompts', 500, String(error));
  }
}
