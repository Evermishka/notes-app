import { type ReactNode, useEffect, useRef } from 'react';
import { AuthContext, useAuthContext } from '../model/auth-store';
import { syncService } from '@/shared/services/syncService';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const value = useAuthContext();
  const { checkAuth, state } = value;
  const hasDownloadedRef = useRef(false);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  // Загружаем данные из Firebase после авторизации
  useEffect(() => {
    if (state.isAuthenticated && !hasDownloadedRef.current) {
      hasDownloadedRef.current = true;
      void syncService.downloadFromFirebase().catch((error) => {
        console.error('Failed to download notes from Firebase:', error);
      });
    }
  }, [state.isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
