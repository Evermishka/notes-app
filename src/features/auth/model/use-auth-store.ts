import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import type { User } from '@/entities/user';
import type { AuthError } from './auth-types';

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
      setIsLoading,
      setError,
    ]
  );

  return store;
};
