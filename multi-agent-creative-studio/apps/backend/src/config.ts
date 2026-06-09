/**
 * Configuration - Environment and application settings
 */
import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates that required environment variables are set.
 * Logs warnings for missing non-critical vars and throws for critical ones.
 */
/** Skip validation when running in test mode — test fixtures provide mocks. */
const IS_TEST = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

function validateEnv(): void {
  if (IS_TEST) return;

  const missing: string[] = [];
  const warnings: string[] = [];

  // Critical: without these the app cannot function
  if (!process.env.GOOGLE_API_KEY && !process.env.OPENAI_API_KEY) {
    missing.push('GOOGLE_API_KEY or OPENAI_API_KEY (at least one AI provider key required)');
  }

  // Firebase auth is required for API authentication
  if (!process.env.FIREBASE_PROJECT_ID) warnings.push('FIREBASE_PROJECT_ID (API auth will fail without it)');
  if (!process.env.FIREBASE_CLIENT_EMAIL) warnings.push('FIREBASE_CLIENT_EMAIL (API auth will fail without it)');
  if (!process.env.FIREBASE_PRIVATE_KEY) warnings.push('FIREBASE_PRIVATE_KEY (API auth will fail without it)');

  // Supabase is needed if persistence mode is set to supabase
  if (process.env.PERSISTENCE_MODE === 'supabase') {
    if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL (required when PERSISTENCE_MODE=supabase)');
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      warnings.push('SUPABASE_SERVICE_ROLE_KEY (falling back to ANON_KEY - RLS policies may cause issues)');
    }
  }

  // Non-critical warnings
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.PERSISTENCE_MODE !== 'memory') {
    warnings.push('SUPABASE_SERVICE_ROLE_KEY not set — using ANON_KEY may cause RLS policy violations');
  }

  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\n   Copy .env.example to .env and fill in the values.');
    console.error('   See: multi-agent-creative-studio/.env.example\n');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Missing optional environment variables:');
    warnings.forEach(v => console.warn(`   - ${v}`));
    console.warn('');
  }
}

// Run validation immediately unless in test mode
validateEnv();

export interface PersistenceConfig {
  mode: string;
  redisHost: string;
  redisPort: number;
  postgresHost: string;
  postgresPort: number;
  postgresDb: string;
  postgresUser: string;
  postgresPassword: string;
  supabaseUrl: string;
  supabaseKey: string;
}

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // AI/GenAI
  genai: {
    openaiKey: process.env.OPENAI_API_KEY || '',
    googleKey: process.env.GOOGLE_API_KEY || '',
    baseURL: process.env.GENAI_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.GENAI_MODEL || 'gemini-2.0-flash-exp',
    provider: process.env.GENAI_PROVIDER || 'google', // openai | google | mock
    // In development, default to falling back to the mock provider if the
    // configured upstream provider is missing keys or errors.
    fallbackToMock:
      process.env.GENAI_FALLBACK_TO_MOCK === 'true' ||
      (process.env.NODE_ENV || 'development') === 'development',
  },

  // Moti (Backend)
  moti: {
    apiKey: process.env.MOTI_API_KEY || '',
    baseURL: process.env.MOTI_BASE_URL || 'http://localhost:8000',
    enabled: process.env.MOTI_ENABLED === 'true' || false,
  },

  // CORS
  cors: {
    origin: [
      ...(process.env.CORS_ORIGIN || '').split(','),
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5175',
      'http://localhost:8080',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:8080'
    ].filter(Boolean),
    credentials: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Persistence configuration (DB-backed storage)
  persistence: {
    mode: process.env.PERSISTENCE_MODE || 'memory', // 'memory' | 'redis' | 'postgres' | 'supabase'
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
    postgresHost: process.env.POSTGRES_HOST || 'localhost',
    postgresPort: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    postgresDb: process.env.POSTGRES_DB || 'creative_studio',
    postgresUser: process.env.POSTGRES_USER || 'postgres',
    postgresPassword: process.env.POSTGRES_PASSWORD || 'postgres',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
  },

  // Firebase Admin for Auth
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '')
      .replace(/^"|"$/g, '')
      .replace(/\\n/g, '\n'),
  },
};

export default config;

