import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
  try {
    const stored = localStorage.getItem('user');
    return stored && stored !== 'undefined'
      ? JSON.parse(stored)
      : null;
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((data) => {
        setUser(data.user ?? data);
        localStorage.setItem('user', JSON.stringify(data.user ?? data));
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

const login = async (credentials) => {
  const data = await authApi.login(credentials);
  const authenticatedUser = data.user ?? data;

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(authenticatedUser));

  setUser(authenticatedUser);

  return authenticatedUser;
};

const register = async (payload) => {
  const data = await authApi.register(payload);
  const authenticatedUser = data.user ?? data;

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(authenticatedUser));

  setUser(authenticatedUser);

  return authenticatedUser;
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};