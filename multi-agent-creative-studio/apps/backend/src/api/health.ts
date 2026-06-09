/**
 * Health & Diagnostics API
 *
 * Provides endpoints for checking service health and environment configuration.
 * The /health/config endpoint exposes which services are set up WITHOUT
 * revealing secret values — it only shows whether required env vars are
 * configured (SET) or missing (MISSING).
 */
import { Request, Response } from 'express';
import { config } from '../config';
import { Logger } from '../utils/logger';
import * as admin from 'firebase-admin';
import { sendSuccess, sendError } from '../utils/response';

const logger = Logger.getLogger('HealthAPI');

/** Status string used in diagnostics. Never contains the actual secret value. */
type VarStatus = 'SET' | 'MISSING';

interface EnvVarCheck {
  name: string;
  status: VarStatus | string;
  required: boolean;
}

function checkVar(value: string | undefined, name: string, required: boolean): EnvVarCheck {
  return {
    name,
    status: value ? 'SET' as const : 'MISSING' as const,
    required,
  };
}

/** Check whether any GenAI key is configured (string-valued property). */
function hasGenAiKey(): boolean {
  return !!(config.genai.openaiKey || config.genai.googleKey);
}

// ── GET /health/config — full environment diagnostics ──────────────────────
export async function getConfig(req: Request, res: Response): Promise<void> {
  try {
    // Check Firebase Admin env vars — values NOT revealed
    const firebaseConfig: EnvVarCheck[] = [
      checkVar(config.firebase.projectId, 'FIREBASE_PROJECT_ID', true),
      checkVar(config.firebase.clientEmail, 'FIREBASE_CLIENT_EMAIL', true),
      checkVar(config.firebase.privateKey, 'FIREBASE_PRIVATE_KEY', true),
    ];

    const genaiConfig: EnvVarCheck[] = [
      checkVar(config.genai.openaiKey, 'OPENAI_API_KEY', false),
      checkVar(config.genai.googleKey, 'GOOGLE_API_KEY', false),
    ];

    const persistenceConfig: EnvVarCheck[] = [
      { name: 'PERSISTENCE_MODE', status: config.persistence.mode || 'NOT_SET', required: false },
      checkVar(config.persistence.supabaseUrl, 'SUPABASE_URL', false),
      checkVar(config.persistence.supabaseKey, 'SUPABASE_SERVICE_ROLE_KEY', false),
    ];

    // Check Firebase Admin initialization
    let firebaseAdminStatus: string;
    try {
      firebaseAdminStatus = admin.apps.length > 0 ? 'INITIALIZED' : 'NOT_INITIALIZED';
    } catch {
      firebaseAdminStatus = 'ERROR';
    }

    // Overall health assessment (backend-side only)
    const requiredFirebaseSet = firebaseConfig.every(v => v.status === 'SET');
    const overallStatus = requiredFirebaseSet ? 'READY' : 'MISCONFIGURED' as string;

    sendSuccess(res, {
      status: overallStatus,
      environment: config.nodeEnv,
      services: {
        firebaseAdmin: firebaseAdminStatus,
        genai: hasGenAiKey() ? 'CONFIGURED' : 'MISSING',
        genaiProvider: config.genai.provider || 'NOT_SET',
        genaiModel: config.genai.model || 'NOT_SET',
        genaiFallbackToMock: config.genai.fallbackToMock ? 'ENABLED' : 'DISABLED',
        persistenceMode: config.persistence.mode,
        corsOrigins: config.cors.origin,
      },
      configuration: {
        firebase: firebaseConfig,
        genai: genaiConfig,
        persistence: persistenceConfig,
      },
      auth: {
        backendFirebaseReady: requiredFirebaseSet,
        devModeBypass: config.nodeEnv === 'development' || process.env.NODE_ENV === 'test',
      },
      recommendations: buildRecommendations(firebaseConfig, hasGenAiKey(), firebaseAdminStatus),
    });
  } catch (error) {
    logger.error('Health config check failed', error);
    sendError(res, 'Failed to check configuration', 500, String(error));
  }
}

function buildRecommendations(
  firebase: EnvVarCheck[],
  hasGenAi: boolean,
  adminStatus: string,
): string[] {
  const recs: string[] = [];
  const missingFirebase = firebase.filter(v => v.status === 'MISSING');
  if (missingFirebase.length > 0) {
    recs.push(`Set the following Firebase Admin env vars: ${missingFirebase.map(v => v.name).join(', ')}`);
    recs.push('Create a Firebase service account at https://console.firebase.google.com → Project Settings → Service Accounts → Generate new private key');
  }
  if (adminStatus === 'NOT_INITIALIZED' && missingFirebase.length === 0) {
    recs.push('Firebase Admin credentials are set but not initializing. Check the private key format (must use \\\\n for newlines).');
  }    if (!hasGenAi) {
    recs.push('No AI provider API key configured. If you are developing locally, set GENAI_PROVIDER=mock to skip needing an API key. Otherwise set GOOGLE_API_KEY or OPENAI_API_KEY.');
  }
  if (recs.length === 0) {
    recs.push('All services appear configured correctly.');
  }
  return recs;
}
