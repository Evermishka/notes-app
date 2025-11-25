import { useRef, useCallback, useEffect } from 'react';
import { useNotesSelectors, useNotesContext } from '@/features/notes-crud';
import { useKeyboardNavigation } from '@/shared/hooks/useKeyboardNavigation';
import { Stack, Text, Skeleton, Alert, ScrollArea } from '@mantine/core';
import { NoteItem } from './NoteItem';
import type { Note } from '@/entities/note';

export const NotesList = () => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { allNotes, isLoading, currentError } = useNotesSelectors();
  const { selectedNote, setSelectedNote } = useNotesContext();
  const noteRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleNoteSelect = useCallback(
    (note: Note) => {
      setSelectedNote(note);
    },
    [setSelectedNote]
  );

  const selectedIndex = allNotes.findIndex((note) => note.id === selectedNote?.id);

  const { handleArrowUp, handleArrowDown } = useKeyboardNavigation({
    refs: noteRefs,
    length: allNotes.length,
    currentIndex: selectedIndex,
    setSelectedItem: setSelectedNote,
    allItems: allNotes,
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
      h="calc(100vh - 100px)"
      ref={scrollAreaRef}
      role="listbox"
      aria-activedescendant={selectedNote?.id}
    >
      <Stack gap="xs">
        {allNotes.map((note: Note, index) => (
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
