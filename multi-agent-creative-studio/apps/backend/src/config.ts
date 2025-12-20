/**
 * Configuration - Environment and application settings
 */
import dotenv from 'dotenv';

dotenv.config();

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
    model: process.env.GENAI_MODEL || 'gemini-3-pro-preview',
    provider: process.env.GENAI_PROVIDER || 'google', // openai | google | mock
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
    supabaseKey: process.env.SUPABASE_ANON_KEY || '',
  },

  // Firebase Admin for Auth
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  },
};

export default config;

