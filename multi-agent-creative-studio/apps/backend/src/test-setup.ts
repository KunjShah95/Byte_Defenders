/**
 * Test setup — runs before every test file.
 *
 * - Sets NODE_ENV=test so config.validateEnv() is skipped
 * - Provides sensible defaults for env vars the app expects
 * - Suppresses noisy logs during test runs
 */

process.env.NODE_ENV = 'test';
process.env.VITEST = 'true';

// Provide minimal env vars to prevent runtime errors
process.env.GENAI_PROVIDER = 'mock';
process.env.PORT = '0'; // random port — supertest handles this
process.env.LOG_LEVEL = 'silent';
process.env.PERSISTENCE_MODE = 'memory';
process.env.CORS_ORIGIN = 'http://localhost:5173';

// Suppress console output during tests (re-enable per-test by mocking)
global.console.log = () => {};
global.console.warn = () => {};
global.console.info = () => {};
// Keep console.error for failed assertions
