import axios from 'axios';
import { auth } from './firebase';

// In dev, Vite can proxy `/api` to the backend.
// In prod/preview, the proxy is not present, so prefer an explicit base URL.
const API_BASE: string = ((import.meta as { env: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL) || '/api/v1';

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
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout:', error.config?.url);
            return Promise.reject(new Error('Request timeout. Please try again.'));
        }
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
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
