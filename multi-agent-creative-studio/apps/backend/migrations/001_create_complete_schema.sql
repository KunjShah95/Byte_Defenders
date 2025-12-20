-- Complete relational database schema for Byte_Defenders Motia backend
-- This creates normalized tables for sessions, ideas, critiques, refined ideas, and results
-- and an optional execution history table for observability.

-- Ensure Postgres has the pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

BEGIN;

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_prompt TEXT NOT NULL,
  constraints JSONB,
  style TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'initialized'
);

-- Ideas
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Critiques
CREATE TABLE IF NOT EXISTS critiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  strengths JSONB,
  weaknesses JSONB,
  improvement_suggestions JSONB,
  score INT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Refined ideas
CREATE TABLE IF NOT EXISTS refined_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
  original_idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,
  refined_content JSONB,
  improvements JSONB,
  original_score INT,
  refined_score INT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Results
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
  summary TEXT,
  top_ideas JSONB,
  all_ideas JSONB,
  recommendations JSONB,
  next_steps JSONB,
  presented_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Execution History
CREATE TABLE IF NOT EXISTS execution_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
  agent TEXT,
  context JSONB,
  timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Optional legacy state_store for compatibility with existing in-memory style persistence
CREATE TABLE IF NOT EXISTS state_store (
  id SERIAL PRIMARY KEY,
  collection_name TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  UNIQUE (collection_name, key)
);

COMMIT;
