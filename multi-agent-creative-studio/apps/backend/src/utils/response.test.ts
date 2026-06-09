import { describe, it, expect, vi } from 'vitest';

/**
 * Minimal mock for Express Response.
 * We test sendSuccess / sendError in isolation by capturing the calls
 * to .status() and .json().
 */
function mockRes() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { status, json } as unknown as any;
}

// Dynamic import because the module may use relative imports internally.
import { sendSuccess, sendError } from './response';

describe('sendSuccess', () => {
  it('sends a 200 response with data and meta by default', () => {
    const res = mockRes();
    sendSuccess(res, { hello: 'world' });

    expect(res.status).toHaveBeenCalledWith(200);
    const call = res.status.mock.results[0].value.json.mock.calls[0][0];
    expect(call.data).toEqual({ hello: 'world' });
    expect(call.meta).toBeDefined();
    expect(call.meta.timestamp).toBeDefined();
  });

  it('sends a 201 response when status is provided', () => {
    const res = mockRes();
    sendSuccess(res, { id: 'abc' }, 201);

    expect(res.status).toHaveBeenCalledWith(201);
    const call = res.status.mock.results[0].value.json.mock.calls[0][0];
    expect(call.data).toEqual({ id: 'abc' });
  });

  it('includes extra meta when provided', () => {
    const res = mockRes();
    sendSuccess(res, [], 200, { pagination: { page: 1, total: 5 } });

    const call = res.status.mock.results[0].value.json.mock.calls[0][0];
    expect(call.meta.pagination).toEqual({ page: 1, total: 5 });
  });
});

describe('sendError', () => {
  it('sends a 500 response with error and meta by default', () => {
    const res = mockRes();
    sendError(res, 'Something went wrong');

    expect(res.status).toHaveBeenCalledWith(500);
    const call = res.status.mock.results[0].value.json.mock.calls[0][0];
    expect(call.error).toBe('Something went wrong');
    expect(call.meta.status).toBe(500);
    expect(call.meta.timestamp).toBeDefined();
  });

  it('sends a 400 response with details', () => {
    const res = mockRes();
    const details = ['name is required'];
    sendError(res, 'Validation failed', 400, details);

    expect(res.status).toHaveBeenCalledWith(400);
    const call = res.status.mock.results[0].value.json.mock.calls[0][0];
    expect(call.error).toBe('Validation failed');
    expect(call.details).toEqual(details);
    expect(call.meta.status).toBe(400);
  });

  it('includes requestId in meta when provided', () => {
    const res = mockRes();
    sendError(res, 'Not found', 404, undefined, 'req-123');

    const call = res.status.mock.results[0].value.json.mock.calls[0][0];
    expect(call.meta.requestId).toBe('req-123');
  });
});
