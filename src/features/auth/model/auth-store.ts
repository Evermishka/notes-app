import { createContext, useState, useCallback, useMemo, useContext, useRef } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import type { User } from '@/entities/user';
import { AuthService } from '../api';
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
  const [tokenStorage, setTokenStorage, removeTokenStorage] = useLocalStorage({
    key: 'authToken',
  });

  const [userStorage, setUserStorage, removeUserStorage] = useLocalStorage({
    key: 'authUser',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const authServiceRef = useRef(new AuthService());

  // State
  const getCurrentUser = useCallback((): User | null => {
    if (!userStorage) return null;
    try {
      return JSON.parse(userStorage) as User;
    } catch (error) {
      console.error('Не удалось распарсить пользователя из localStorage:', error);
      return null;
    }
  }, [userStorage]);

  const user = getCurrentUser();
  const token = tokenStorage || null;
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
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // Валидация происходит на уровне UI формы
        // Здесь мы просто делаем API call
        const { user, token } = await authServiceRef.current.login(email, password);

        setUserStorage(JSON.stringify(user));
        setTokenStorage(token);
        setIsLoading(false);
      } catch (err) {
        console.error('Ошибка при login:', err);
        if (err instanceof Error && err.message === 'WRONG_CREDENTIALS') {
          setError('WRONG_CREDENTIALS');
        } else {
          setError('UNKNOWN_ERROR');
        }
        setIsLoading(false);
      }
    },
    [setUserStorage, setTokenStorage]
  );

  const logout = useCallback(() => {
    removeTokenStorage();
    removeUserStorage();
    setError(null);
  }, [removeTokenStorage, removeUserStorage]);

  const checkAuth = useCallback(() => {
    const token = tokenStorage;
    const user = getCurrentUser();

    if ((token && !user) || (!token && user)) {
      removeTokenStorage();
      removeUserStorage();
    }
  }, [tokenStorage, getCurrentUser, removeTokenStorage, removeUserStorage]);

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
