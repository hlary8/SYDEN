import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
          original._retry = true;
          try {
            const { data } = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });
            localStorage.setItem('accessToken', data.accessToken);
            setAccessToken(data.accessToken);
            original.headers.Authorization = `Bearer ${data.accessToken}`;
            return axios(original);
          } catch {
            localStorage.removeItem('accessToken');
            setAccessToken(null);
            setUser(null);
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Fetch current user on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken) {
        try {
          const res = await axios.get('/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setUser(res.data.user);
        } catch (err) {
          console.error('Auth check failed', err);
          setAccessToken(null);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [accessToken]);

  const login = async (email, password) => {
    const res = await axios.post('/api/v1/auth/login', { email, password }, { withCredentials: true });
    setAccessToken(res.data.accessToken);
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (username, email, password, role = 'user') => {
    const res = await axios.post('/api/v1/auth/register', { username, email, password, role }, { withCredentials: true });
    setAccessToken(res.data.accessToken);
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await axios.post('/api/v1/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error', err);
    }
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
