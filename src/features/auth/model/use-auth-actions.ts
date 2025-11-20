import { useCallback, useRef } from 'react';
import { AuthService } from '../api';
import { useAuthStore } from './use-auth-store';

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
