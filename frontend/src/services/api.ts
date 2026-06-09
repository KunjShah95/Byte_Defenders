import { auth } from '@/lib/firebase';

// In dev, Vite can proxy `/api` to the backend.
// In prod/preview, the proxy is not present, so prefer an explicit base URL.
export const API_BASE: string = (import.meta as { env: Record<string, string | undefined> }).env?.VITE_API_BASE_URL || '/api/v1';

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

async function getAuthToken(): Promise<string | null> {
  if (!auth) return null;
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers as Record<string, string>,
  };

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
      // Response body is not JSON — ignore parsing error
    }
    throw new ApiError(response.status, response.statusText, errorMessage);
  }

  const text = await response.text();
  if (!text) {
    // Handle empty response by treating as null
    return null as unknown as T;
  }

  try {
    return JSON.parse(text);
  } catch {
    // Response body is not valid JSON — return null
    return null as unknown as T;
  }
}

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

export function subscribeToEvents(onEvent: (event: { type: string; data: unknown }) => void): () => void {
  // Use fetch-based SSE with auth headers (EventSource can't send custom headers)
  let abortController = new AbortController();
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 10;

  async function connect() {
    abortController = new AbortController();

    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/events/subscribe`, {
        headers,
        signal: abortController.signal,
      });

      if (!response.ok) {
        // Auth failed or rate limited — exponential backoff
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        reconnectAttempts++;
        if (reconnectAttempts <= maxReconnectAttempts) {
          reconnectTimer = setTimeout(connect, delay);
        }
        return;
      }

      reconnectAttempts = 0; // Reset on successful connection

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Stream ended — treat as disconnection and reconnect
          throw new Error('Stream ended');
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              onEvent(data);
            } catch {
              // Skip malformed events
            }
          }
        }
      }
    } catch (error: unknown) {
      const err = error as { name?: string };
      if (err.name === 'AbortError') return;
      // Connection lost — reconnect with backoff
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      reconnectAttempts++;
      if (reconnectAttempts <= maxReconnectAttempts) {
        reconnectTimer = setTimeout(connect, delay);
      }
    }
  }

  connect();

  return () => {
    abortController.abort();
    if (reconnectTimer) clearTimeout(reconnectTimer);
  };
}

export default api;
