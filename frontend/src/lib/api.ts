import axios from 'axios';

export const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '') + '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global 401 handler — clear stale credentials and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('vendor');
            // Only redirect if not already on the login page to avoid loops
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
