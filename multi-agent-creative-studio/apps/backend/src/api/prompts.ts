/**
 * Prompts Management API
 */
import { Request, Response } from 'express';
import { PromptManagerService } from '../services/promptManager.service';
import { Logger } from '../utils/logger';
import { validatePromptsBuildInput } from '../middlewares/validation';

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
      res.status(404).json({
        error: `No prompts found for agent type: ${agentType}`,
      });
      return;
    }

    res.json({
      agentType,
      templates,
      totalCount: templates.length,
    });
  } catch (error) {
    logger.error('Failed to get available prompts', error);
    res.status(500).json({
      error: 'Failed to retrieve prompts',
      details: String(error),
    });
  }
}

export async function getPromptStats(req: Request, res: Response): Promise<void> {
  try {
    const stats = promptManager.getPromptStats();
    res.json(stats);
  } catch (error) {
    logger.error('Failed to get prompt stats', error);
    res.status(500).json({
      error: 'Failed to retrieve prompt statistics',
      details: String(error),
    });
  }
}

export async function buildPrompt(req: Request, res: Response): Promise<void> {
  try {
    const { agentType, template, context } = req.body;

    if (!agentType || !template || !context) {
      res.status(400).json({
        error: 'agentType, template, and context are required',
      });
      return;
    }

    // Validate configuration
    const configValidation = promptManager.validatePromptConfig({
      agentType: agentType,
      templateName: template,
      context,
    });

    if (!configValidation.valid) {
      res.status(400).json({
        error: 'Invalid prompt configuration',
        details: configValidation.errors,
      });
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

    res.json(optimizedPrompt);
  } catch (error) {
    const { agentType, template, context } = req.body;

    // Basic structural validation for prompts build input
    const validation = validatePromptsBuildInput({ agentType, template, context });
    if (!validation.valid) {
      res.status(400).json({ error: 'Invalid prompt build input', details: validation.errors });
      return;
    }

    res.status(500).json({
      error: 'Failed to build prompt',
      details: String(error),
    });
  }
}

export async function getRecommendedTemplate(req: Request, res: Response): Promise<void> {
  try {
    const { agentType } = req.params;
    const { audience, constraints, feedback } = req.query;

    if (!agentType) {
      res.status(400).json({
        error: 'agentType parameter is required',
      });
      return;
    }

    const recommended = promptManager.getRecommendedTemplate(
      agentType,
      {
        audience: audience as string,
        constraints: constraints ? (constraints as string).split(',') : undefined,
        feedback: feedback as string,
      },
    );

    res.json({
      agentType,
      recommendedTemplate: recommended,
    });
  } catch (error) {
    logger.error('Failed to get recommended template', error);
    res.status(500).json({
      error: 'Failed to get recommendation',
      details: String(error),
    });
  }
}

export async function exportAllPrompts(req: Request, res: Response): Promise<void> {
  try {
    const allPrompts = promptManager.exportAllPrompts();

    res.json({
      format: 'complete_prompt_library',
      exportedAt: new Date(),
      prompts: allPrompts,
    });
  } catch (error) {
    logger.error('Failed to export prompts', error);
    res.status(500).json({
      error: 'Failed to export prompts',
      details: String(error),
    });
  }
}
