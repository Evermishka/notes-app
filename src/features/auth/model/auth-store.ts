import { createContext, useState, useCallback, useMemo, useContext, useRef } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import type { User } from '@/entities/user';
import { AuthService } from '../api';
import type { AuthError, AuthState, AuthContextType } from './types';

// Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Store Hook

export const useAuthStore = () => {
  const [tokenStorage, setTokenStorage, removeTokenStorage] = useLocalStorage({
    key: 'authToken',
  });

  const [userStorage, setUserStorage, removeUserStorage] = useLocalStorage({
    key: 'authUser',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const getCurrentUser = useCallback((): User | null => {
    if (!userStorage) return null;
    try {
      return JSON.parse(userStorage) as User;
    } catch (error) {
      console.error('Не удалось распарсить пользователя из localStorage:', error);
      return null;
    }
  }, [userStorage]);

  const getCurrentToken = useCallback((): string | null => {
    return tokenStorage;
  }, [tokenStorage]);

  const store = useMemo(
    () => ({
      token: {
        get: getCurrentToken,
        set: setTokenStorage,
        remove: removeTokenStorage,
      },
      user: {
        get: getCurrentUser,
        set: setUserStorage,
        remove: removeUserStorage,
      },
      isLoading,
      error,
      setIsLoading,
      setError,
    }),
    [
      getCurrentToken,
      setTokenStorage,
      removeTokenStorage,
      getCurrentUser,
      setUserStorage,
      removeUserStorage,
      isLoading,
      error,
    ]
  );

  return store;
};

// Selector
export const useAuthSelector = (store: ReturnType<typeof useAuthStore>): AuthState => {
  const user = store.user.get();
  const token = store.token.get();
  const isAuthenticated = Boolean(token && user);

  return useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading: store.isLoading,
      error: store.error,
    }),
    [user, token, isAuthenticated, store.isLoading, store.error]
  );
};

// Actions
export const useAuthActions = (store: ReturnType<typeof useAuthStore>) => {
  const authServiceRef = useRef(new AuthService());

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      store.setIsLoading(true);
      store.setError(null);

      try {
        // Валидация происходит на уровне UI формы
        // Здесь мы просто делаем API call
        const { user, token } = await authServiceRef.current.login(email, password);

        store.user.set(JSON.stringify(user));
        store.token.set(token);
        store.setIsLoading(false);
      } catch (err) {
        console.error('Ошибка при login:', err);
        if (err instanceof Error && err.message === 'WRONG_CREDENTIALS') {
          store.setError('WRONG_CREDENTIALS');
        } else {
          store.setError('UNKNOWN_ERROR');
        }
        store.setIsLoading(false);
      }
    },
    [store]
  );

  const logout = useCallback(() => {
    store.token.remove();
    store.user.remove();
    store.setError(null);
  }, [store]);

  const checkAuth = useCallback(() => {
    const token = store.token.get();
    const user = store.user.get();

    if ((token && !user) || (!token && user)) {
      store.token.remove();
      store.user.remove();
    }
  }, [store]);

  const clearError = useCallback(() => {
    store.setError(null);
  }, [store]);

  return {
    login,
    logout,
    checkAuth,
    clearError,
  };
};

// Public Hook
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
