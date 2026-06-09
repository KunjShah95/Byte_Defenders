/**
 * Health endpoint tests.
 */
import { describe, it, expect } from 'vitest';
import request from 'supertest';

// Import the Express app — config is already loaded by test-setup.ts
import app from '../index';

describe('GET /health', () => {
  it('returns 200 with status healthy', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('status', 'healthy');
    expect(res.body.data).toHaveProperty('uptime');
  });

  it('returns a valid ISO timestamp', async () => {
    const res = await request(app).get('/health');
    expect(() => new Date(res.body.meta.timestamp)).not.toThrow();
  });
});

describe('GET /', () => {
  it('returns welcome message with endpoints', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('message');
    expect(res.body.data).toHaveProperty('endpoints');
    expect(res.body.data.endpoints).toHaveProperty('health');
    expect(res.body.data.endpoints).toHaveProperty('sessions');
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/this-does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Not Found');
    expect(res.body.meta).toHaveProperty('status', 404);
  });
});
