import { useState } from 'react';
import { AppShell, Burger, Group } from '@mantine/core';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/notes-sidebar';
import { NoteWorkspace } from '@/widgets/note-workspace';
import { SIZES } from '@/shared/config';

export const MainPage = () => {
  const [opened, setOpened] = useState(false);
  const toggleDrawer = () => setOpened((o) => !o);

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
