import { type ReactNode, useEffect } from 'react';
import { AuthContext, useAuthContext } from '../model/auth-store';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const value = useAuthContext();
  const { checkAuth } = value;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
