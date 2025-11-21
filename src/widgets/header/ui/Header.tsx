import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/features';
import { Group, Button, Text, Box } from '@mantine/core';
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import notesIcon from '@/assets/notes.svg';
import { APP_NAME, ROUTES } from '@/shared';

export function Header() {
  const navigate = useNavigate();
  const { state, logout } = useAuthContext();

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.LOGIN);
  }, [logout, navigate]);

  const handleLogin = useCallback(() => {
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  const isAuthenticated = state.isAuthenticated;

  return (
    <Group justify="space-between" align="center" h="60px" px="md" py="sm">
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
            variant="light"
            size="sm"
            leftSection={
              <ArrowRightStartOnRectangleIcon width={18} height={18} aria-hidden="true" />
            }
            onClick={handleLogout}
            aria-label="Выход из аккаунта"
          >
            Выход
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            leftSection={<ArrowLeftEndOnRectangleIcon width={18} height={18} aria-hidden="true" />}
            onClick={handleLogin}
            aria-label="Вход в аккаунт"
          >
            Войти
          </Button>
        )}
      </Group>
    </Group>
  );
}
