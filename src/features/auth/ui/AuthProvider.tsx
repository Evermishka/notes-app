import { type ReactNode, useEffect, useMemo } from 'react';
import { useAuthStore, useAuthSelector, useAuthActions, AuthContext } from '../model';

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
