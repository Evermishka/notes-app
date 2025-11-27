import { useState, useMemo } from 'react';
import { useNoteState } from '@/entities/note';
import type { Note } from '@/entities/note';

export const useNoteSearch = () => {
  const state = useNoteState();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return state.notes;
    }

    const query = searchQuery.toLowerCase();
    return state.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
    );
  }, [state.notes, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredNotes,
  };
};

export const useFilteredNotes = (allNotes: Note[], searchQuery: string) => {
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return allNotes;
    }

    const query = searchQuery.toLowerCase();
    return allNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
    );
  }, [allNotes, searchQuery]);

  return filteredNotes;
};
