import { createContext, useState, useCallback, useMemo, useContext, useEffect } from 'react';
import type { User } from '@/shared/db';
import { firebaseService, FirebaseServiceError } from '@/shared/services/firebaseService';
import type { AuthError, AuthState, AuthContextType } from './types';

// Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Публичный хук для компонентов
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth должен быть использован внутри <AuthProvider>. ' +
        'Убедитесь, что ваше приложение обёрнуто в AuthProvider.'
    );
  }

  return context;
};

// Хук для создания значения контекста (используется в AuthProvider)
export const useAuthContext = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChanged(
      ({ user: nextUser, token: nextToken, error }) => {
        setUser(nextUser);
        setToken(nextToken);
        if (error) {
          setError(mapAuthError(error));
        } else {
          setError(null);
        }
      }
    );
    return unsubscribe;
  }, []);

  const isAuthenticated = Boolean(token && user);

  const state: AuthState = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      error,
    }),
    [user, token, isAuthenticated, isLoading, error]
  );

  // Actions
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await firebaseService.login(email, password);
      setUser(result.user);
      setToken(result.token);
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await firebaseService.logout();
      setUser(null);
      setToken(null);
      setError(null);
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await firebaseService.checkAuth();
      setError(null);
      setUser(result?.user ?? null);
      setToken(result?.token ?? null);
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return useMemo(
    () => ({
      state,
      login,
      logout,
      checkAuth,
      clearError,
    }),
    [state, login, logout, checkAuth, clearError]
  );
};

const mapAuthError = (error: unknown): AuthError => {
  if (error instanceof FirebaseServiceError) {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'INVALID_EMAIL';
      case 'auth/wrong-password':
        return 'INVALID_PASSWORD';
      case 'auth/user-not-found':
      case 'auth/user-disabled':
      case 'auth/invalid-credential':
      case 'auth/expired-action-code':
      case 'auth/too-many-requests':
        return 'WRONG_CREDENTIALS';
      case 'auth/network-request-failed':
        return 'NETWORK_ERROR';
      default:
        return 'UNKNOWN_ERROR';
    }
  }

  if (error instanceof Error && error.message === 'EMPTY_FIELDS') {
    return 'EMPTY_FIELDS';
  }

  return 'UNKNOWN_ERROR';
};
