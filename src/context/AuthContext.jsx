import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, onUnauthorized } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ status: 'loading', admin: null, error: null });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => { setAuth({ status: 'loading', admin: null, error: null }); setAttempt((value) => value + 1); }, []);

  useEffect(() => onUnauthorized(() => setAuth({ status: 'unauthenticated', admin: null, error: null })), []);

  useEffect(() => {
    const controller = new AbortController();
    api('/auth/me', { signal: controller.signal }).then(
      ({ admin }) => { if (!controller.signal.aborted) setAuth({ status: 'authenticated', admin, error: null }); },
      (error) => {
        if (!controller.signal.aborted) setAuth({ status: error.status === 401 ? 'unauthenticated' : 'error', admin: null, error: error.status === 401 ? null : error });
      },
    );
    return () => controller.abort();
  }, [attempt]);

  async function login(email, password) {
    const { admin } = await api('/auth/login', { method: 'POST', body: { email, password } });
    setAuth({ status: 'authenticated', admin, error: null });
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' });
    setAuth({ status: 'unauthenticated', admin: null, error: null });
  }

  return <AuthContext.Provider value={{ ...auth, login, logout, retry }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
