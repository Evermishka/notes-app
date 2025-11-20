import type { User } from '@/entities';

export type AuthError =
  | 'INVALID_EMAIL'
  | 'INVALID_PASSWORD'
  | 'EMPTY_FIELDS'
  | 'WRONG_CREDENTIALS'
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
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
};
