import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['apps/backend/src/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    // Run tests in sequence to avoid port conflicts
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    setupFiles: ['./apps/backend/src/test-setup.ts'],
    // 30s timeout for workflow tests that call mocked AI
    testTimeout: 30_000,
    hookTimeout: 15_000,
  },
  // Prevent Vitest from resolving production tsconfig exclude patterns
  server: {
    watch: null,
  },
});
