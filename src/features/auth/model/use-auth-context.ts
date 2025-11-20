import { useContext } from 'react';
import { AuthContext } from './auth-context';
import type { AuthState } from './auth-types';

export type UseAuthContextReturn = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
};

export const useAuthContext = (): UseAuthContextReturn => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuthContext должен быть использован внутри <AuthProvider>. ' +
        'Убедитесь, что ваше приложение обёрнуто в AuthProvider.'
    );
  }

  return context;
};
