import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { useAuth } from '@/features/auth';
import { Group, Button, Text, Box } from '@mantine/core';
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  WifiIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import notesIcon from '@/assets/notes.svg';
import {
  APP_NAME,
  ROUTES,
  HEADER_AUTH_BUTTON_TEXT,
  HEADER_AUTH_BUTTON_VARIANT,
  HEADER_AUTH_BUTTON_ARIA,
  ICON_SIZE,
} from '@/shared/config';
import { useSyncStatus } from '@/shared/services/syncService';

export const Header = () => {
  const isTiny = useMediaQuery('(max-width: 350px)');
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  if (isTiny) return <TinyHeader />;
  if (isMobile) return <MobileHeader />;
  if (isTablet) return <TabletHeader />;
  return <DesktopHeader />;
};

const TabletHeader = () => {
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
  const queueBadgeTitle = syncStatus.processing
    ? 'Синхронизация выполняется'
    : `Изменений ожидают синхронизации: ${syncStatus.queueLength}`;

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

      {/* Правая часть: статусы + кнопки авторизации */}
      <Group align="center" gap="md">
        {/* Статусная панель */}
        <Group align="center" gap="xs">
          <Group align="center" gap={4}>
            {syncStatus.online ? (
              <WifiIcon
                width={16}
                height={16}
                color="var(--mantine-color-secondary-5)"
                title="Онлайн"
              />
            ) : (
              <ExclamationTriangleIcon
                width={16}
                height={16}
                color="var(--mantine-color-danger-5)"
                title="Офлайн"
              />
            )}
          </Group>

          {shouldShowQueueBadge && (
            <Group align="center" gap={4}>
              {syncStatus.processing ? (
                <ArrowPathIcon
                  width={14}
                  height={14}
                  color="var(--mantine-color-neutral-6)"
                  style={{
                    animation: 'spin 1s linear infinite',
                  }}
                  title={queueBadgeTitle}
                />
              ) : (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'var(--mantine-color-neutral-5)',
                  }}
                  title={queueBadgeTitle}
                />
              )}
            </Group>
          )}
        </Group>

        {/* Кнопки авторизации */}
        <Group gap="xs">
          {isAuthenticated ? (
            <Button
              variant={HEADER_AUTH_BUTTON_VARIANT.logout}
              leftSection={
                <ArrowRightStartOnRectangleIcon
                  width={ICON_SIZE}
                  height={ICON_SIZE}
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
              leftSection={
                <ArrowLeftEndOnRectangleIcon
                  width={ICON_SIZE}
                  height={ICON_SIZE}
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

const DesktopHeader = () => {
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
  const queueBadgeLabel = syncStatus.processing ? 'Синхр.' : 'Ожидают';
  const queueBadgeTitle = syncStatus.processing
    ? 'Синхронизация выполняется'
    : `Изменений ожидают синхронизации: ${syncStatus.queueLength}`;

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

      {/* Правая часть: статусы + кнопки авторизации */}
      <Group align="center" gap="md">
        {/* Статусная панель */}
        <Group align="center" gap="xs">
          <Group align="center" gap={4}>
            {syncStatus.online ? (
              <WifiIcon width={16} height={16} color="var(--mantine-color-secondary-5)" />
            ) : (
              <ExclamationTriangleIcon
                width={16}
                height={16}
                color="var(--mantine-color-danger-5)"
              />
            )}
            <Text size="sm" c={syncStatus.online ? 'secondary' : 'danger'} fw={500}>
              {syncStatus.online ? 'Онлайн' : 'Офлайн'}
            </Text>
          </Group>

          {shouldShowQueueBadge && (
            <Group align="center" gap={4}>
              {syncStatus.processing ? (
                <ArrowPathIcon
                  width={14}
                  height={14}
                  color="var(--mantine-color-neutral-6)"
                  style={{
                    animation: 'spin 1s linear infinite',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'var(--mantine-color-neutral-5)',
                  }}
                />
              )}
              <Text size="sm" c="neutral.6" fw={500} title={queueBadgeTitle}>
                {queueBadgeLabel}
              </Text>
            </Group>
          )}
        </Group>

        {/* Кнопки авторизации */}
        <Group gap="xs">
          {isAuthenticated ? (
            <Button
              variant={HEADER_AUTH_BUTTON_VARIANT.logout}
              leftSection={
                <ArrowRightStartOnRectangleIcon
                  width={ICON_SIZE}
                  height={ICON_SIZE}
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
              leftSection={
                <ArrowLeftEndOnRectangleIcon
                  width={ICON_SIZE}
                  height={ICON_SIZE}
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

const TinyHeader = () => {
  const navigate = useNavigate();
  const { state, logout } = useAuth();
  const syncStatus = useSyncStatus();

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.LOGIN);
  }, [logout, navigate]);

  const handleLogin = useCallback(() => {
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  const isAuthenticated = state.isAuthenticated;
  const hasQueueItems = syncStatus.queueLength > 0 || syncStatus.processing;

  return (
    <Group
      justify="space-between"
      align="center"
      px="xs"
      py="xs"
      mb="xs"
      style={{ flexGrow: 1, minWidth: 0 }}
    >
      {/* Левая часть: только логотип */}
      <Group gap="xs" align="center" style={{ flexShrink: 0 }}>
        <Box
          component="img"
          src={notesIcon}
          alt="Notes App логотип"
          w={24} // еще более уменьшенный размер
          h={24}
          style={{ objectFit: 'contain' }}
        />
        <Text fw={600} size="sm" c="inherit" style={{ whiteSpace: 'nowrap' }}>
          {APP_NAME}
        </Text>
      </Group>

      {/* Правая часть: только статус и кнопка авторизации */}
      <Group align="center" gap="xs" style={{ flexShrink: 0 }}>
        {/* Статусная панель */}
        <Group align="center" gap="xs">
          {/* Иконка онлайн/офлайн */}
          {syncStatus.online ? (
            <WifiIcon
              width={14}
              height={14}
              color="var(--mantine-color-secondary-5)"
              title="Онлайн"
            />
          ) : (
            <ExclamationTriangleIcon
              width={14}
              height={14}
              color="var(--mantine-color-danger-5)"
              title="Офлайн"
            />
          )}

          {/* Индикатор очереди */}
          {hasQueueItems && (
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: syncStatus.processing
                  ? 'var(--mantine-color-secondary-5)'
                  : 'var(--mantine-color-neutral-5)',
                animation: syncStatus.processing ? 'spin 1s linear infinite' : 'none',
              }}
              title={syncStatus.processing ? 'Синхронизация...' : 'Ожидают синхронизации'}
            />
          )}
        </Group>

        {/* Кнопка авторизации без текста */}
        {isAuthenticated ? (
          <Button
            variant="light"
            size="xs"
            w={32}
            h={32}
            p={0}
            leftSection={
              <ArrowRightStartOnRectangleIcon width={14} height={14} aria-hidden="true" />
            }
            onClick={handleLogout}
            aria-label="Выход"
          />
        ) : (
          <Button
            variant="filled"
            size="xs"
            w={32}
            h={32}
            p={0}
            leftSection={<ArrowLeftEndOnRectangleIcon width={14} height={14} aria-hidden="true" />}
            onClick={handleLogin}
            aria-label="Войти"
          />
        )}
      </Group>
    </Group>
  );
};

const MobileHeader = () => {
  const navigate = useNavigate();
  const { state, logout } = useAuth();
  const syncStatus = useSyncStatus();

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.LOGIN);
  }, [logout, navigate]);

  const handleLogin = useCallback(() => {
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  const isAuthenticated = state.isAuthenticated;
  const hasQueueItems = syncStatus.queueLength > 0 || syncStatus.processing;

  return (
    <Group
      justify="space-between"
      align="center"
      px="md"
      py="sm"
      mb="sm"
      style={{ flexGrow: 1, minWidth: 0 }}
    >
      {/* Левая часть: только логотип */}
      <Group gap="xs" align="center" style={{ flexShrink: 0 }}>
        <Box
          component="img"
          src={notesIcon}
          alt="Notes App логотип"
          w={28} // уменьшенный размер
          h={28}
          style={{ objectFit: 'contain' }}
        />
        <Text fw={600} size="md" c="inherit" style={{ whiteSpace: 'nowrap' }}>
          {APP_NAME}
        </Text>
      </Group>

      {/* Правая часть: только статус и кнопка авторизации */}
      <Group align="center" gap="sm" style={{ flexShrink: 0 }}>
        {/* Статусная панель */}
        <Group align="center" gap="xs">
          {/* Иконка онлайн/офлайн */}
          {syncStatus.online ? (
            <WifiIcon
              width={16}
              height={16}
              color="var(--mantine-color-secondary-5)"
              title="Онлайн"
            />
          ) : (
            <ExclamationTriangleIcon
              width={16}
              height={16}
              color="var(--mantine-color-danger-5)"
              title="Офлайн"
            />
          )}

          {/* Индикатор очереди */}
          {hasQueueItems && (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: syncStatus.processing
                  ? 'var(--mantine-color-secondary-5)'
                  : 'var(--mantine-color-neutral-5)',
                animation: syncStatus.processing ? 'spin 1s linear infinite' : 'none',
              }}
              title={syncStatus.processing ? 'Синхронизация...' : 'Ожидают синхронизации'}
            />
          )}
        </Group>

        {/* Кнопка авторизации */}
        {isAuthenticated ? (
          <Button
            variant="light"
            size="xs"
            leftSection={
              <ArrowRightStartOnRectangleIcon width={16} height={16} aria-hidden="true" />
            }
            onClick={handleLogout}
            aria-label="Выход"
          >
            Выход
          </Button>
        ) : (
          <Button
            variant="filled"
            size="xs"
            leftSection={<ArrowLeftEndOnRectangleIcon width={16} height={16} aria-hidden="true" />}
            onClick={handleLogin}
            aria-label="Вход"
          >
            Войти
          </Button>
        )}
      </Group>
    </Group>
  );
};
