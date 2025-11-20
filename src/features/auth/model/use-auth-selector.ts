import { useMemo } from 'react';
import { useAuthStore } from './use-auth-store';
import type { AuthState } from './auth-types';

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
