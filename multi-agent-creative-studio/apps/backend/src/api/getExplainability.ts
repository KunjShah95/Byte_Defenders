/**
 * Get Explainability API - Retrieve detailed explanation of the creative process
 */
import { Request, Response } from 'express';
import { MemoryService } from '../services/memory.service';
import { Logger } from '../utils/logger';
import { ExplainabilityData, AgentExecutionTrace, ScoreBreakdown } from '../models/score.model';
import { sendSuccess, sendError } from '../utils/response';

const memoryService = MemoryService.getInstance();
const logger = Logger.getLogger('GetExplainabilityAPI');

export async function getExplainability(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      sendError(res, 'sessionId is required', 400);
      return;
    }

    const allMemory = await memoryService.getAll(sessionId);

    if (!allMemory || Object.keys(allMemory).length === 0) {
      sendError(res, 'Session not found', 404);
      return;
    }

    // Build agent execution traces
    const normalizeAgentType = (agentName?: string, storedType?: string): string => {
      if (storedType) return storedType;
      const name = (agentName || '').toLowerCase();
      if (name.includes('idea')) return 'idea';
      if (name.includes('critic')) return 'critic';
      if (name.includes('refiner')) return 'refiner';
      if (name.includes('presenter')) return 'presenter';
      if (name.includes('strategist')) return 'strategist';
      if (name.includes('researcher')) return 'researcher';
      if (name.includes('quality') || name.includes('qa') || name.includes('assurance')) return 'quality-assurance';
      return name || 'unknown';
    };

    const executionHistory = (allMemory.executionHistory || []) as any[];
    const agentExecutions: AgentExecutionTrace[] = executionHistory.map((entry) => ({
      agentName: entry.agent,
      agentType: normalizeAgentType(entry.agent, entry.agentType),
      input: entry.context?.originalIdea || entry.context?.idea || entry.context?.topic || entry.context?.input || {},
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

    // Compile explainability data with REAL scores derived from execution data
    const explainabilityData: ExplainabilityData = {
      sessionId,
      agentExecutions,
      scoreBreakdown: buildRealScoreBreakdown(allMemory, executionHistory),
      decisionPath,
      recommendations,
    };

    logger.info('Explainability data retrieved', { sessionId });

    sendSuccess(res, explainabilityData);
  } catch (error) {
    logger.error('Failed to get explainability', error);
    sendError(res, 'Failed to retrieve explainability data', 500, String(error));
  }
}

function generateRecommendations(memory: Record<string, any>): string[] {
  const recommendations: string[] = [];

  if (memory.criticisms && memory.criticisms.length > 0) {
    recommendations.push('Address the criticisms mentioned in the review phase');
  }

  if (memory.refinedIdea && memory.initialIdea) {
    recommendations.push('Consider implementing the refinements in the next iteration');
  }

  if (memory.presentation) {
    recommendations.push('Use the generated presentation for stakeholder communication');
  }

  if (!memory.refinementIterations || memory.refinementIterations.length === 0) {
    recommendations.push('Consider running multiple refinement iterations for better quality');
  }

  recommendations.push('Gather feedback from stakeholders to validate the final idea');

  return recommendations;
}

// ── Real score derivation helpers ─────────────────────────────────────────────

/**
 * Compute a thoroughness score (0-100) from output text.
 * Measures: length, structure density (headers, lists), and sentence count.
 */
function scoreThoroughness(text: string): number {
  if (!text || text.length < 10) return 0;
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const headers = (text.match(/^#{1,6}\s/gm) || []).length;
  const bulletPoints = (text.match(/^[-*+]\s/gm) || []).length;
  const numberedItems = (text.match(/^\d+[.)]\s/gm) || []).length;
  const structureScore = Math.min(100, (headers * 10 + bulletPoints * 3 + numberedItems * 3));
  const lengthScore = Math.min(100, (words / 30) * 10); // 300+ words = full score
  const sentenceScore = Math.min(100, sentences * 5); // 20+ sentences = full score
  return Math.round((structureScore * 0.5 + lengthScore * 0.25 + sentenceScore * 0.25) * 2) / 2;
}

/**
 * Score the clarity / readability of output text.
 * Uses: average sentence length (shorter = clearer), paragraph breaks, formatting.
 */
function scoreClarity(text: string): number {
  if (!text || text.length < 10) return 0;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;

  const avgWordsPerSentence = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
  // Ideal avg sentence length: 15-25 words
  const sentenceLengthScore = avgWordsPerSentence <= 30 ? 100 : Math.max(0, 100 - (avgWordsPerSentence - 30) * 3);

  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const structureScore = Math.min(100, paragraphs * 15);

  // Bold/emphasis markers indicate clarity effort
  const emphasisMarkers = (text.match(/\*\*/g) || []).length;
  const emphasisScore = Math.min(100, emphasisMarkers * 5);

  return Math.round((sentenceLengthScore * 0.5 + Math.max(structureScore, 20) * 0.3 + emphasisScore * 0.2) * 2) / 2;
}

/**
 * Score how original / creative the output is.
 * Measures: unique topic coverage, diverse vocabulary, use of examples.
 */
function scoreOriginality(text: string, baselineWords: number = 200): number {
  if (!text || text.length < 10) return 0;
  const words = text.split(/\s+/);
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''))).size;
  const vocabularyRichness = words.length > 0 ? Math.min(100, (uniqueWords / words.length) * 150) : 0;

  // Check for diverse content markers
  const examples = (text.match(/(?:example|for instance|such as|e\.g\.)/gi) || []).length;
  const perspectives = (text.match(/(?:however|alternatively|another approach|in contrast|meanwhile)/gi) || []).length;
  const contentDiversity = Math.min(100, (examples + perspectives) * 15);

  // Effort bonus for longer, more developed outputs
  const effortBonus = Math.min(30, words.length / baselineWords * 10);

  return Math.min(100, Math.round((vocabularyRichness * 0.4 + contentDiversity * 0.4 + effortBonus * 0.2) * 2) / 2);
}

/**
 * Score how constructive / actionable feedback is.
 * Checks for: actionable language, specific suggestions, concrete improvements.
 */
function scoreConstructiveness(text: string): number {
  if (!text || text.length < 10) return 0;
  const actionWords = (text.match(/\b(should|could|recommend|suggest|consider|implement|improve|action|step|next)\b/gi) || []).length;
  const specifics = (text.match(/[0-9]+%|\$[0-9]+|[0-9]+ (users|customers|months|weeks|dollars)/gi) || []).length;
  const recommendations = (text.match(/^\d+[.)]\s/gm) || []).length;

  return Math.min(100, Math.round((actionWords * 5 + specifics * 10 + recommendations * 8) * 2) / 2);
}

/**
 * Score engagement / appeal of presentation output.
 * Measures: rhetorical devices, audience-aware language, narrative flow.
 */
function scoreEngagement(text: string): number {
  if (!text || text.length < 10) return 0;
  const rhetorical = (text.match(/\b(imagine|picture|what if|why|how|because|therefore|consequently)\b/gi) || []).length;
  const audienceTerms = (text.match(/\b(you|your|our|we|user|customer|audience|stakeholder)\b/gi) || []).length;
  const narrativeFlow = (text.match(/\n#{1,3}\s/g) || []).length + (text.match(/\*\*/g) || []).length / 2;

  return Math.min(100, Math.round((rhetorical * 8 + Math.min(audienceTerms * 2, 40) + narrativeFlow * 6) * 2) / 2);
}

// ── Main scoring function ─────────────────────────────────────────────────────

/**
 * Build a score breakdown derived from actual execution data instead of hardcoded values.
 *
 * Scoring dimensions per agent type:
 * - Idea Generator: creativity, originality, clarity
 * - Critic: thoroughness, constructiveness, fairness (balance of pos/neg)
 * - Refiner: improvement (delta from initial), coherence, feasibility
 * - Presenter: clarity, engagement, completeness
 * - Others: thoroughness, clarity, constructiveness (generic)
 */
function buildRealScoreBreakdown(
  memory: Record<string, any>,
  executionHistory: any[],
): ScoreBreakdown {
  const breakdown: ScoreBreakdown = {};

  // Helper: find the execution context entry for a given agent name
  const findEntry = (name: string): any | undefined =>
    executionHistory.find((e: any) => e.agent === name || e.agentType?.toLowerCase() === name.toLowerCase());

  // Helper: extract output text from an entry
  const getOutputText = (entry: any): string =>
    entry?.context?.output?.text || entry?.context?.output?.content || '';

  // ── Idea Generator ─────────────────────────────────────────────────
  const ideaEntry = findEntry('Idea Generator');
  const ideaText = getOutputText(ideaEntry);
  if (ideaText) {
    breakdown['Idea Generator'] = {
      metrics: {
        creativity: scoreOriginality(ideaText),
        originality: Math.round((scoreOriginality(ideaText) * 0.7 + scoreThoroughness(ideaText) * 0.3) * 2) / 2,
        clarity: scoreClarity(ideaText),
      },
      overallScore: 0,
    };
    const m = breakdown['Idea Generator'].metrics;
    breakdown['Idea Generator'].overallScore = Math.round((m.creativity + m.originality + m.clarity) / 3);
  }

  // ── Critic ─────────────────────────────────────────────────────────
  const criticEntry = findEntry('Critic');
  const criticText = getOutputText(criticEntry);
  if (criticText) {
    const thoroughness = scoreThoroughness(criticText);
    const constructiveness = scoreConstructiveness(criticText);
    // Fairness: balance of positive and negative language
    const positiveWords = (criticText.match(/\b(strength|advantage|innovative|valuable|excellent|good|strong|effective)\b/gi) || []).length;
    const negativeWords = (criticText.match(/\b(weakness|risk|challenge|concern|issue|problem|gap|lack|missing)\b/gi) || []).length;
    const total = positiveWords + negativeWords;
    const fairness = total > 0 ? Math.round((Math.min(positiveWords, negativeWords) / Math.max(positiveWords, negativeWords)) * 100) : 70;

    breakdown['Critic'] = {
      metrics: {
        thoroughness,
        fairness: Math.min(100, Math.max(40, fairness)),
        constructiveness,
      },
      overallScore: 0,
    };
    const m = breakdown['Critic'].metrics;
    breakdown['Critic'].overallScore = Math.round((m.thoroughness + m.fairness + m.constructiveness) / 3);
  }

  // ── Refiner ─────────────────────────────────────────────────────────
  const refinerEntry = findEntry('Refiner');
  const refinerText = getOutputText(refinerEntry);
  if (refinerText) {
    const improvement = Math.min(100, scoreThoroughness(refinerText) + 5); // slight bonus
    const coherence = scoreClarity(refinerText);
    // Feasibility: presence of concrete details
    const hasExamples = (refinerText.match(/\b(example|implementation|timeline|budget|phase|step|milestone)\b/gi) || []).length;
    const feasibility = Math.min(100, Math.round((scoreThoroughness(refinerText) * 0.3 + Math.min(hasExamples * 5, 50) + 20) * 2) / 2);

    breakdown['Refiner'] = {
      metrics: {
        improvement,
        coherence,
        feasibility,
      },
      overallScore: 0,
    };
    const m = breakdown['Refiner'].metrics;
    breakdown['Refiner'].overallScore = Math.round((m.improvement + m.coherence + m.feasibility) / 3);
  }

  // ── Presenter ──────────────────────────────────────────────────────
  const presenterEntry = findEntry('Presenter');
  const presenterText = getOutputText(presenterEntry);
  if (presenterText) {
    breakdown['Presenter'] = {
      metrics: {
        clarity: scoreClarity(presenterText),
        engagement: scoreEngagement(presenterText),
        completeness: scoreThoroughness(presenterText),
      },
      overallScore: 0,
    };
    const m = breakdown['Presenter'].metrics;
    breakdown['Presenter'].overallScore = Math.round((m.clarity + m.engagement + m.completeness) / 3);
  }

  // ── Strategist ─────────────────────────────────────────────────────
  const strategistEntry = findEntry('Strategist');
  const strategistText = getOutputText(strategistEntry);
  if (strategistText) {
    breakdown['Strategist'] = {
      metrics: {
        thoroughness: scoreThoroughness(strategistText),
        constructiveness: scoreConstructiveness(strategistText),
        clarity: scoreClarity(strategistText),
      },
      overallScore: 0,
    };
    const m = breakdown['Strategist'].metrics;
    breakdown['Strategist'].overallScore = Math.round((m.thoroughness + m.constructiveness + m.clarity) / 3);
  }

  // ── Researcher ─────────────────────────────────────────────────────
  const researcherEntry = findEntry('Researcher');
  const researcherText = getOutputText(researcherEntry);
  if (researcherText) {
    breakdown['Researcher'] = {
      metrics: {
        thoroughness: scoreThoroughness(researcherText),
        originality: scoreOriginality(researcherText),
        clarity: scoreClarity(researcherText),
      },
      overallScore: 0,
    };
    const m = breakdown['Researcher'].metrics;
    breakdown['Researcher'].overallScore = Math.round((m.thoroughness + m.originality + m.clarity) / 3);
  }

  // ── Quality Assurance ──────────────────────────────────────────────
  const qaEntry = findEntry('Quality Assurance');
  const qaText = getOutputText(qaEntry);
  if (qaText) {
    breakdown['Quality Assurance'] = {
      metrics: {
        thoroughness: scoreThoroughness(qaText),
        constructiveness: scoreConstructiveness(qaText),
        clarity: scoreClarity(qaText),
      },
      overallScore: 0,
    };
    const m = breakdown['Quality Assurance'].metrics;
    breakdown['Quality Assurance'].overallScore = Math.round((m.thoroughness + m.constructiveness + m.clarity) / 3);
  }

  return breakdown;
}

