import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch (_) {}
    try {
      localStorage.removeItem('hasloged');
    } catch (_) {}
    setUser(null);
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.auth.me();
      setUser(data);
    } catch {
      await logout();
    }
  }, [logout]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.auth.me();
        if (!cancelled) setUser(data);
      } catch {
        await logout();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
