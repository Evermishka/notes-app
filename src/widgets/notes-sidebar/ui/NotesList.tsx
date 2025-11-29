import { useRef, useCallback, useEffect } from 'react';
import { Stack, Text, Skeleton, Alert, ScrollArea } from '@mantine/core';
import { useNoteStore } from '@/entities/note';
import { useKeyboardNavigation } from '@/shared/hooks';
import {
  ERROR_TITLE,
  NOTES_LIST_EMPTY_TEXT,
  NOTES_LIST_SKELETON_COUNT,
  NOTES_LIST_SKELETON_HEIGHT,
  NOTES_LIST_SCROLL_HEIGHT,
  NOTES_LIST_ITEMS_GAP,
  NOTES_LIST_EMPTY_STACK_GAP,
  NOTES_LIST_EMPTY_PADDING,
} from '@/shared/config';
import { NoteItem } from './NoteItem';
import type { Note } from '@/entities/note';

interface NotesListProps {
  filteredNotes: Note[];
  onDrawerClose?: () => void;
}

export const NotesList = ({ filteredNotes, onDrawerClose }: NotesListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { state, actions } = useNoteStore();
  const noteRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleNoteSelect = useCallback(
    (note: Note) => {
      onDrawerClose?.();
      actions.select(note);
    },
    [actions, onDrawerClose]
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
      <Stack gap={NOTES_LIST_ITEMS_GAP}>
        {Array.from({ length: NOTES_LIST_SKELETON_COUNT }).map((_, index) => (
          <Skeleton key={index} height={NOTES_LIST_SKELETON_HEIGHT} />
        ))}
      </Stack>
    );
  }

  if (state.error) {
    return (
      <Alert title={ERROR_TITLE} color="danger">
        {state.error}
      </Alert>
    );
  }

  if (state.notes.length === 0) {
    return (
      <Stack
        align="center"
        justify="center"
        gap={NOTES_LIST_EMPTY_STACK_GAP}
        py={NOTES_LIST_EMPTY_PADDING}
      >
        <Text c="dimmed">{NOTES_LIST_EMPTY_TEXT}</Text>
      </Stack>
    );
  }

  return (
    <ScrollArea
      h={NOTES_LIST_SCROLL_HEIGHT}
      ref={scrollAreaRef}
      role="listbox"
      aria-activedescendant={state.selectedNote?.id}
    >
      <Stack gap={NOTES_LIST_ITEMS_GAP}>
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
