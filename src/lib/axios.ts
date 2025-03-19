import axios from 'axios';
import { useAuthStore } from './store';

// Create axios instance with custom config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // Important for CORS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // console.log('Making request to:', config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    // console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data || error.message);
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const uploadsUrl = import.meta.env.VITE_UPLOADS_URL;
export default api; 