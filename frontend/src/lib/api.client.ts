import axios from 'axios';
import { auth } from './firebase';

const apiClient = axios.create({
    baseURL: '/api/v1',
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
