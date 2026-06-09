/**
 * Session API tests.
 *
 * These tests use the 'mock' GenAI provider (set in test-setup.ts) so no
 * real API keys or network calls are required. The mock provider returns
 * deterministic responses.
 *
 * In test mode (NODE_ENV=test), the auth middleware falls back to a
 * dev-user bypass when Firebase is not configured, so requests succeed
 * rather than returning 401. These tests verify the full request/response
 * lifecycle works end-to-end in development/test mode.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('Session lifecycle (dev bypass mode)', () => {
  const testTopic = 'Create a sustainable food delivery platform';

  it('creates a session and returns 201 with session data', async () => {
    const res = await request(app)
      .post('/api/v1/sessions')
      .send({
        userId: 'test-user',
        title: 'Test Session',
        description: testTopic,
      });

    // In test mode, auth bypasses with dev-user, so session is created
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('status', 'active');
  }, 15_000);

  it('runs quick workflow and returns result', async () => {
    // Create a session first
    const createRes = await request(app)
      .post('/api/v1/sessions')
      .send({
        userId: 'test-user',
        title: 'Workflow Test',
        description: testTopic,
      });

    const sessionId = createRes.body.data.id;

    const res = await request(app)
      .post(`/api/v1/sessions/${sessionId}/workflow/quick`)
      .send({ topic: testTopic });

    expect(res.status).toBe(200);
  }, 15_000);
});

describe('Session API (dev bypass mode)', () => {
  it('GET /api/v1/sessions returns session list', async () => {
    const res = await request(app).get('/api/v1/sessions');
    // In test mode, auth bypasses, returns sessions (may be empty array)
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('GET /api/v1/sessions/:id returns 404 for non-existent session', async () => {
    const res = await request(app).get('/api/v1/sessions/some-id');
    expect(res.status).toBe(404);
  });
});

describe('Explainability (dev bypass mode)', () => {
  it('GET explainability returns 404 for non-existent session', async () => {
    const res = await request(app).get('/api/v1/sessions/fake/explainability');
    expect(res.status).toBe(404);
  });
});
