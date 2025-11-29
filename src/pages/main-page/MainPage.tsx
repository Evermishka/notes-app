import { useEffect, useRef, useState } from 'react';
import { AppShell, Burger, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/notes-sidebar';
import { NoteWorkspace } from '@/widgets/note-workspace';
import { useNotesError, useNoteDispatch } from '@/entities/note';
import {
  SIZES,
  RESPONSIVE_SIZES,
  NOTES_LOAD_ERROR_TITLE,
  NOTES_LOAD_ERROR_MESSAGE,
} from '@/shared/config';
import { useAuth } from '@/features/auth';
import { EditorModeProvider } from '@/features/note-editor';

export const MainPage = () => {
  const [opened, setOpened] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  // const loading = useNotesLoading(); // Не используется в текущей реализации
  const error = useNotesError();
  const { actions } = useNoteDispatch();
  const {
    state: { isAuthenticated },
  } = useAuth();
  const toggleDrawer = () => setOpened((o) => !o);
  const lastErrorRef = useRef<string | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      hasLoadedRef.current = false;
      return;
    }
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    void actions.load().catch((error) => {
      console.error('Failed to load notes:', error);
    });
  }, [actions, isAuthenticated]);

  useEffect(() => {
    if (!error) {
      lastErrorRef.current = null;
      return;
    }
    if (lastErrorRef.current === error) return;

    lastErrorRef.current = error;
    console.error('Failed to load notes:', error);
    notifications.show({
      title: NOTES_LOAD_ERROR_TITLE,
      message: error ?? NOTES_LOAD_ERROR_MESSAGE,
      color: 'danger',
    });
  }, [error]);

  return (
    <EditorModeProvider>
      <AppShell
        padding="md"
        header={{ height: RESPONSIVE_SIZES.headerHeight.base }}
        navbar={{
          width: SIZES.navbarWidth,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Group justify="space-between" align="center" px={{ base: 'xs', sm: 'md' }}>
            <Burger
              opened={opened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
              size="lg"
              p="sm"
              style={{ flexShrink: 0 }}
            />
            <Header />
          </Group>
        </AppShell.Header>

        <AppShell.Navbar>
          <Sidebar
            onDrawerClose={() => {
              // Only close drawer on mobile (when it's overlay)
              if (isMobile) {
                setOpened(false);
              }
            }}
          />
        </AppShell.Navbar>

        <AppShell.Main>
          <NoteWorkspace />
        </AppShell.Main>
      </AppShell>
    </EditorModeProvider>
  );
};
