import { useState, useEffect } from 'react';
import { AppShell, Burger, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/notes-sidebar';
import { NoteWorkspace } from '@/widgets/note-workspace';
import { useNoteDispatch } from '@/entities/note';
import { SIZES } from '@/shared/config';

export const MainPage = () => {
  const [opened, setOpened] = useState(false);
  const { actions } = useNoteDispatch();
  const toggleDrawer = () => setOpened((o) => !o);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        await actions.load();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Не удалось загрузить заметки';
        console.error('Failed to load notes:', error);
        notifications.show({
          title: 'Ошибка загрузки',
          message: errorMessage,
          color: 'red',
        });
      }
    };
    loadNotes();
  }, [actions]);

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
