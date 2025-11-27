export const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export const PASSWORD_MIN_LENGTH = 6;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email обязателен',
  EMAIL_INVALID: 'Некорректный email',
  PASSWORD_REQUIRED: 'Пароль обязателен',
  PASSWORD_TOO_SHORT: `Пароль должен содержать минимум ${PASSWORD_MIN_LENGTH} символов`,
} as const;

export const ERROR_MESSAGES: Record<
  | 'INVALID_EMAIL'
  | 'INVALID_PASSWORD'
  | 'EMPTY_FIELDS'
  | 'WRONG_CREDENTIALS'
  | 'STORAGE_ERROR'
  | 'UNKNOWN_ERROR',
  string
> = {
  INVALID_EMAIL: 'Некорректный email',
  INVALID_PASSWORD: `Пароль должен содержать минимум ${PASSWORD_MIN_LENGTH} символов`,
  EMPTY_FIELDS: 'Заполните все поля',
  WRONG_CREDENTIALS: 'Неверный логин или пароль',
  STORAGE_ERROR: 'Ошибка при работе с хранилищем',
  UNKNOWN_ERROR: 'Ошибка при входе. Попробуйте позже',
} as const;
