import { useRef, useCallback, useEffect } from 'react';
import { Stack, Text, Skeleton, Alert, ScrollArea } from '@mantine/core';
import {
  useNoteStore,
  selectNotes,
  selectLoading,
  selectError,
  selectSelectedNote,
} from '@/entities/note';
import { useNoteCrud } from '@/features/note-crud';
import { useKeyboardNavigation } from '@/shared/hooks';
import { NoteItem } from './NoteItem';
import type { Note } from '@/entities/note';

interface NotesListProps {
  filteredNotes: Note[];
}

export const NotesList = ({ filteredNotes }: NotesListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { state } = useNoteStore();
  const allNotes = selectNotes(state);
  const isLoading = selectLoading(state);
  const currentError = selectError(state);
  const selectedNote = selectSelectedNote(state);
  const { setSelectedNote } = useNoteCrud();
  const noteRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleNoteSelect = useCallback(
    (note: Note) => {
      setSelectedNote(note);
    },
    [setSelectedNote]
  );

  const selectedIndex = filteredNotes.findIndex((note) => note.id === selectedNote?.id);

  const { handleArrowUp, handleArrowDown } = useKeyboardNavigation({
    refs: noteRefs,
    length: filteredNotes.length,
    currentIndex: selectedIndex,
    setSelectedItem: setSelectedNote,
    allItems: filteredNotes,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedNote(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedNote]);

  if (isLoading) {
    return (
      <Stack gap="xs">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} height={60} />
        ))}
      </Stack>
    );
  }

  if (currentError) {
    return (
      <Alert title="Ошибка" color="red">
        {currentError}
      </Alert>
    );
  }

  if (allNotes.length === 0) {
    return (
      <Stack align="center" justify="center" gap="md" py="xl">
        <Text c="dimmed">Нет заметок</Text>
      </Stack>
    );
  }

  return (
    <ScrollArea
      h="calc(100vh - 200px)"
      ref={scrollAreaRef}
      role="listbox"
      aria-activedescendant={selectedNote?.id}
    >
      <Stack gap="xs">
        {filteredNotes.map((note: Note, index) => (
          <NoteItem
            id={note.id}
            key={note.id}
            note={note}
            isSelected={selectedNote?.id === note.id}
            onClick={() => handleNoteSelect(note)}
            ref={(el) => {
              noteRefs.current[index] = el;
            }}
            onArrowUp={handleArrowUp}
            onArrowDown={handleArrowDown}
            onEscape={() => setSelectedNote(null)}
          />
        ))}
      </Stack>
    </ScrollArea>
  );
};
