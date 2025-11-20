import { type ReactNode, useEffect, useMemo } from 'react';
import { AuthContext } from '../model/auth-context';
import { useAuthActions } from '../model/use-auth-actions';
import { useAuthSelector } from '../model/use-auth-selector';
import { useAuthStore } from '../model/use-auth-store';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const store = useAuthStore();
  const state = useAuthSelector(store);
  const actions = useAuthActions(store);

  const { checkAuth } = actions;

  const value = useMemo(
    () => ({
      state,
      ...actions,
    }),
    [state, actions]
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
