import axios from 'axios';

const getBaseURL = () => {
    // If we're on Render or another platform, VITE_API_URL should be the full backend URL.
    // If not provided, we fall back to localhost for development.
    let rawUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000';

    // Remove any trailing slashes for consistency
    rawUrl = rawUrl.replace(/\/$/, '');

    const url = rawUrl.endsWith('/api') ? `${rawUrl}/` : `${rawUrl}/api/`;
    console.log('[API] Base URL initialized as:', url);
    return url;
};

export const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 15000,
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
