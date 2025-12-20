import { auth } from '@/lib/firebase';

// API configuration
const API_BASE = '/api/v1'; // Force proxy usage to bypass CORS

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(status: number, statusText: string, message?: string) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

// Get auth token from Firebase
async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
}

// Base fetch function with auth and error handling
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers as Record<string, string>,
  };

  // Add auth token if not skipped
  if (!options?.skipAuth) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    let errorMessage: string | undefined;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error;
    } catch {
      // Response is not JSON
    }
    throw new ApiError(response.status, response.statusText, errorMessage);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text);
}

// API methods
export const api = {
  get: <T>(endpoint: string, skipAuth = false) =>
    fetchApi<T>(endpoint, { skipAuth }),

  post: <T>(endpoint: string, data: unknown, skipAuth = false) =>
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth,
    }),

  put: <T>(endpoint: string, data: unknown, skipAuth = false) =>
    fetchApi<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      skipAuth,
    }),

  delete: <T>(endpoint: string, skipAuth = false) =>
    fetchApi<T>(endpoint, {
      method: 'DELETE',
      skipAuth,
    }),
};

// Session API
export const sessionApi = {
  create: (data: { userId: string; title: string; description?: string; metadata?: Record<string, unknown> }) =>
    api.post<{ sessionId: string; session: unknown }>('/sessions', data),

  get: (sessionId: string) =>
    api.get<{ session: unknown }>(`/sessions/${sessionId}`),

  getAll: () =>
    api.get<{ sessions: unknown[] }>('/sessions'),

  runQuickWorkflow: (sessionId: string, topic: string) =>
    api.post<{ result: unknown }>(`/sessions/${sessionId}/workflow/quick`, { topic }),

  runFullWorkflow: (sessionId: string, data: { topic: string; audience?: string }) =>
    api.post<{ result: unknown }>(`/sessions/${sessionId}/workflow/full`, data),

  getResult: (sessionId: string) =>
    api.get<{ result: unknown }>(`/sessions/${sessionId}/result`),

  getExplainability: (sessionId: string) =>
    api.get<{ explainability: unknown }>(`/sessions/${sessionId}/explainability`),
};

// SSE Events subscription
export function subscribeToEvents(onEvent: (event: { type: string; data: unknown }) => void): () => void {
  const eventSource = new EventSource(`${API_BASE}/events/subscribe`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onEvent(data);
    } catch (error) {
      console.error('Failed to parse SSE event:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('SSE connection error:', error);
  };

  // Return cleanup function
  return () => {
    eventSource.close();
  };
}

export default api;
