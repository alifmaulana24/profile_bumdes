import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSession, saveSession, clearSession, getCredentials, hashPassword, initializeStorage } from '../utils/storage';

const AuthContext = createContext(null);

const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStorage();
    const stored = getSession();
    if (stored && stored.expiresAt > Date.now()) {
      setSession(stored);
    } else {
      clearSession();
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    const creds = getCredentials();
    const hashedInput = await hashPassword(password);
    // Cek apakah password cocok dengan hash, ATAU cocok dengan plain text (jika diubah manual di kode)
    if (username === creds.username && (hashedInput === creds.password || password === creds.password)) {
      const newSession = {
        token: Math.random().toString(36).substr(2, 16),
        username: creds.username,
        name: creds.name,
        expiresAt: Date.now() + SESSION_DURATION,
      };
      saveSession(newSession);
      setSession(newSession);
      return { success: true };
    }
    return { success: false, error: 'Username atau password salah.' };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const isAuthenticated = session && session.expiresAt > Date.now();

  return (
    <AuthContext.Provider value={{ session, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
