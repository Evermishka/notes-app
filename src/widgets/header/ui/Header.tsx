import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Badge, Group, Button, Text, Box } from '@mantine/core';
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
import { useSyncStatus } from '@/shared/services/syncService';

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
  const syncStatus = useSyncStatus();
  const shouldShowQueueBadge = syncStatus.queueLength > 0 || syncStatus.processing;
  const queueBadgeLabel = syncStatus.processing ? 'Синхр.' : 'Изменения';
  const queueBadgeTitle = syncStatus.processing
    ? 'Синхронизация выполняется'
    : `В очереди ${syncStatus.queueLength}`;
  const queueBadgeColor = syncStatus.processing ? 'yellow' : 'gray';

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

      <Group align="center" spacing="xs">
        <Group align="center" spacing={2} style={{ flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
          <Badge
            color={syncStatus.online ? 'green' : 'red'}
            variant="filled"
            size="xs"
            sx={{ textTransform: 'none' }}
          >
            {syncStatus.online ? 'Онлайн' : 'Офлайн'}
          </Badge>
          {shouldShowQueueBadge && (
            <Badge
              color={queueBadgeColor}
              variant="light"
              size="xs"
              title={queueBadgeTitle}
              sx={{ textTransform: 'none' }}
            >
              {queueBadgeLabel}
            </Badge>
          )}
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
    </Group>
  );
};
