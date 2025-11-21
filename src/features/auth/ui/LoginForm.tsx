import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Alert, Box, Stack } from '@mantine/core';
import {
  useAuthContext,
  VALIDATION_MESSAGES,
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
  ERROR_MESSAGES,
} from '../model';
import { ROUTES } from '@/shared';

export function LoginForm() {
  const navigate = useNavigate();
  const { state, login, clearError } = useAuthContext();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => {
        if (!value) {
          return VALIDATION_MESSAGES.EMAIL_REQUIRED;
        }
        return !EMAIL_REGEX.test(value) ? VALIDATION_MESSAGES.EMAIL_INVALID : null;
      },
      password: (value) => {
        if (!value) {
          return VALIDATION_MESSAGES.PASSWORD_REQUIRED;
        }
        return value.length < PASSWORD_MIN_LENGTH ? VALIDATION_MESSAGES.PASSWORD_TOO_SHORT : null;
      },
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (state.isAuthenticated && !state.isLoading) {
      navigate(ROUTES.MAIN);
    }
  }, [state.isAuthenticated, state.isLoading, navigate]);

  const handleSuccess = useCallback(
    async (values: typeof form.values) => {
      await login(values.email, values.password);
    },
    [form, login]
  );

  const handleErrors = useCallback(
    (errors: typeof form.errors) => {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        form.getInputNode(firstErrorKey)?.focus();
      }
    },
    [form]
  );

  const handleSubmit = form.onSubmit(handleSuccess, handleErrors);

  const handleFocus = useCallback(() => {
    clearError();
  }, [clearError]);

  const getServerErrorMessage = (): string => {
    if (!state.error) return '';
    return ERROR_MESSAGES[state.error] || ERROR_MESSAGES.UNKNOWN_ERROR;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} maw={400} mx="auto" py="xl">
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="your@email.com"
          key={form.key('email')}
          {...form.getInputProps('email')}
          disabled={state.isLoading}
          onFocus={handleFocus}
          w="100%"
        />
        <PasswordInput
          label="Пароль"
          placeholder="••••••••"
          key={form.key('password')}
          {...form.getInputProps('password')}
          disabled={state.isLoading}
          onFocus={handleFocus}
          w="100%"
        />
        {state.error && <Alert title={getServerErrorMessage()} color="red" mt="md" />}
        <Button
          type="submit"
          fullWidth
          loading={state.isLoading}
          disabled={!form.isValid() || state.isLoading}
          mt="md"
        >
          Войти
        </Button>
      </Stack>
    </Box>
  );
}
