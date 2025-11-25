import { Stack } from '@mantine/core';
import { AddNoteButton, NotesList, SearchBar } from '@/features/notes-crud';

export const Sidebar = () => {
  return (
    <Stack p="md" gap="md" w="100%" h="100vh">
      <AddNoteButton />
      <SearchBar />
      <NotesList />
    </Stack>
  );
};
