import { useState, useMemo } from 'react';
import { useNoteStore } from '@/entities/note';
import { selectNotes } from '@/entities/note';
import type { Note } from '@/entities/note';

export const useNoteSearch = () => {
  const { state } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allNotes = selectNotes(state);

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
