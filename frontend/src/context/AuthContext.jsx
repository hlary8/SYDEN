import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const getStoredToken = () => localStorage.getItem('token') || localStorage.getItem('accessToken');

const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};

const decodeJwt = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${('00' + char.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token) => {
  if (!token) return true;
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

const updateAccessTokenHeader = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    setStoredToken(token);
  } else {
    delete axios.defaults.headers.common.Authorization;
    setStoredToken(null);
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(() => {
    const token = getStoredToken();
    return token && !isTokenExpired(token) ? token : null;
  });

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      if (!config.headers) config.headers = {};
      const token = getStoredToken();
      if (token && !isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
          original._retry = true;
          try {
            const { data } = await axios.post('/auth/refresh', {}, { withCredentials: true });
            const nextToken = data.token || data.accessToken;
            if (!nextToken) throw new Error('No token received');
            updateAccessTokenHeader(nextToken);
            setAccessToken(nextToken);
            original.headers.Authorization = `Bearer ${nextToken}`;
            return axios(original);
          } catch {
            updateAccessTokenHeader(null);
            setAccessToken(null);
            setUser(null);
            if (!window.location.pathname.includes('/auth/login')) {
              window.location.href = '/auth/login';
            }
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (!token || isTokenExpired(token)) {
      updateAccessTokenHeader(null);
      setAccessToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = res.data?.user || JSON.parse(localStorage.getItem('user') || 'null');
        if (userData) setUser(userData);
      } catch (err) {
        console.error('Auth check failed', err);
        updateAccessTokenHeader(null);
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [accessToken]);

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password }, { withCredentials: true });
    const token = res.data.token || res.data.accessToken;
    const userData = res.data.user;
    if (token) {
      updateAccessTokenHeader(token);
      setAccessToken(token);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    return userData;
  };

  const register = async (username, email, password, role = 'user') => {
    const res = await axios.post('/auth/register', { username, email, password, role }, { withCredentials: true });
    const token = res.data.token || res.data.accessToken;
    const userData = res.data.user;
    if (token) {
      updateAccessTokenHeader(token);
      setAccessToken(token);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    return userData;
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error', err);
    }
    updateAccessTokenHeader(null);
    setUser(null);
    setAccessToken(null);
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
