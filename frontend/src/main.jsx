import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'

const queryClient = new QueryClient();

// Configure axios to use deployed backend URL and send cookies
const getApiBase = () => {
  const configured = (import.meta.env.VITE_API_URL || import.meta.env.BACKEND_URL || '').replace(/\/$/, '');

  if (configured) {
    return configured.endsWith('/api/v1') ? configured : `${configured}/api/v1`;
  }

  const host = window.location.hostname;
  const isRenderFrontend = host === 'deleon1.onrender.com' || host === 'www.deleon1.onrender.com';

  if (host === 'localhost' || host === '127.0.0.1' || host.includes('0.0.0.0')) {
    return 'http://localhost:4000/api/v1';
  }

  if (isRenderFrontend) {
    return 'https://deleon.onrender.com/api/v1';
  }

  return `${window.location.origin}/api/v1`;
};

const API_BASE = getApiBase();
axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

// Avoid duplicate "/api/v1/api/v1" when some code uses full API_BASE and others use relative "/api/v1/"
axios.interceptors.request.use((config) => {
  if (API_BASE.endsWith('/api/v1') && config.url && config.url.startsWith('/api/v1')) {
    config.url = config.url.replace(/^\/api\/v1/, '');
  }
  
  // Attach token from localStorage as fallback
  const token = localStorage.getItem('accessToken');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response interceptor: catch 401 and redirect to login
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.config?.url || '';
    const isAuthRequest = /\/auth\//.test(url) || window.location.pathname.includes('/auth/');

    if (error.response && error.response.status === 401 && !isAuthRequest) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.replace('/auth/login');
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
