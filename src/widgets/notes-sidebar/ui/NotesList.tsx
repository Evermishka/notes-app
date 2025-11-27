import { useRef, useCallback, useEffect } from 'react';
import { Stack, Text, Skeleton, Alert, ScrollArea } from '@mantine/core';
import { useNoteStore } from '@/entities/note';
import { useKeyboardNavigation } from '@/shared/hooks';
import { NoteItem } from './NoteItem';
import type { Note } from '@/entities/note';

interface NotesListProps {
  filteredNotes: Note[];
}

export const NotesList = ({ filteredNotes }: NotesListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { state, actions } = useNoteStore();
  const noteRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleNoteSelect = useCallback(
    (note: Note) => {
      actions.select(note);
    },
    [actions]
  );

  const selectedIndex = filteredNotes.findIndex((note) => note.id === state.selectedNote?.id);

  const { handleArrowUp, handleArrowDown } = useKeyboardNavigation({
    refs: noteRefs,
    length: filteredNotes.length,
    currentIndex: selectedIndex,
    setSelectedItem: actions.select,
    allItems: filteredNotes,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        actions.select(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [actions]);

  if (state.loading) {
    return (
      <Stack gap="xs">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} height={60} />
        ))}
      </Stack>
    );
  }

  if (state.error) {
    return (
      <Alert title="Ошибка" color="red">
        {state.error}
      </Alert>
    );
  }

  if (state.notes.length === 0) {
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
      aria-activedescendant={state.selectedNote?.id}
    >
      <Stack gap="xs">
        {filteredNotes.map((note: Note, index) => (
          <NoteItem
            id={note.id}
            key={note.id}
            note={note}
            isSelected={state.selectedNote?.id === note.id}
            onClick={() => handleNoteSelect(note)}
            ref={(el) => {
              noteRefs.current[index] = el;
            }}
            onArrowUp={handleArrowUp}
            onArrowDown={handleArrowDown}
            onEscape={() => actions.select(null)}
          />
        ))}
      </Stack>
    </ScrollArea>
  );
};
