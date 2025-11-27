import { Stack } from '@mantine/core';
import { useEditorMode } from '@/features/note-editor';
import { useNoteSearch } from '@/features/note-search';
import { SearchBar } from '@/features/note-search';
import { AddNoteButton } from './AddNoteButton';
import { NotesList } from './NotesList';

export const Sidebar = () => {
  const { setEditMode } = useEditorMode();
  const { setSearchQuery, filteredNotes } = useNoteSearch();

  return (
    <Stack p="md" gap="md" w="100%" h="100vh">
      <AddNoteButton onNoteAdded={setEditMode} />
      <SearchBar onSearchChange={setSearchQuery} />
      <NotesList filteredNotes={filteredNotes} />
    </Stack>
  );
};
