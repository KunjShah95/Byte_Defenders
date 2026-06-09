import axios, { AxiosResponse } from 'axios';
import { auth } from './firebase';

// In dev, Vite can proxy `/api` to the backend.
// In prod/preview, the proxy is not present, so prefer an explicit base URL.
const API_BASE: string = ((import.meta as { env: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL) || '/api/v1';

/** Augment AxiosResponse to carry the unwrapped metadata alongside response data. */
interface ResponseWithMeta<T = unknown> extends Omit<AxiosResponse<T>, 'data'> {
  data: T;
  _meta?: Record<string, unknown>;
}

const apiClient = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
});

apiClient.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        // Unwrap standardized API envelope { data, meta } → just data
        // Preserve meta as a custom property so pagination info is accessible
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
            const meta = response.data.meta;
            response.data = response.data.data;
            (response as ResponseWithMeta)._meta = meta;
        }
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout:', error.config?.url);
            return Promise.reject(new Error('Request timeout. Please try again.'));
        }
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            const message = data?.error || error.response.statusText;

            if (status === 401) {
                console.error('Auth Error (401):', message);
                return Promise.reject(new Error(
                    'Authentication failed. Make sure Firebase is configured on the server. ' +
                    'Visit /health to check server configuration.'
                ));
            }
            if (status === 500 && message?.includes('Firebase not configured')) {
                console.error('Server not configured for auth:', message);
                return Promise.reject(new Error(
                    'The server is not configured for authentication. ' +
                    'Please set up Firebase Admin credentials on the backend server.'
                ));
            }
            console.error('API Error:', status, data);
            return Promise.reject(error);
        } else if (error.request) {
            console.error('Network Error:', error.message);
            return Promise.reject(new Error('Network error. Please check if the backend server is running.'));
        } else {
            console.error('Error:', error.message);
            return Promise.reject(error);
        }
    }
);

export default apiClient;
