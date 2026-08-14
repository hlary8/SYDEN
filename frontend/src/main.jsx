import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'

const queryClient = new QueryClient();

// Configure axios to use deployed backend URL and send cookies
const API_BASE = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '');
axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

// Avoid duplicate "/api/v1/api/v1" when some code uses full API_BASE and others use relative "/api/v1/"
axios.interceptors.request.use((config) => {
  if (API_BASE.endsWith('/api/v1') && config.url && config.url.startsWith('/api/v1')) {
    config.url = config.url.replace(/^\/api\/v1/, '');
  }
  return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
