import type { User } from '@/db';

export type AuthError =
  | 'INVALID_EMAIL'
  | 'INVALID_PASSWORD'
  | 'EMPTY_FIELDS'
  | 'WRONG_CREDENTIALS'
  | 'NETWORK_ERROR'
  | 'STORAGE_ERROR'
  | 'UNKNOWN_ERROR';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
};

export type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
};
