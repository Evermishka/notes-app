import { useEffect, useRef, useState } from 'react';
import { AppShell, Burger, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/notes-sidebar';
import { NoteWorkspace } from '@/widgets/note-workspace';
import { useNoteStore } from '@/entities/note';
import { SIZES, NOTES_LOAD_ERROR_TITLE, NOTES_LOAD_ERROR_MESSAGE } from '@/shared/config';

export const MainPage = () => {
  const [opened, setOpened] = useState(false);
  const { state, actions } = useNoteStore();
  const toggleDrawer = () => setOpened((o) => !o);
  const lastErrorRef = useRef<string | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    void actions.load().catch((error) => {
      console.error('Failed to load notes:', error);
    });
  }, [actions]);

  useEffect(() => {
    if (!state.error) {
      lastErrorRef.current = null;
      return;
    }
    if (state.notes.length > 0 || lastErrorRef.current === state.error) return;

    lastErrorRef.current = state.error;
    console.error('Failed to load notes:', state.error);
    notifications.show({
      title: NOTES_LOAD_ERROR_TITLE,
      message: state.error ?? NOTES_LOAD_ERROR_MESSAGE,
      color: 'red',
    });
  }, [state.error, state.notes.length]);

  return (
    <>
      <AppShell
        padding="md"
        header={{ height: SIZES.headerHeight }}
        navbar={{
          width: SIZES.navbarWidth,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Group justify="space-between">
            <Burger opened={opened} onClick={toggleDrawer} hiddenFrom="sm" size="sm" />
            <Header />
          </Group>
        </AppShell.Header>

        <AppShell.Navbar>
          <Sidebar />
        </AppShell.Navbar>

        <AppShell.Main>
          <NoteWorkspace />
        </AppShell.Main>
      </AppShell>
    </>
  );
};
