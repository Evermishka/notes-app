import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Group, Button, Text, Box } from '@mantine/core';
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import notesIcon from '@/assets/notes.svg';
import {
  APP_NAME,
  ROUTES,
  HEADER_AUTH_BUTTON_TEXT,
  HEADER_AUTH_BUTTON_VARIANT,
  HEADER_AUTH_BUTTON_ARIA,
  HEADER_AUTH_BUTTON_SIZE,
  HEADER_ICON_SIZE,
} from '@/shared/config';

export const Header = () => {
  const navigate = useNavigate();
  const { state, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.LOGIN);
  }, [logout, navigate]);

  const handleLogin = useCallback(() => {
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  const isAuthenticated = state.isAuthenticated;

  return (
    <Group justify="space-between" align="center" px="md" py="sm" style={{ flexGrow: '1' }}>
      {/* Левая часть: иконка и название */}
      <Group gap="xs" align="center">
        <Box
          component="img"
          src={notesIcon}
          alt="Notes App логотип"
          w={32}
          h={32}
          style={{
            objectFit: 'contain',
          }}
        />
        <Text fw={500} size="lg" c="inherit">
          {APP_NAME}
        </Text>
      </Group>

      {/* Правая часть: кнопки авторизации */}
      <Group gap="xs">
        {isAuthenticated ? (
          <Button
            variant={HEADER_AUTH_BUTTON_VARIANT.logout}
            size={HEADER_AUTH_BUTTON_SIZE}
            leftSection={
              <ArrowRightStartOnRectangleIcon
                width={HEADER_ICON_SIZE}
                height={HEADER_ICON_SIZE}
                aria-hidden="true"
              />
            }
            onClick={handleLogout}
            aria-label={HEADER_AUTH_BUTTON_ARIA.logout}
          >
            {HEADER_AUTH_BUTTON_TEXT.logout}
          </Button>
        ) : (
          <Button
            variant={HEADER_AUTH_BUTTON_VARIANT.login}
            size={HEADER_AUTH_BUTTON_SIZE}
            leftSection={
              <ArrowLeftEndOnRectangleIcon
                width={HEADER_ICON_SIZE}
                height={HEADER_ICON_SIZE}
                aria-hidden="true"
              />
            }
            onClick={handleLogin}
            aria-label={HEADER_AUTH_BUTTON_ARIA.login}
          >
            {HEADER_AUTH_BUTTON_TEXT.login}
          </Button>
        )}
      </Group>
    </Group>
  );
};
